import { Response, NextFunction } from "express";
import { patientsService } from "./patients.service";
import { createPatientSchema, updatePatientSchema, listPatientsQuerySchema } from "./patients.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const patientsController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listPatientsQuerySchema.parse(req.query);
      const result = await patientsService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const patient = await patientsService.getById(req.params.id);
      res.json({ patient });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createPatientSchema.parse(req.body);
      const result = await patientsService.create(input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updatePatientSchema.parse(req.body);
      const patient = await patientsService.update(req.params.id, input);
      res.json({ patient });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await patientsService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};