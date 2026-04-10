import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (type) where.type = type;

    const metrics = await prisma.healthMetric.findMany({
      where,
      orderBy: { recordedAt: "desc" },
    });

    const formattedMetrics = metrics.map((m) => ({
      id: m.id,
      type: m.type,
      value: Number(m.value),
      unit: m.unit,
      notes: m.notes,
      recordedAt: m.recordedAt,
    }));

    return NextResponse.json({ metrics: formattedMetrics });
  } catch (error) {
    console.error("Error fetching health metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch health metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, type, value, unit, notes } = body;

    if (!userId || !type || !value || !unit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const metric = await prisma.healthMetric.create({
      data: {
        userId,
        type,
        value,
        unit,
        notes,
        recordedAt: new Date(),
      },
    });

    const thresholds = {
      blood_pressure: { min: 90, max: 140 },
      heart_rate: { min: 60, max: 100 },
      blood_sugar: { min: 70, max: 140 },
      weight: { min: 50, max: 150 },
    };

    if (thresholds[type as keyof typeof thresholds]) {
      const { min, max } = thresholds[type as keyof typeof thresholds];
      if (value < min || value > max) {
        await prisma.healthAlert.create({
          data: {
            userId,
            type,
            message: `Your ${type.replace("_", " ")} value is outside the normal range`,
            threshold: value < min ? min : max,
            currentValue: value,
          },
        });
      }
    }

    return NextResponse.json({
      metric: {
        id: metric.id,
        type: metric.type,
        value: Number(metric.value),
        unit: metric.unit,
        notes: metric.notes,
        recordedAt: metric.recordedAt,
      },
      message: "Health metric recorded successfully",
    });
  } catch (error) {
    console.error("Error recording health metric:", error);
    return NextResponse.json(
      { error: "Failed to record health metric" },
      { status: 500 }
    );
  }
}
