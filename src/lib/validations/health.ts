import { z } from 'zod';

export const healthMetricCreateSchema = z.object({
  type: z.string().min(1, 'Metric type is required'),
  value: z.number(),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string().max(500).optional(),
  recordedAt: z.string().optional(),
});

export const healthMetricUpdateSchema = z.object({
  value: z.number().optional(),
  notes: z.string().max(500).optional(),
});

export const healthMetricFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const reviewCreateSchema = z.object({
  professionalId: z.string().min(1, 'Professional is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});

export type HealthMetricCreateInput = z.infer<typeof healthMetricCreateSchema>;
export type HealthMetricUpdateInput = z.infer<typeof healthMetricUpdateSchema>;
export type HealthMetricFilterInput = z.infer<typeof healthMetricFilterSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
