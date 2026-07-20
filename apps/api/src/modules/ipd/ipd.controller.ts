import { Response, NextFunction } from "express";
import { ipdService } from "./ipd.service";
import { createWardSchema, createBedSchema, admitPatientSchema, listAdmissionsQuerySchema } from "./ipd.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const ipdController = {
  async listWards(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const wards = await ipdService.listWards();
      res.json({ wards });
    } catch (err) {
      next(err);
    }
  },

  async createWard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createWardSchema.parse(req.body);
      const ward = await ipdService.createWard(input);
      res.status(201).json({ ward });
    } catch (err) {
      next(err);
    }
  },

  async listBeds(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const beds = await ipdService.listBeds(req.query.wardId as string | undefined);
      res.json({ beds });
    } catch (err) {
      next(err);
    }
  },

  async createBed(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createBedSchema.parse(req.body);
      const bed = await ipdService.createBed(input);
      res.status(201).json({ bed });
    } catch (err) {
      next(err);
    }
  },

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listAdmissionsQuerySchema.parse(req.query);
      const result = await ipdService.list(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async admit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = admitPatientSchema.parse(req.body);
      const admission = await ipdService.admit(input);
      res.status(201).json({ admission });
    } catch (err) {
      next(err);
    }
  },

  async discharge(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const admission = await ipdService.discharge(req.params.id);
      res.json({ admission });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await ipdService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
