import { apiClient } from "@/lib/api-client";

export interface Medicine {
  id: string;
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  unitCost?: string;
  expiryDate?: string;
}

export interface MedicineListResponse {
  items: Medicine[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const pharmacyApi = {
  list: (params: { page?: number; search?: string; lowStockOnly?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search) query.set("search", params.search);
    if (params.lowStockOnly) query.set("lowStockOnly", "true");
    return apiClient.get(`/pharmacy?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/pharmacy", data),
  adjustStock: (id: string, delta: number, reason?: string) =>
    apiClient.post(`/pharmacy/${id}/adjust-stock`, { delta, reason }),
  remove: (id: string) => apiClient.delete(`/pharmacy/${id}`),
};
