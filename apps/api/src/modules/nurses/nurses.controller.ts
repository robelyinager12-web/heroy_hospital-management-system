import { Response, NextFunction } from "express";
import { nursesService } from "./nurses.service";
import { createNurseSchema, updateNurseSchema, listNursesQuerySchema } from "./nurses.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const nursesController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listNursesQuerySchema.parse(req.query);
      const result = await nursesService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const nurse = await nursesService.getById(req.params.id);
      res.json({ nurse });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createNurseSchema.parse(req.body);
      const result = await nursesService.create(input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateNurseSchema.parse(req.body);
      const nurse = await nursesService.update(req.params.id, input);
      res.json({ nurse });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await nursesService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
