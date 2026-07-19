import { apiClient } from "@/lib/api-client";

export interface Patient {
  userId: string;
  id: string;
  patientCode: string;
  gender?: string;
  bloodGroup?: string;
  city?: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export interface PatientListResponse {
  items: Patient[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const patientsApi = {
  list: (params: { page?: number; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search) query.set("search", params.search);
    return apiClient.get(`/patients?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/patients", data),
  remove: (id: string) => apiClient.delete(`/patients/${id}`),
};