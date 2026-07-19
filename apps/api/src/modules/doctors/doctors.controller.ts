import { Response, NextFunction } from "express";
import { doctorsService } from "./doctors.service";
import { createDoctorSchema, updateDoctorSchema, listDoctorsQuerySchema } from "./doctors.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const doctorsController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listDoctorsQuerySchema.parse(req.query);
      const result = await doctorsService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorsService.getById(req.params.id);
      res.json({ doctor });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createDoctorSchema.parse(req.body);
      const result = await doctorsService.create(input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateDoctorSchema.parse(req.body);
      const doctor = await doctorsService.update(req.params.id, input);
      res.json({ doctor });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await doctorsService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
