import { Response, NextFunction } from "express";
import { accountingService } from "./accounting.service";
import { createExpenseSchema, listQuerySchema } from "./accounting.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const accountingController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await accountingService.list(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createExpenseSchema.parse(req.body);
      const expense = await accountingService.create(req.user!.id, input);
      res.status(201).json({ expense });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await accountingService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async summary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await accountingService.getSummary());
    } catch (err) {
      next(err);
    }
  },
};
