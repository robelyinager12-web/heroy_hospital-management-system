import { z } from "zod";

export const createOpdVisitSchema = z.object({
  patientUserId: z.string().min(1),
  doctorUserId: z.string().min(1),
  reason: z.string().min(2),
  notes: z.string().optional(),
});

export const updateOpdVisitSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(30),
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
});

export type CreateOpdVisitInput = z.infer<typeof createOpdVisitSchema>;
export type UpdateOpdVisitInput = z.infer<typeof updateOpdVisitSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
