import { apiClient } from "@/lib/api-client";

export interface EmergencyCase {
  id: string;
  reason: string;
  notes?: string;
  admittedAt: string;
  dischargedAt?: string;
  patient: {
    id: string;
    patientCode: string;
    user: { firstName: string; lastName: string; phone?: string };
  };
}

export interface EmergencyListResponse {
  items: EmergencyCase[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const emergencyApi = {
  list: (params: { page?: number; activeOnly?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.activeOnly) query.set("activeOnly", "true");
    return apiClient.get(`/emergency?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/emergency", data),
  discharge: (id: string) => apiClient.post(`/emergency/${id}/discharge`),
  remove: (id: string) => apiClient.delete(`/emergency/${id}`),
};
