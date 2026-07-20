import { z } from "zod";

const bloodGroups = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
] as const;

export const adjustStockSchema = z.object({
  bloodGroup: z.enum(bloodGroups),
  delta: z.coerce.number(),
});

export const createRequestSchema = z.object({
  patientId: z.string().optional(),
  bloodGroup: z.enum(bloodGroups),
  unitsRequested: z.coerce.number().min(1),
  notes: z.string().optional(),
});

export const updateRequestSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "FULFILLED", "CANCELLED"]).optional(),
});

export const listRequestsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["PENDING", "APPROVED", "FULFILLED", "CANCELLED"]).optional(),
});

export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
