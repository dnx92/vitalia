import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'PENDING';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where: any = {};
  if (status !== 'ALL') where.verificationStatus = status;

  const [professionals, total] = await Promise.all([
    prisma.professional.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    }),
    prisma.professional.count({ where }),
  ]);

  return NextResponse.json({
    professionals,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { professionalId, action } = body;

  if (!professionalId || !action) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const status = action === 'approve' ? 'APPROVED' : 'REJECTED';

  const professional = await prisma.professional.update({
    where: { id: professionalId },
    data: { verificationStatus: status },
    include: { user: { select: { email: true, name: true } } },
  });

  return NextResponse.json(professional);
}
