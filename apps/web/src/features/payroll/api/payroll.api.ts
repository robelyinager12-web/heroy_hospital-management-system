import { apiClient } from "@/lib/api-client";

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Payslip {
  id: string;
  baseSalary: string;
  bonus: string;
  deductions: string;
  netPay: string;
  periodMonth: number;
  periodYear: number;
  status: string;
  employee: { firstName: string; lastName: string; role: string };
}

export interface PayslipListResponse {
  items: Payslip[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const payrollApi = {
  listStaff: () => apiClient.get("/payroll/staff"),
  list: (page = 1) => apiClient.get(`/payroll?page=${page}`),
  create: (data: Record<string, unknown>) => apiClient.post("/payroll", data),
  updateStatus: (id: string, status: string) => apiClient.put(`/payroll/${id}`, { status }),
  remove: (id: string) => apiClient.delete(`/payroll/${id}`),
};
