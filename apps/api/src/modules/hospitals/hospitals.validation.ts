import { z } from "zod";

export const createHospitalSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const updateHospitalSchema = createHospitalSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof updateHospitalSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
