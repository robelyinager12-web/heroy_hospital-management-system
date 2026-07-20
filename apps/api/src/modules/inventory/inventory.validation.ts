import { z } from "zod";

export const createInventoryItemSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["equipment", "supply"]),
  sku: z.string().min(2),
  unit: z.string().min(1),
  quantity: z.coerce.number().min(0).default(0),
  reorderLevel: z.coerce.number().min(0).default(10),
  unitCost: z.coerce.number().min(0).optional(),
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial();

export const adjustStockSchema = z.object({
  delta: z.coerce.number(),
  reason: z.string().optional(),
});

export const listInventoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.enum(["equipment", "supply"]).optional(),
  lowStockOnly: z.coerce.boolean().optional(),
});

export type CreateInventoryItemInput = z.infer<typeof createInventoryItemSchema>;
export type UpdateInventoryItemInput = z.infer<typeof updateInventoryItemSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type ListInventoryQuery = z.infer<typeof listInventoryQuerySchema>;
