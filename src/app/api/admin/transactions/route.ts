import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const where: any = {};
  if (type && type !== 'ALL') where.type = type;
  if (status && status !== 'ALL') where.status = status;

  const [transactions, total, volumeByType] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { wallet: { include: { user: { select: { name: true, email: true } } } } },
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    transactions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    volumeByType,
  });
}
