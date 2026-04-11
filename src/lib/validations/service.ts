import { z } from 'zod';

export const serviceCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  price: z.number().min(1, 'Price must be at least 1'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480),
  category: z.string().min(1, 'Category is required'),
  location: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const serviceFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  professionalId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
export type ServiceFilterInput = z.infer<typeof serviceFilterSchema>;
