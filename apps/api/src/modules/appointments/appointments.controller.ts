import { Response, NextFunction } from "express";
import { appointmentsService } from "./appointments.service";
import { createAppointmentSchema, updateAppointmentSchema, listAppointmentsQuerySchema } from "./appointments.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const appointmentsController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listAppointmentsQuerySchema.parse(req.query);
      const result = await appointmentsService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentsService.getById(req.params.id);
      res.json({ appointment });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createAppointmentSchema.parse(req.body);
      const appointment = await appointmentsService.create(input);
      res.status(201).json({ appointment });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateAppointmentSchema.parse(req.body);
      const appointment = await appointmentsService.update(req.params.id, input);
      res.json({ appointment });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await appointmentsService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
