import { Response, NextFunction } from "express";
import { emergencyService } from "./emergency.service";
import { createEmergencyCaseSchema, updateEmergencyCaseSchema, listEmergencyQuerySchema } from "./emergency.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const emergencyController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listEmergencyQuerySchema.parse(req.query);
      const result = await emergencyService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const emergencyCase = await emergencyService.getById(req.params.id);
      res.json({ emergencyCase });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createEmergencyCaseSchema.parse(req.body);
      const emergencyCase = await emergencyService.create(input);
      res.status(201).json({ emergencyCase });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateEmergencyCaseSchema.parse(req.body);
      const emergencyCase = await emergencyService.update(req.params.id, input);
      res.json({ emergencyCase });
    } catch (err) {
      next(err);
    }
  },

  async discharge(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const emergencyCase = await emergencyService.discharge(req.params.id);
      res.json({ emergencyCase });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await emergencyService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
