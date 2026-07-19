import { Response, NextFunction } from "express";
import { pharmacyService } from "./pharmacy.service";
import {
  createMedicineSchema,
  updateMedicineSchema,
  adjustStockSchema,
  listMedicinesQuerySchema,
} from "./pharmacy.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const pharmacyController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listMedicinesQuerySchema.parse(req.query);
      const result = await pharmacyService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const medicine = await pharmacyService.getById(req.params.id);
      res.json({ medicine });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createMedicineSchema.parse(req.body);
      const medicine = await pharmacyService.create(input);
      res.status(201).json({ medicine });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateMedicineSchema.parse(req.body);
      const medicine = await pharmacyService.update(req.params.id, input);
      res.json({ medicine });
    } catch (err) {
      next(err);
    }
  },

  async adjustStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = adjustStockSchema.parse(req.body);
      const medicine = await pharmacyService.adjustStock(req.params.id, input);
      res.json({ medicine });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await pharmacyService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
