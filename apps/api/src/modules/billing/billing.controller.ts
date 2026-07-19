import { Response, NextFunction } from "express";
import { billingService } from "./billing.service";
import { createInvoiceSchema, recordPaymentSchema, listInvoicesQuerySchema } from "./billing.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const billingController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listInvoicesQuerySchema.parse(req.query);
      const result = await billingService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const invoice = await billingService.getById(req.params.id);
      res.json({ invoice });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createInvoiceSchema.parse(req.body);
      const invoice = await billingService.create(input);
      res.status(201).json({ invoice });
    } catch (err) {
      next(err);
    }
  },

  async recordPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = recordPaymentSchema.parse(req.body);
      const invoice = await billingService.recordPayment(req.params.id, input);
      res.json({ invoice });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await billingService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
