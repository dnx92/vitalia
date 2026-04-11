import { z } from 'zod';

export const appointmentCreateSchema = z.object({
  professionalId: z.string().min(1, 'Professional is required'),
  serviceId: z.string().min(1, 'Service is required'),
  patientId: z.string().min(1, 'Patient is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Time is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  patientNotes: z.string().max(1000).optional(),
  isVirtual: z.boolean().optional(),
  location: z.string().optional(),
});

export const appointmentUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  meetingLink: z.string().url().optional().or(z.literal('')),
  cancellationReason: z.string().max(500).optional(),
});

export const appointmentFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  professionalId: z.string().optional(),
  patientId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isVirtual: z.boolean().optional(),
});

export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;
export type AppointmentFilterInput = z.infer<typeof appointmentFilterSchema>;
