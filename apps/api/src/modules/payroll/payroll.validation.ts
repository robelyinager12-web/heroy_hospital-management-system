import { z } from "zod";

export const createPayslipSchema = z.object({
  employeeId: z.string().min(1),
  baseSalary: z.coerce.number().positive(),
  bonus: z.coerce.number().min(0).default(0),
  deductions: z.coerce.number().min(0).default(0),
  periodMonth: z.coerce.number().min(1).max(12),
  periodYear: z.coerce.number().min(2020),
});

export const updatePayslipSchema = z.object({
  status: z.enum(["PENDING", "PAID"]).optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(30),
});

export type CreatePayslipInput = z.infer<typeof createPayslipSchema>;
export type UpdatePayslipInput = z.infer<typeof updatePayslipSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
