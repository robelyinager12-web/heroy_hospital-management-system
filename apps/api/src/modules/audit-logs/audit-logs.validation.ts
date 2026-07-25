import { z } from "zod";

export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(30),
  entity: z.string().optional(),
  action: z.string().optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
