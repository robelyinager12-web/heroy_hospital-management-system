import { z } from "zod";

export const createRadiologyOrderSchema = z.object({
  patientId: z.string().min(1),
  testName: z.string().min(2), // e.g. "Chest X-Ray", "Brain MRI", "Abdominal CT"
  notes: z.string().optional(),
});

export const updateRadiologyResultSchema = z.object({
  status: z.enum(["ORDERED", "SAMPLE_COLLECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  resultValue: z.string().optional(), // findings/impression text
  resultFileUrl: z.string().optional(), // link to image/report file
  notes: z.string().optional(),
});

export const listRadiologyQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["ORDERED", "SAMPLE_COLLECTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export type CreateRadiologyOrderInput = z.infer<typeof createRadiologyOrderSchema>;
export type UpdateRadiologyResultInput = z.infer<typeof updateRadiologyResultSchema>;
export type ListRadiologyQuery = z.infer<typeof listRadiologyQuerySchema>;
