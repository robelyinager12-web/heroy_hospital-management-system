import { Router } from "express";
import { auditLogsController } from "./audit-logs.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

router.use(authenticate, requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"));

router.get("/", auditLogsController.list);

export default router;
