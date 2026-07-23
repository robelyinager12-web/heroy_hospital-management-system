import { Router } from "express";
import { reportsController } from "./reports.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"];

router.use(authenticate, requireRole(...staffRoles));

router.get("/overview", reportsController.overview);
router.get("/revenue-trend", reportsController.revenueTrend);
router.get("/patient-growth", reportsController.patientGrowth);
router.get("/top-doctors", reportsController.topDoctors);

export default router;
