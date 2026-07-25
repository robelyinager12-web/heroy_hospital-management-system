import { apiClient } from "@/lib/api-client";

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; role: string } | null;
}

export interface AuditLogListResponse {
  items: AuditLogEntry[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const auditLogsApi = {
  list: (params: { page?: number; entity?: string; action?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.entity) query.set("entity", params.entity);
    if (params.action) query.set("action", params.action);
    return apiClient.get(`/audit-logs?${query.toString()}`);
  },
};
