import { apiClient } from "@/lib/api-client";
import { LoginFormValues, RegisterFormValues } from "@/lib/validators/auth.schema";

export const authApi = {
  login: (data: LoginFormValues) => apiClient.post("/auth/login", data),
  register: (data: Omit<RegisterFormValues, "confirmPassword">) => apiClient.post("/auth/register", data),
  logout: () => apiClient.post("/auth/logout"),
};
