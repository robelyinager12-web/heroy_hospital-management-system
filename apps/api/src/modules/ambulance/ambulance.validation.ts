import { z } from "zod";

export const createAmbulanceSchema = z.object({
  vehicleNumber: z.string().min(2),
  driverName: z.string().min(2),
  driverPhone: z.string().optional(),
});

export const createRequestSchema = z.object({
  patientId: z.string().optional(),
  pickupLocation: z.string().min(2),
  destination: z.string().min(2),
  notes: z.string().optional(),
});

export const updateRequestSchema = z.object({
  status: z.enum(["REQUESTED", "DISPATCHED", "EN_ROUTE", "COMPLETED", "CANCELLED"]).optional(),
  ambulanceId: z.string().optional(),
});

export const listRequestsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["REQUESTED", "DISPATCHED", "EN_ROUTE", "COMPLETED", "CANCELLED"]).optional(),
});

export type CreateAmbulanceInput = z.infer<typeof createAmbulanceSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
