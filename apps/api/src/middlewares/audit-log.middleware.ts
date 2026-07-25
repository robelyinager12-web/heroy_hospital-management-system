import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { recordAuditLog } from "../modules/audit-logs/audit-logs.service";

export function autoAuditLog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!["POST", "PUT", "DELETE"].includes(req.method)) return next();

  res.on("finish", () => {
    if (res.statusCode >= 400) return; // don't log failed requests

    // Use originalUrl (always the full path) rather than req.path (can be router-relative)
    const pathOnly = req.originalUrl.split("?")[0];
    const segments = pathOnly.split("/").filter(Boolean); // e.g. ["api", "patients", "abc123"]
    const entity = segments[1] ?? "unknown";
    const entityId = segments[2];

    const actionMap: Record<string, string> = { POST: "CREATE", PUT: "UPDATE", DELETE: "DELETE" };

    recordAuditLog({
      userId: req.user?.id,
      action: actionMap[req.method] ?? req.method,
      entity,
      entityId,
      ipAddress: req.ip,
    });
  });

  next();
}
