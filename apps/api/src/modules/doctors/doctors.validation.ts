import { z } from "zod";

export const createDoctorSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  specialization: z.string().min(2),
  licenseNumber: z.string().min(2),
  qualifications: z.string().optional(),
  yearsExperience: z.coerce.number().min(0).optional(),
  consultationFee: z.coerce.number().min(0).optional(),
  bio: z.string().optional(),
  departmentId: z.string().optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial().omit({ email: true });

export const listDoctorsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type ListDoctorsQuery = z.infer<typeof listDoctorsQuerySchema>;
