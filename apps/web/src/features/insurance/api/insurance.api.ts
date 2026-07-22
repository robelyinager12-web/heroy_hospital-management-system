import { apiClient } from "@/lib/api-client";

export interface InsurancePolicy {
  id: string;
  provider: string;
  policyNumber: string;
  status: string;
  startDate: string;
  endDate?: string;
  patient: { user: { firstName: string; lastName: string } };
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  amountClaimed: string;
  status: string;
  submittedAt: string;
  policy: InsurancePolicy;
}

export interface PolicyListResponse {
  items: InsurancePolicy[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface ClaimListResponse {
  items: InsuranceClaim[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const insuranceApi = {
  listPolicies: (page = 1) => apiClient.get(`/insurance/policies?page=${page}`),
  createPolicy: (data: Record<string, unknown>) => apiClient.post("/insurance/policies", data),
  updatePolicy: (id: string, data: Record<string, unknown>) => apiClient.put(`/insurance/policies/${id}`, data),
  removePolicy: (id: string) => apiClient.delete(`/insurance/policies/${id}`),

  listClaims: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/insurance/claims?${query.toString()}`);
  },
  createClaim: (data: Record<string, unknown>) => apiClient.post("/insurance/claims", data),
  updateClaim: (id: string, status: string) => apiClient.put(`/insurance/claims/${id}`, { status }),
  removeClaim: (id: string) => apiClient.delete(`/insurance/claims/${id}`),
};
