import { Response, NextFunction } from "express";
import { opdService } from "./opd.service";
import { createOpdVisitSchema, updateOpdVisitSchema, listQuerySchema } from "./opd.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const opdController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await opdService.list(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createOpdVisitSchema.parse(req.body);
      const visit = await opdService.create(input);
      res.status(201).json({ visit });
    } catch (err) {
      next(err);
    }
  },
  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateOpdVisitSchema.parse(req.body);
      const visit = await opdService.update(req.params.id, input);
      res.json({ visit });
    } catch (err) {
      next(err);
    }
  },
  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await opdService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
