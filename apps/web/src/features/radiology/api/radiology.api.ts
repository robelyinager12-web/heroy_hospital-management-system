import { apiClient } from "@/lib/api-client";

export interface RadiologyOrder {
  id: string;
  testName: string;
  status: string;
  resultValue?: string;
  resultFileUrl?: string;
  orderedAt: string;
  completedAt?: string;
  patient: { id: string; patientCode: string; user: { firstName: string; lastName: string } };
}

export interface RadiologyListResponse {
  items: RadiologyOrder[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const radiologyApi = {
  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/radiology?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/radiology", data),
  update: (id: string, data: Record<string, unknown>) => apiClient.put(`/radiology/${id}`, data),
  remove: (id: string) => apiClient.delete(`/radiology/${id}`),
};
