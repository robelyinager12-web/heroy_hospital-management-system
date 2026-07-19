import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientUserId: z.string().min(1),
  doctorUserId: z.string().min(1),
  type: z.enum(["IN_PERSON", "VIDEO_CONSULTATION", "EMERGENCY", "FOLLOW_UP"]).default("IN_PERSON"),
  scheduledAt: z.string().min(1),
  durationMins: z.coerce.number().min(5).max(480).default(30),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  scheduledAt: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  cancelledReason: z.string().optional(),
});

export const listAppointmentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
