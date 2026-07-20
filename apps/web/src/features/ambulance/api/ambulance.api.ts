import { apiClient } from "@/lib/api-client";

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone?: string;
  status: string;
}

export interface AmbulanceRequestItem {
  id: string;
  pickupLocation: string;
  destination: string;
  status: string;
  notes?: string;
  requestedAt: string;
  patient?: { user: { firstName: string; lastName: string } } | null;
  ambulance?: { vehicleNumber: string; driverName: string } | null;
}

export interface RequestListResponse {
  items: AmbulanceRequestItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const ambulanceApi = {
  listVehicles: () => apiClient.get("/ambulance/vehicles"),
  createVehicle: (data: Record<string, unknown>) => apiClient.post("/ambulance/vehicles", data),

  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/ambulance?${query.toString()}`);
  },
  createRequest: (data: Record<string, unknown>) => apiClient.post("/ambulance", data),
  updateRequest: (id: string, data: Record<string, unknown>) => apiClient.put(`/ambulance/${id}`, data),
  remove: (id: string) => apiClient.delete(`/ambulance/${id}`),
};
