import { Response, NextFunction } from "express";
import { hospitalsService } from "./hospitals.service";
import { createHospitalSchema, updateHospitalSchema, listQuerySchema } from "./hospitals.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const hospitalsController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await hospitalsService.list(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createHospitalSchema.parse(req.body);
      const hospital = await hospitalsService.create(input);
      res.status(201).json({ hospital });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateHospitalSchema.parse(req.body);
      const hospital = await hospitalsService.update(req.params.id, input);
      res.json({ hospital });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await hospitalsService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
