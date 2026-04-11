import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, amount, returnUrl } = await request.json();

    if (!userId || !amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum deposit is $1.00' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Vitalia Wallet Deposit',
              description: `Add funds to your Vitalia wallet`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        walletId: user.wallet.id,
        type: 'deposit',
      },
      success_url: `${returnUrl || process.env.AUTH_URL}/dashboard/wallet?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl || process.env.AUTH_URL}/dashboard/wallet?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
