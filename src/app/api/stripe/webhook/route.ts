import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as Record<string, unknown>;

        if (session.metadata && (session.metadata as Record<string, string>).type === 'deposit') {
          const userId = (session.metadata as Record<string, string>).userId;
          const walletId = (session.metadata as Record<string, string>).walletId;
          const amount = ((session.amount_total as number) || 0) / 100;
          const fee = amount * 0.029 + 0.3;
          const netAmount = amount - fee;

          await prisma.wallet.update({
            where: { id: walletId },
            data: {
              balance: { increment: amount },
              available: { increment: netAmount },
            },
          });

          await prisma.transaction.create({
            data: {
              walletId,
              type: 'DEPOSIT',
              amount,
              fee,
              netAmount,
              status: 'COMPLETED',
              description: 'Deposit via Stripe',
              stripePaymentId: session.id as string,
              completedAt: new Date(),
            },
          });

          console.log(`Deposit completed: $${amount} for user ${userId}`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as unknown as Record<string, unknown>;
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as unknown as Record<string, unknown>;
        console.log(`PaymentIntent failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
