import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, "Must include an uppercase letter").regex(/[0-9]/, "Must include a number"),
  role: z.enum([
    "SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST",
    "PHARMACIST", "LAB_TECHNICIAN", "ACCOUNTANT", "PATIENT", "HR_MANAGER",
    "AMBULANCE_DRIVER", "INSURANCE_OFFICER",
  ]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
