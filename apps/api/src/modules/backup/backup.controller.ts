import { Response, NextFunction } from "express";
import { backupService } from "./backup.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const backupController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json({ backups: await backupService.list() });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const backup = await backupService.create();
      res.status(201).json({ backup });
    } catch (err) {
      next(err);
    }
  },

  async download(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const filepath = await backupService.getFilePath(req.params.filename);
      res.download(filepath);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await backupService.remove(req.params.filename);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
