import { z } from 'zod';

export const doctorSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().optional(),
  specialty: z.string().optional(),
  location: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxPrice: z.coerce.number().optional(),
  language: z.string().optional(),
  verified: z.coerce.boolean().optional(),
  isVirtual: z.boolean().optional(),
  sortBy: z.enum(['rating', 'price', 'reviews', 'experience', 'consultationFee']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const doctorFilterSchema = doctorSearchSchema.omit({ page: true, limit: true });

export type DoctorSearchInput = z.infer<typeof doctorSearchSchema>;
export type DoctorFilterInput = z.infer<typeof doctorFilterSchema>;
