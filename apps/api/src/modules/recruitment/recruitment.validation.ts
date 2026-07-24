import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(2),
  department: z.string().optional(),
  description: z.string().min(10),
  requirements: z.string().optional(),
});

export const updateJobSchema = z.object({
  title: z.string().optional(),
  department: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export const createApplicationSchema = z.object({
  jobPostingId: z.string().min(1),
  applicantName: z.string().min(2),
  applicantEmail: z.string().email(),
  applicantPhone: z.string().optional(),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(["SUBMITTED", "SHORTLISTED", "INTERVIEWING", "OFFERED", "REJECTED", "HIRED"]).optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
