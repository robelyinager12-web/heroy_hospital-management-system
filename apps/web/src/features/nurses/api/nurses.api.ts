import { apiClient } from "@/lib/api-client";

export interface Nurse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  avatarUrl?: string;
}

export interface NurseListResponse {
  items: Nurse[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const nursesApi = {
  list: (params: { page?: number; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search) query.set("search", params.search);
    return apiClient.get(`/nurses?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/nurses", data),
  remove: (id: string) => apiClient.delete(`/nurses/${id}`),
};
