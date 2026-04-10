import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: {
    patient: { select: { id: true; name: true; email: true; image: true } };
    professional: {
      include: { user: { select: { id: true; name: true; email: true; image: true } } };
    };
    service: { select: { id: true; title: true; price: true; duration: true } };
  };
}>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const where: Prisma.AppointmentWhereInput = {
      OR: [
        { patientId: userId },
        { professional: { userId } },
      ],
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase() as any;
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          professional: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          service: {
            select: {
              id: true,
              title: true,
              price: true,
              duration: true,
            },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    const formattedAppointments = appointments.map((apt: AppointmentWithRelations) => ({
      id: apt.id,
      professional: {
        id: apt.professional.id,
        name: apt.professional.user.name || "Unknown",
        specialty: apt.professional.specialty,
        location: "US",
        avatar: apt.professional.user.image,
      },
      service: apt.service.title,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      price: Number(apt.totalAmount),
      isVirtual: false,
      notes: apt.notes,
    }));

    return NextResponse.json({
      appointments: formattedAppointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, professionalId, serviceId, date, startTime, endTime, notes } = body;

    if (!patientId || !professionalId || !serviceId || !date || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        professionalId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime: endTime || startTime,
        totalAmount: service.price,
        notes,
        status: "PENDING",
      },
      include: {
        professional: {
          include: { user: true },
        },
        service: true,
        patient: true,
      },
    });

    return NextResponse.json({
      appointment,
      message: "Appointment created successfully",
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, status, userId } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: status.toUpperCase() },
      include: {
        professional: { include: { user: true } },
        service: true,
        patient: true,
      },
    });

    return NextResponse.json({
      appointment,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
