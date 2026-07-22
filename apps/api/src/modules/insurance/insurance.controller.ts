import { Response, NextFunction } from "express";
import { insuranceService } from "./insurance.service";
import {
  createPolicySchema,
  updatePolicySchema,
  createClaimSchema,
  updateClaimSchema,
  listPoliciesQuerySchema,
  listClaimsQuerySchema,
} from "./insurance.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const insuranceController = {
  async listPolicies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listPoliciesQuerySchema.parse(req.query);
      res.json(await insuranceService.listPolicies(query));
    } catch (err) {
      next(err);
    }
  },

  async createPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createPolicySchema.parse(req.body);
      const policy = await insuranceService.createPolicy(input);
      res.status(201).json({ policy });
    } catch (err) {
      next(err);
    }
  },

  async updatePolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updatePolicySchema.parse(req.body);
      const policy = await insuranceService.updatePolicy(req.params.id, input);
      res.json({ policy });
    } catch (err) {
      next(err);
    }
  },

  async removePolicy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await insuranceService.removePolicy(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async listClaims(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = listClaimsQuerySchema.parse(req.query);
      res.json(await insuranceService.listClaims(query));
    } catch (err) {
      next(err);
    }
  },

  async createClaim(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createClaimSchema.parse(req.body);
      const claim = await insuranceService.createClaim(input);
      res.status(201).json({ claim });
    } catch (err) {
      next(err);
    }
  },

  async updateClaim(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateClaimSchema.parse(req.body);
      const claim = await insuranceService.updateClaim(req.params.id, input);
      res.json({ claim });
    } catch (err) {
      next(err);
    }
  },

  async removeClaim(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await insuranceService.removeClaim(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
