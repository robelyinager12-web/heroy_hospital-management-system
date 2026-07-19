import { Response, NextFunction } from "express";
import { laboratoryService } from "./laboratory.service";
import { createLabTestSchema, updateLabResultSchema, listLabTestsQuerySchema } from "./laboratory.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const laboratoryController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listLabTestsQuerySchema.parse(req.query);
      const result = await laboratoryService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const labTest = await laboratoryService.getById(req.params.id);
      res.json({ labTest });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createLabTestSchema.parse(req.body);
      const labTest = await laboratoryService.create(input);
      res.status(201).json({ labTest });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateLabResultSchema.parse(req.body);
      const labTest = await laboratoryService.update(req.params.id, input);
      res.json({ labTest });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await laboratoryService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
