import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  unit: z.string().min(1),
  quantity: z.coerce.number().min(0).default(0),
  reorderLevel: z.coerce.number().min(0).default(10),
  unitCost: z.coerce.number().min(0).optional(),
  expiryDate: z.string().optional(),
});

export const updateMedicineSchema = createMedicineSchema.partial();

export const adjustStockSchema = z.object({
  delta: z.coerce.number(), // positive = restock, negative = dispense
  reason: z.string().optional(),
});

export const listMedicinesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  lowStockOnly: z.coerce.boolean().optional(),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type ListMedicinesQuery = z.infer<typeof listMedicinesQuerySchema>;
