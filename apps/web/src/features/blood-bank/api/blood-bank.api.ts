import { apiClient } from "@/lib/api-client";

export interface BloodStock {
  id: string;
  bloodGroup: string;
  units: number;
}

export interface BloodRequestItem {
  id: string;
  bloodGroup: string;
  unitsRequested: number;
  status: string;
  notes?: string;
  requestedAt: string;
  patient?: { user: { firstName: string; lastName: string } } | null;
}

export interface RequestListResponse {
  items: BloodRequestItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const bloodBankApi = {
  listStock: () => apiClient.get("/blood-bank/stock"),
  adjustStock: (bloodGroup: string, delta: number) =>
    apiClient.post("/blood-bank/stock/adjust", { bloodGroup, delta }),

  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/blood-bank?${query.toString()}`);
  },
  createRequest: (data: Record<string, unknown>) => apiClient.post("/blood-bank", data),
  updateRequest: (id: string, status: string) => apiClient.put(`/blood-bank/${id}`, { status }),
  remove: (id: string) => apiClient.delete(`/blood-bank/${id}`),
};
