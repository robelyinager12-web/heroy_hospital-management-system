import { apiClient } from "@/lib/api-client";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export interface Payment {
  id: string;
  amount: string;
  method: string;
  status: string;
  paidAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  status: string;
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  createdAt: string;
  patient: { id: string; patientCode: string; user: { firstName: string; lastName: string } };
  items: InvoiceItem[];
  payments: Payment[];
}

export interface InvoiceListResponse {
  items: Invoice[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const billingApi = {
  list: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/billing?${query.toString()}`);
  },
  create: (data: Record<string, unknown>) => apiClient.post("/billing", data),
  recordPayment: (id: string, data: Record<string, unknown>) => apiClient.post(`/billing/${id}/payments`, data),
  remove: (id: string) => apiClient.delete(`/billing/${id}`),
};
