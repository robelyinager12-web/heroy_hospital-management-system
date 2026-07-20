import { z } from "zod";

export const createWardSchema = z.object({
  name: z.string().min(2),
  floor: z.string().optional(),
});

export const createBedSchema = z.object({
  wardId: z.string().min(1),
  bedNumber: z.string().min(1),
});

export const admitPatientSchema = z.object({
  patientId: z.string().min(1),
  bedId: z.string().min(1),
  reason: z.string().min(2),
  notes: z.string().optional(),
});

export const listAdmissionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  activeOnly: z.coerce.boolean().optional(),
});

export type CreateWardInput = z.infer<typeof createWardSchema>;
export type CreateBedInput = z.infer<typeof createBedSchema>;
export type AdmitPatientInput = z.infer<typeof admitPatientSchema>;
export type ListAdmissionsQuery = z.infer<typeof listAdmissionsQuerySchema>;
