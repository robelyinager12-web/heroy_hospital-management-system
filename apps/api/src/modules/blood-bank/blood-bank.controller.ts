import { Response, NextFunction } from "express";
import { bloodBankService } from "./blood-bank.service";
import { adjustStockSchema, createRequestSchema, updateRequestSchema, listRequestsQuerySchema } from "./blood-bank.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const bloodBankController = {
  async listStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stock = await bloodBankService.listStock();
      res.json({ stock });
    } catch (err) {
      next(err);
    }
  },

  async adjustStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = adjustStockSchema.parse(req.body);
      const stock = await bloodBankService.adjustStock(input);
      res.json({ stock });
    } catch (err) {
      next(err);
    }
  },

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listRequestsQuerySchema.parse(req.query);
      const result = await bloodBankService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createRequestSchema.parse(req.body);
      const request = await bloodBankService.createRequest(input);
      res.status(201).json({ request });
    } catch (err) {
      next(err);
    }
  },

  async updateRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateRequestSchema.parse(req.body);
      const request = await bloodBankService.updateRequest(req.params.id, input);
      res.json({ request });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await bloodBankService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
