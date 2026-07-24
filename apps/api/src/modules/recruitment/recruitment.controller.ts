import { Response, NextFunction } from "express";
import { recruitmentService } from "./recruitment.service";
import {
  createJobSchema,
  updateJobSchema,
  createApplicationSchema,
  updateApplicationSchema,
  listQuerySchema,
} from "./recruitment.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const recruitmentController = {
  async listJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await recruitmentService.listJobs(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },

  async createJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createJobSchema.parse(req.body);
      const job = await recruitmentService.createJob(req.user!.id, input);
      res.status(201).json({ job });
    } catch (err) {
      next(err);
    }
  },

  async updateJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateJobSchema.parse(req.body);
      const job = await recruitmentService.updateJob(req.params.id, input);
      res.json({ job });
    } catch (err) {
      next(err);
    }
  },

  async removeJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await recruitmentService.removeJob(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async listApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listQuerySchema.parse(req.query);
      const jobPostingId = req.query.jobPostingId as string | undefined;
      res.json(await recruitmentService.listApplications({ ...query, jobPostingId }));
    } catch (err) {
      next(err);
    }
  },

  async createApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createApplicationSchema.parse(req.body);
      const application = await recruitmentService.createApplication(input);
      res.status(201).json({ application });
    } catch (err) {
      next(err);
    }
  },

  async updateApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateApplicationSchema.parse(req.body);
      const application = await recruitmentService.updateApplication(req.params.id, input);
      res.json({ application });
    } catch (err) {
      next(err);
    }
  },

  async removeApplication(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await recruitmentService.removeApplication(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
