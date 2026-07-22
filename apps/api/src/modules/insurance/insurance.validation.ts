import { z } from "zod";

export const createPolicySchema = z.object({
  patientId: z.string().min(1),
  provider: z.string().min(2),
  policyNumber: z.string().min(2),
  coverageDetails: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});

export const updatePolicySchema = z.object({
  status: z.enum(["ACTIVE", "EXPIRED", "CANCELLED"]).optional(),
  coverageDetails: z.string().optional(),
  endDate: z.string().optional(),
});

export const createClaimSchema = z.object({
  policyId: z.string().min(1),
  invoiceId: z.string().optional(),
  amountClaimed: z.coerce.number().positive(),
  notes: z.string().optional(),
});

export const updateClaimSchema = z.object({
  status: z.enum(["SUBMITTED", "APPROVED", "REJECTED", "PAID"]).optional(),
});

export const listPoliciesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export const listClaimsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["SUBMITTED", "APPROVED", "REJECTED", "PAID"]).optional(),
});

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;
export type CreateClaimInput = z.infer<typeof createClaimSchema>;
export type UpdateClaimInput = z.infer<typeof updateClaimSchema>;
export type ListPoliciesQuery = z.infer<typeof listPoliciesQuerySchema>;
export type ListClaimsQuery = z.infer<typeof listClaimsQuerySchema>;
