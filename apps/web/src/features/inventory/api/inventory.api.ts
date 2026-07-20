import { apiClient } from "@/lib/api-client";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  unit: string;
  quantity: number;
  reorderLevel: number;
  unitCost?: string;
}

export interface InventoryListResponse {
  items: InventoryItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const inventoryApi = {
  list: (params: { page?: number; search?: string; category?: string; lowStockOnly?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.lowStockOnly) query.set("lowStockOnly", "true");
    return apiClient.get(`/inventory?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/inventory", data),
  adjustStock: (id: string, delta: number) => apiClient.post(`/inventory/${id}/adjust-stock`, { delta }),
  remove: (id: string) => apiClient.delete(`/inventory/${id}`),
};
