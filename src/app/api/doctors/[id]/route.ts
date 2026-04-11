import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const professional = await prisma.professional.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        services: {
          where: { isActive: true },
        },
        reviews: {
          include: {
            patient: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!professional) {
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
    }

    return NextResponse.json({
      doctor: {
        id: professional.id,
        name: professional.user.name || 'Unknown',
        email: professional.user.email,
        image: professional.user.image,
        specialty: professional.specialty,
        title: professional.title,
        bio: professional.bio,
        location: 'US',
        rating: professional.rating ? Number(professional.rating) : 0,
        reviewCount: professional.reviewCount,
        languages: professional.languages,
        verified: professional.verificationStatus === 'APPROVED',
        services: professional.services.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          price: Number(s.price),
          duration: s.duration,
          category: s.category,
          location: 'US',
        })),
        reviews: professional.reviews.map((r) => ({
          id: r.id,
          userName: r.patient.name || 'Anonymous',
          rating: r.rating,
          comment: r.comment,
          date: r.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}
