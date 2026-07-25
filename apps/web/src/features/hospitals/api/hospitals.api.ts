import { apiClient } from "@/lib/api-client";

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  _count?: { users: number; departments: number; patients: number; doctors: number };
}

export interface HospitalListResponse {
  items: Hospital[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const hospitalsApi = {
  list: (page = 1) => apiClient.get(`/hospitals?page=${page}`),
  create: (data: Record<string, unknown>) => apiClient.post("/hospitals", data),
  update: (id: string, data: Record<string, unknown>) => apiClient.put(`/hospitals/${id}`, data),
  remove: (id: string) => apiClient.delete(`/hospitals/${id}`),
};
