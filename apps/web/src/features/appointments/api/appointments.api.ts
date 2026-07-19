import { apiClient } from "@/lib/api-client";

export interface Appointment {
  id: string;
  type: string;
  status: string;
  scheduledAt: string;
  durationMins: number;
  reason?: string;
  patient: { id: string; firstName: string; lastName: string; email: string };
  doctor: { id: string; firstName: string; lastName: string; email: string };
}

export interface AppointmentListResponse {
  items: Appointment[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const appointmentsApi = {
  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/appointments?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/appointments", data),
  updateStatus: (id: string, status: string) => apiClient.put(`/appointments/${id}`, { status }),
  remove: (id: string) => apiClient.delete(`/appointments/${id}`),
};
