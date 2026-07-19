import { apiClient } from "@/lib/api-client";

export interface Doctor {
  userId: string;
  id: string;
  doctorCode: string;
  specialization: string;
  licenseNumber: string;
  consultationFee?: string;
  isAvailable: boolean;
  department?: { name: string } | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
}

export interface DoctorListResponse {
  items: Doctor[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const doctorsApi = {
  list: (params: { page?: number; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search) query.set("search", params.search);
    return apiClient.get(`/doctors?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/doctors", data),
  remove: (id: string) => apiClient.delete(`/doctors/${id}`),
};
