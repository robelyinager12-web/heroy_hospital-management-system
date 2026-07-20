import { Response, NextFunction } from "express";
import { surgeryService } from "./surgery.service";
import { createSurgerySchema, updateSurgerySchema, listSurgeriesQuerySchema } from "./surgery.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const surgeryController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listSurgeriesQuerySchema.parse(req.query);
      const result = await surgeryService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const surgery = await surgeryService.getById(req.params.id);
      res.json({ surgery });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createSurgerySchema.parse(req.body);
      const surgery = await surgeryService.create(input);
      res.status(201).json({ surgery });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateSurgerySchema.parse(req.body);
      const surgery = await surgeryService.update(req.params.id, input);
      res.json({ surgery });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await surgeryService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
