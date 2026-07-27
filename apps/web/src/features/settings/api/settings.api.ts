import { apiClient } from "@/lib/api-client";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export const settingsApi = {
  getProfile: () => apiClient.get("/auth/me"),
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => apiClient.put("/auth/me", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put("/auth/me/password", data),
};
