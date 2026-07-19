import { apiClient } from "@/lib/api-client";

export interface LabTest {
  id: string;
  testName: string;
  status: string;
  resultValue?: string;
  resultUnit?: string;
  referenceRange?: string;
  orderedAt: string;
  completedAt?: string;
  patient: { id: string; patientCode: string; user: { firstName: string; lastName: string } };
}

export interface LabTestListResponse {
  items: LabTest[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const laboratoryApi = {
  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/laboratory?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/laboratory", data),
  update: (id: string, data: Record<string, unknown>) => apiClient.put(`/laboratory/${id}`, data),
  remove: (id: string) => apiClient.delete(`/laboratory/${id}`),
};
