import { z } from "zod";

export const createExpenseSchema = z.object({
  description: z.string().min(2),
  category: z.enum(["SALARIES", "SUPPLIES", "EQUIPMENT", "UTILITIES", "MAINTENANCE", "OTHER"]),
  amount: z.coerce.number().positive(),
  incurredAt: z.string().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  category: z.enum(["SALARIES", "SUPPLIES", "EQUIPMENT", "UTILITIES", "MAINTENANCE", "OTHER"]).optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
