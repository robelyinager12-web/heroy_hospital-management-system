import { apiClient } from "@/lib/api-client";

export interface Surgery {
  id: string;
  procedureName: string;
  status: string;
  scheduledAt: string;
  durationMins: number;
  notes?: string;
  patient: { id: string; firstName: string; lastName: string };
  doctor: { id: string; firstName: string; lastName: string };
}

export interface SurgeryListResponse {
  items: Surgery[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const surgeryApi = {
  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/surgery?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/surgery", data),
  updateStatus: (id: string, status: string) => apiClient.put(`/surgery/${id}`, { status }),
  remove: (id: string) => apiClient.delete(`/surgery/${id}`),
};
