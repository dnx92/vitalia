import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appointmentCreateSchema } from '@/lib/validations';
import {
  successResponse,
  errorResponse,
  createdResponse,
  paginatedResponse,
} from '@/lib/api/response';
import { ValidationError, NotFoundError } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');
    const professionalId = searchParams.get('professionalId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};

    if (userId) {
      where.patientId = userId;
    }

    if (professionalId) {
      where.professionalId = professionalId;
    }

    if (status) {
      const statuses = status.split(',').map((s) => s.trim());
      if (statuses.length === 1) {
        where.status = statuses[0];
      } else {
        where.status = { in: statuses };
      }
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          patient: {
            select: { id: true, name: true, email: true, image: true, avatar: true },
          },
          professional: {
            include: {
              user: { select: { id: true, name: true, email: true, image: true, avatar: true } },
            },
          },
          service: {
            select: {
              id: true,
              title: true,
              price: true,
              duration: true,
              isVirtual: true,
              location: true,
            },
          },
          review: { select: { id: true, rating: true } },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      professional: {
        id: apt.professional.id,
        name: apt.professional.user?.name || 'Unknown',
        specialty: apt.professional.specialty,
        title: apt.professional.title,
        avatar: apt.professional.user?.avatar || apt.professional.user?.image,
        rating: apt.professional.rating ? Number(apt.professional.rating) : null,
        reviewCount: apt.professional.reviewCount,
        location: apt.professional.location,
      },
      service: {
        id: apt.service?.id,
        title: apt.service?.title,
        price: Number(apt.service?.price || 0),
        duration: apt.service?.duration,
        isVirtual: apt.service?.isVirtual,
        location: apt.service?.location,
      },
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      duration: apt.duration,
      status: apt.status,
      isVirtual: apt.isVirtual,
      meetingLink: apt.meetingLink,
      location: apt.location,
      notes: apt.notes,
      totalAmount: Number(apt.totalAmount),
      paymentStatus: apt.paymentStatus,
      hasReview: !!apt.review,
      createdAt: apt.createdAt,
    }));

    return paginatedResponse(formattedAppointments, page, limit, total);
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = appointmentCreateSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      throw new ValidationError('Validation failed', errors);
    }

    const { professionalId, serviceId, patientId, date, startTime, notes, isVirtual } = result.data;

    const [service, professional] = await Promise.all([
      prisma.service.findUnique({
        where: { id: serviceId },
        include: { professional: { include: { user: true } } },
      }),
      prisma.professional.findUnique({
        where: { id: professionalId },
        include: { user: true },
      }),
    ]);

    if (!service) {
      throw new NotFoundError('Service');
    }

    if (!professional) {
      throw new NotFoundError('Professional');
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        professionalId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime: body.endTime || startTime,
        duration: service.duration,
        totalAmount: service.price,
        platformFee: Number(service.price) * 0.05,
        professionalEarning: Number(service.price) * 0.95,
        notes,
        patientNotes: body.patientNotes,
        isVirtual: isVirtual ?? service.isVirtual,
        location: isVirtual === false ? body.location || service.location : null,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        professional: {
          include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        },
        service: true,
        patient: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    return createdResponse({
      appointment,
      message: 'Appointment created successfully. Proceed to payment.',
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, status, meetingLink, cancellationReason } = body;

    if (!appointmentId) {
      throw new ValidationError('Appointment ID is required');
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status.toUpperCase();
      if (status.toUpperCase() === 'CANCELLED') {
        updateData.cancelledAt = new Date();
        updateData.cancellationReason = cancellationReason;
      }
    }

    if (meetingLink) {
      updateData.meetingLink = meetingLink;
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        professional: { include: { user: true } },
        service: true,
        patient: true,
      },
    });

    return successResponse({
      appointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
