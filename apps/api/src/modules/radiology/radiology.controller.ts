import { Response, NextFunction } from "express";
import { radiologyService } from "./radiology.service";
import {
  createRadiologyOrderSchema,
  updateRadiologyResultSchema,
  listRadiologyQuerySchema,
} from "./radiology.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const radiologyController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listRadiologyQuerySchema.parse(req.query);
      const result = await radiologyService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await radiologyService.getById(req.params.id);
      res.json({ order });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createRadiologyOrderSchema.parse(req.body);
      const order = await radiologyService.create(input);
      res.status(201).json({ order });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateRadiologyResultSchema.parse(req.body);
      const order = await radiologyService.update(req.params.id, input);
      res.json({ order });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await radiologyService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
