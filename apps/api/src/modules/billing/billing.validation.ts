import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().min(1).default(1),
  unitPrice: z.coerce.number().min(0),
});

export const createInvoiceSchema = z.object({
  patientId: z.string().min(1),
  items: z.array(invoiceItemSchema).min(1),
  tax: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  dueDate: z.string().optional(),
});

export const recordPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  method: z.enum(["CASH", "CARD", "BANK_TRANSFER", "INSURANCE", "MOBILE_MONEY"]),
  transactionRef: z.string().optional(),
});

export const listInvoicesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["DRAFT", "PENDING", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]).optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
export type ListInvoicesQuery = z.infer<typeof listInvoicesQuerySchema>;
