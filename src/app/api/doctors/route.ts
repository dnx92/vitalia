import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { doctorSearchSchema } from '@/lib/validations';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { ValidationError } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  try {
    const result = doctorSearchSchema.safeParse(
      Object.fromEntries(new URL(request.url).searchParams)
    );

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      throw new ValidationError('Invalid query parameters', errors);
    }

    const {
      page,
      limit,
      search,
      specialty,
      location,
      minRating,
      maxPrice,
      language,
      verified,
      sortBy,
      sortOrder,
      isVirtual,
    } = result.data;

    const where: Record<string, unknown> = {
      isActive: true,
      acceptingPatients: true,
    };

    if (specialty) {
      where.specialty = { contains: specialty, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { specialty: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minRating) {
      where.rating = { gte: minRating };
    }

    if (language) {
      where.languages = { has: language };
    }

    if (verified !== undefined) {
      where.verificationStatus = verified ? 'APPROVED' : 'PENDING';
    }

    if (isVirtual !== undefined) {
      where.isVirtual = isVirtual;
    }

    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { location: { contains: location, mode: 'insensitive' } },
      ];
    }

    const orderBy: Record<string, string> = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc';
    } else {
      orderBy.rating = 'desc';
    }

    const [professionals, total] = await Promise.all([
      prisma.professional.findMany({
        where,
        skip: ((page || 1) - 1) * (limit || 20),
        take: limit || 20,
        orderBy,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, avatar: true },
          },
          services: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            take: 5,
          },
          _count: {
            select: { appointments: { where: { status: 'COMPLETED' } } },
          },
        },
      }),
      prisma.professional.count({ where }),
    ]);

    const doctors = professionals.map((p) => ({
      id: p.id,
      name: p.user?.name || 'Unknown',
      email: p.user?.email,
      image: p.user?.avatar || p.user?.image,
      specialty: p.specialty,
      subSpecialties: p.subSpecialties,
      title: p.title,
      bio: p.bio,
      location: p.location || p.city || p.state || 'United States',
      city: p.city,
      state: p.state,
      country: p.country,
      rating: p.rating ? Number(p.rating) : null,
      reviewCount: p.reviewCount,
      languages: p.languages,
      yearsExperience: p.yearsExperience,
      isVirtual: p.isVirtual,
      consultationFee: Number(p.consultationFee),
      price: p.services[0] ? Number(p.services[0].price) : Number(p.consultationFee),
      services: p.services.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        price: Number(s.price),
        duration: s.duration,
        isVirtual: s.isVirtual,
        location: s.location,
      })),
      verified: p.verificationStatus === 'APPROVED',
      verificationStatus: p.verificationStatus,
      completedAppointments: p._count.appointments,
      acceptingPatients: p.acceptingPatients,
      licenseNumber: p.licenseNumber,
      npiNumber: p.npiNumber,
    }));

    let filteredDoctors = doctors;

    if (maxPrice) {
      filteredDoctors = doctors.filter((d) => d.price <= maxPrice * 100);
    }

    return paginatedResponse(filteredDoctors, page || 1, limit || 20, total);
  } catch (error) {
    return errorResponse(error as Error);
  }
}
