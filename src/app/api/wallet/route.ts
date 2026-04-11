import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transactionFilterSchema } from '@/lib/validations';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { ValidationError, NotFoundError } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');
    const walletId = searchParams.get('walletId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    if (!userId && !walletId) {
      throw new ValidationError('User ID or Wallet ID is required');
    }

    const walletWhere = walletId ? { id: walletId } : { userId: userId as string };

    const wallet = await prisma.wallet.findUnique({
      where: walletWhere,
      include: {
        transactions: {
          where: {
            ...(type && {
              type: type as
                | 'DEPOSIT'
                | 'WITHDRAWAL'
                | 'PAYMENT'
                | 'REFUND'
                | 'ESCROW_HOLD'
                | 'ESCROW_RELEASE'
                | 'APPOINTMENT_FEE'
                | 'PLATFORM_FEE',
            }),
            ...(status && {
              status: status as 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED',
            }),
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundError('Wallet');
    }

    const [totalTransactions, pendingHold] = await Promise.all([
      prisma.transaction.count({ where: { walletId: wallet.id } }),
      prisma.transaction.aggregate({
        where: {
          walletId: wallet.id,
          type: 'ESCROW_HOLD',
          status: 'PENDING',
        },
        _sum: { amount: true },
      }),
    ]);

    return successResponse(
      {
        wallet: {
          id: wallet.id,
          userId: wallet.userId,
          user: wallet.user,
          balance: Number(wallet.balance),
          available: Number(wallet.available),
          pending: Number(wallet.pending),
          currency: wallet.currency,
          isActive: wallet.isActive,
          stripeCustomerId: wallet.stripeCustomerId,
          pendingHold: Math.abs(Number(pendingHold._sum.amount) || 0),
        },
        transactions: wallet.transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: Number(t.amount),
          fee: Number(t.fee),
          netAmount: Number(t.netAmount),
          status: t.status,
          description: t.description,
          reference: t.reference,
          stripePaymentId: t.stripePaymentId,
          stripeChargeId: t.stripeChargeId,
          metadata: t.metadata,
          completedAt: t.completedAt,
          createdAt: t.createdAt,
        })),
      },
      200,
      {
        page,
        limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
      }
    );
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, walletId, amount, type, description, stripePaymentId, metadata } = body;

    if (!amount || !type) {
      throw new ValidationError('Amount and type are required');
    }

    const whereClause = walletId ? { id: walletId } : { userId: userId as string };

    let wallet = await prisma.wallet.findUnique({
      where: whereClause,
    });

    if (!wallet && userId) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          available: 0,
          pending: 0,
        },
      });
    }

    if (!wallet) {
      throw new NotFoundError('Wallet');
    }

    const validTypes = [
      'DEPOSIT',
      'WITHDRAWAL',
      'PAYMENT',
      'REFUND',
      'ESCROW_HOLD',
      'ESCROW_RELEASE',
      'APPOINTMENT_FEE',
      'PLATFORM_FEE',
    ];

    if (!validTypes.includes(type.toUpperCase())) {
      throw new ValidationError(
        `Invalid transaction type. Must be one of: ${validTypes.join(', ')}`
      );
    }

    const transactionType = type.toUpperCase();
    const isDeduction = ['WITHDRAWAL', 'PAYMENT', 'APPOINTMENT_FEE', 'PLATFORM_FEE'].includes(
      transactionType
    );
    const transactionAmount = Math.abs(amount);
    const fee = transactionType === 'DEPOSIT' ? transactionAmount * 0.029 + 0.3 : 0;
    const netAmount = transactionAmount - fee;

    if (isDeduction && Number(wallet.available) < transactionAmount) {
      throw new ValidationError('Insufficient available balance');
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          walletId: wallet!.id,
          type: transactionType,
          amount: isDeduction ? -transactionAmount : transactionAmount,
          fee,
          netAmount: isDeduction ? -netAmount : netAmount,
          status: transactionType === 'ESCROW_HOLD' ? 'PENDING' : 'COMPLETED',
          description,
          stripePaymentId,
          stripeChargeId: body.stripeChargeId,
          metadata: metadata || {},
          completedAt: transactionType === 'ESCROW_HOLD' ? null : new Date(),
        },
      });

      const balanceUpdate = isDeduction
        ? { decrement: transactionAmount }
        : { increment: transactionAmount };

      const availableUpdate = isDeduction
        ? { decrement: transactionAmount }
        : { increment: netAmount };

      await tx.wallet.update({
        where: { id: wallet!.id },
        data: {
          balance: balanceUpdate,
          available: availableUpdate,
          ...(transactionType === 'ESCROW_HOLD' && { pending: { increment: transactionAmount } }),
        },
      });

      return newTransaction;
    });

    return successResponse({
      transaction: {
        id: transaction.id,
        type: transaction.type,
        amount: Number(transaction.amount),
        fee: Number(transaction.fee),
        netAmount: Number(transaction.netAmount),
        status: transaction.status,
        description: transaction.description,
        createdAt: transaction.createdAt,
      },
      message: 'Transaction completed successfully',
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
