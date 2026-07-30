import { apiClient } from "@/lib/api-client";

export interface OpdVisit {
  id: string;
  visitReason: string;
  status: string;
  scheduledAt: string;
  patient: { id: string; firstName: string; lastName: string };
  doctor: { id: string; firstName: string; lastName: string };
}

export interface OpdListResponse {
  items: OpdVisit[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const opdApi = {
  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/opd?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/opd", data),
  updateStatus: (id: string, status: string) => apiClient.put(`/opd/${id}`, { status }),
  remove: (id: string) => apiClient.delete(`/opd/${id}`),
};
