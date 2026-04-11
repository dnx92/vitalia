import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const role = searchParams.get('role');
  const search = searchParams.get('search');

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { professional: true },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');
  const action = searchParams.get('action');

  if (!userId || !action) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  if (action === 'toggleAdmin') {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: true },
    });
    return NextResponse.json(user);
  }

  if (action === 'removeAdmin') {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: false },
    });
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
