import { auditLogsRepository } from "./audit-logs.repository";
import { ListQuery } from "./audit-logs.validation";

export const auditLogsService = {
  async list(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await auditLogsRepository.findMany({
      skip,
      take: query.pageSize,
      entity: query.entity,
      action: query.action,
    });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },
};

// Exported so any module can log an action without circular imports
export function recordAuditLog(data: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
}) {
  // Fire and forget — never let audit logging break the actual request
  auditLogsRepository.create(data).catch((err) => console.error("Audit log failed:", err));
}
