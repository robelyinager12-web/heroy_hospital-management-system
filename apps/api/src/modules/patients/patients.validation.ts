import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(), // ISO date string from frontend
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bloodGroup: z
    .enum(["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"])
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  emergencyContact: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial().omit({ email: true });

export const listPatientsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type ListPatientsQuery = z.infer<typeof listPatientsQuerySchema>;