import { Response, NextFunction } from "express";
import { auditLogsService } from "./audit-logs.service";
import { listQuerySchema } from "./audit-logs.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const auditLogsController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await auditLogsService.list(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },
};
