import { z } from "zod";

export const createSurgerySchema = z.object({
  patientUserId: z.string().min(1),
  surgeonUserId: z.string().min(1),
  procedureName: z.string().min(2),
  scheduledAt: z.string().min(1),
  durationMins: z.coerce.number().min(15).max(600).default(90),
  notes: z.string().optional(),
});

export const updateSurgerySchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  scheduledAt: z.string().optional(),
  notes: z.string().optional(),
});

export const listSurgeriesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z
    .enum(["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"])
    .optional(),
});

export type CreateSurgeryInput = z.infer<typeof createSurgerySchema>;
export type UpdateSurgeryInput = z.infer<typeof updateSurgerySchema>;
export type ListSurgeriesQuery = z.infer<typeof listSurgeriesQuerySchema>;
