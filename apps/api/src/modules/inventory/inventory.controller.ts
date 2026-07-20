import { Response, NextFunction } from "express";
import { inventoryService } from "./inventory.service";
import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
  adjustStockSchema,
  listInventoryQuerySchema,
} from "./inventory.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const inventoryController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listInventoryQuerySchema.parse(req.query);
      const result = await inventoryService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await inventoryService.getById(req.params.id);
      res.json({ item });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createInventoryItemSchema.parse(req.body);
      const item = await inventoryService.create(input);
      res.status(201).json({ item });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateInventoryItemSchema.parse(req.body);
      const item = await inventoryService.update(req.params.id, input);
      res.json({ item });
    } catch (err) {
      next(err);
    }
  },

  async adjustStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = adjustStockSchema.parse(req.body);
      const item = await inventoryService.adjustStock(req.params.id, input);
      res.json({ item });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await inventoryService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
