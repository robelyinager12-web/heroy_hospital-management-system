import { Response, NextFunction } from "express";
import { ambulanceService } from "./ambulance.service";
import {
  createAmbulanceSchema,
  createRequestSchema,
  updateRequestSchema,
  listRequestsQuerySchema,
} from "./ambulance.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const ambulanceController = {
  async listAmbulances(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const ambulances = await ambulanceService.listAmbulances();
      res.json({ ambulances });
    } catch (err) {
      next(err);
    }
  },

  async createAmbulance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createAmbulanceSchema.parse(req.body);
      const ambulance = await ambulanceService.createAmbulance(input);
      res.status(201).json({ ambulance });
    } catch (err) {
      next(err);
    }
  },

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listRequestsQuerySchema.parse(req.query);
      const result = await ambulanceService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createRequestSchema.parse(req.body);
      const request = await ambulanceService.createRequest(input);
      res.status(201).json({ request });
    } catch (err) {
      next(err);
    }
  },

  async updateRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateRequestSchema.parse(req.body);
      const request = await ambulanceService.updateRequest(req.params.id, input);
      res.json({ request });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await ambulanceService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
