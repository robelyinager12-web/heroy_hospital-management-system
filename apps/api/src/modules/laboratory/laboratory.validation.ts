import { z } from "zod";

export const createLabTestSchema = z.object({
  patientId: z.string().min(1),
  testName: z.string().min(2),
  notes: z.string().optional(),
});

export const updateLabResultSchema = z.object({
  status: z.enum(["ORDERED", "SAMPLE_COLLECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  resultValue: z.string().optional(),
  resultUnit: z.string().optional(),
  referenceRange: z.string().optional(),
  notes: z.string().optional(),
});

export const listLabTestsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["ORDERED", "SAMPLE_COLLECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export type CreateLabTestInput = z.infer<typeof createLabTestSchema>;
export type UpdateLabResultInput = z.infer<typeof updateLabResultSchema>;
export type ListLabTestsQuery = z.infer<typeof listLabTestsQuerySchema>;
