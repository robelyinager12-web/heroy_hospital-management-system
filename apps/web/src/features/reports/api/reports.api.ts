import { apiClient } from "@/lib/api-client";

export interface OverviewData {
  totalPatients: number;
  totalDoctors: number;
  totalNurses: number;
  totalAppointments: number;
  appointmentsByStatus: { status: string; count: number }[];
  bedOccupancy: { total: number; occupied: number };
  totalRevenue: string | number;
  pendingInvoicesTotal: string | number;
  activeEmergencies: number;
  lowStockCount: number;
}

export const reportsApi = {
  getOverview: () => apiClient.get("/reports/overview"),
  getRevenueTrend: () => apiClient.get("/reports/revenue-trend"),
  getPatientGrowth: () => apiClient.get("/reports/patient-growth"),
  getTopDoctors: () => apiClient.get("/reports/top-doctors"),
};
