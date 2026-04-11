import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api/response';
import { ValidationError, NotFoundError } from '@/lib/api/errors';

const HEALTH_THRESHOLDS: Record<string, { min: number; max: number; unit: string }> = {
  blood_pressure_systolic: { min: 90, max: 140, unit: 'mmHg' },
  blood_pressure_diastolic: { min: 60, max: 90, unit: 'mmHg' },
  heart_rate: { min: 60, max: 100, unit: 'bpm' },
  blood_sugar: { min: 70, max: 140, unit: 'mg/dL' },
  weight: { min: 30, max: 200, unit: 'kg' },
  height: { min: 100, max: 220, unit: 'cm' },
  temperature: { min: 36.1, max: 37.2, unit: '°C' },
  oxygen_saturation: { min: 95, max: 100, unit: '%' },
  steps: { min: 0, max: 20000, unit: 'steps' },
  sleep_hours: { min: 6, max: 9, unit: 'hours' },
  calories_burned: { min: 0, max: 5000, unit: 'kcal' },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const where: Record<string, unknown> = { userId };

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) (where.recordedAt as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.recordedAt as Record<string, Date>).lte = new Date(endDate);
    }

    const [metrics, alerts, stats] = await Promise.all([
      prisma.healthMetric.findMany({
        where,
        orderBy: { recordedAt: 'desc' },
        take: limit,
      }),
      prisma.healthAlert.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.healthMetric.groupBy({
        by: ['type'],
        where: { userId },
        _avg: { value: true },
        _min: { value: true },
        _max: { value: true },
        _count: { _all: true },
      }),
    ]);

    const formattedMetrics = metrics.map((m) => ({
      id: m.id,
      type: m.type,
      value: Number(m.value),
      unit: m.unit,
      notes: m.notes,
      source: m.source,
      device: m.device,
      recordedAt: m.recordedAt,
    }));

    const formattedStats = stats.map((s) => ({
      type: s.type,
      count: s._count._all,
      avg: s._avg.value ? Number(s._avg.value) : null,
      min: s._min.value ? Number(s._min.value) : null,
      max: s._max.value ? Number(s._max.value) : null,
    }));

    return successResponse(
      {
        metrics: formattedMetrics,
        alerts: alerts.map((a) => ({
          id: a.id,
          type: a.type,
          category: a.category,
          message: a.message,
          threshold: Number(a.threshold),
          currentValue: Number(a.currentValue),
          unit: a.unit,
          severity: a.severity,
          createdAt: a.createdAt,
        })),
        stats: formattedStats,
      },
      200,
      {
        page: 1,
        limit,
        total: metrics.length,
        totalPages: Math.ceil(metrics.length / limit),
      }
    );
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, value, unit, notes, source, device, recordedAt } = body;

    if (!userId || !type || value === undefined || !unit) {
      throw new ValidationError('User ID, type, value, and unit are required');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User');
    }

    const metric = await prisma.healthMetric.create({
      data: {
        userId,
        type,
        value,
        unit,
        notes,
        source: source || 'manual',
        device,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      },
    });

    const threshold = HEALTH_THRESHOLDS[type];
    if (threshold) {
      const isOutOfRange = value < threshold.min || value > threshold.max;
      if (isOutOfRange) {
        const severity =
          value < threshold.min ? 'low' : value > threshold.max * 1.2 ? 'high' : 'medium';
        await prisma.healthAlert.create({
          data: {
            userId,
            type,
            category: 'health_metric',
            message: `Your ${type.replace('_', ' ')} value (${value} ${unit}) is ${
              value < threshold.min ? 'below' : 'above'
            } the normal range (${threshold.min}-${threshold.max} ${threshold.unit})`,
            threshold: value < threshold.min ? threshold.min : threshold.max,
            currentValue: value,
            unit,
            severity,
          },
        });
      }
    }

    return successResponse({
      metric: {
        id: metric.id,
        type: metric.type,
        value: Number(metric.value),
        unit: metric.unit,
        notes: metric.notes,
        source: metric.source,
        recordedAt: metric.recordedAt,
      },
      message: 'Health metric recorded successfully',
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
