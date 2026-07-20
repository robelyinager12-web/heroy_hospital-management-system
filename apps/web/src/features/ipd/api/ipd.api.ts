import { apiClient } from "@/lib/api-client";

export interface Ward {
  id: string;
  name: string;
  floor?: string;
  beds: Bed[];
}

export interface Bed {
  id: string;
  wardId: string;
  bedNumber: string;
  isOccupied: boolean;
  ward?: { name: string };
}

export interface Admission {
  id: string;
  reason: string;
  notes?: string;
  admittedAt: string;
  dischargedAt?: string;
  patient: { id: string; patientCode: string; user: { firstName: string; lastName: string } };
  bed: { bedNumber: string; ward: { name: string } };
}

export interface AdmissionListResponse {
  items: Admission[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const ipdApi = {
  listWards: () => apiClient.get("/ipd/wards"),
  createWard: (data: Record<string, unknown>) => apiClient.post("/ipd/wards", data),

  listBeds: (wardId?: string) => apiClient.get(`/ipd/beds${wardId ? `?wardId=${wardId}` : ""}`),
  createBed: (data: Record<string, unknown>) => apiClient.post("/ipd/beds", data),

  list: (params: { page?: number; activeOnly?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.activeOnly) query.set("activeOnly", "true");
    return apiClient.get(`/ipd?${query.toString()}`);
  },
  admit: (data: Record<string, unknown>) => apiClient.post("/ipd", data),
  discharge: (id: string) => apiClient.post(`/ipd/${id}/discharge`),
  remove: (id: string) => apiClient.delete(`/ipd/${id}`),
};
