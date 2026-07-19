import { z } from "zod";

export const createEmergencyCaseSchema = z.object({
  patientId: z.string().min(1),
  reason: z.string().min(2),
  notes: z.string().optional(),
});

export const updateEmergencyCaseSchema = z.object({
  reason: z.string().optional(),
  notes: z.string().optional(),
  dischargedAt: z.string().optional(),
});

export const listEmergencyQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  activeOnly: z.coerce.boolean().optional(),
});

export type CreateEmergencyCaseInput = z.infer<typeof createEmergencyCaseSchema>;
export type UpdateEmergencyCaseInput = z.infer<typeof updateEmergencyCaseSchema>;
export type ListEmergencyQuery = z.infer<typeof listEmergencyQuerySchema>;
