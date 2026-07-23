import { Response, NextFunction } from "express";
import { reportsService } from "./reports.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const reportsController = {
  async overview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await reportsService.getOverview());
    } catch (err) {
      next(err);
    }
  },

  async revenueTrend(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json({ data: await reportsService.getRevenueTrend() });
    } catch (err) {
      next(err);
    }
  },

  async patientGrowth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json({ data: await reportsService.getPatientGrowth() });
    } catch (err) {
      next(err);
    }
  },

  async topDoctors(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json({ data: await reportsService.getTopDoctors() });
    } catch (err) {
      next(err);
    }
  },
};
