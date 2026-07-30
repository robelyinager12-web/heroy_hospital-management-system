import { Response, NextFunction } from "express";
import { payrollService } from "./payroll.service";
import { createPayslipSchema, updatePayslipSchema, listQuerySchema } from "./payroll.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const payrollController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json(await payrollService.list(listQuerySchema.parse(req.query)));
    } catch (err) {
      next(err);
    }
  },
  async listStaff(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json({ staff: await payrollService.listStaff() });
    } catch (err) {
      next(err);
    }
  },
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createPayslipSchema.parse(req.body);
      const payslip = await payrollService.create(input);
      res.status(201).json({ payslip });
    } catch (err) {
      next(err);
    }
  },
  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updatePayslipSchema.parse(req.body);
      const payslip = await payrollService.update(req.params.id, input);
      res.json({ payslip });
    } catch (err) {
      next(err);
    }
  },
  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await payrollService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
