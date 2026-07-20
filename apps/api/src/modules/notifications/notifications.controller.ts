import { Response, NextFunction } from "express";
import { notificationsService } from "./notifications.service";
import { listNotificationsQuerySchema } from "./notifications.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const notificationsController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listNotificationsQuerySchema.parse(req.query);
      const result = await notificationsService.list(req.user!.id, query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await notificationsService.markRead(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await notificationsService.markAllRead(req.user!.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
