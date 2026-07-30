import { Router } from "express";
import { payrollController } from "./payroll.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();
const hrRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER", "ACCOUNTANT"];

router.use(authenticate, requireRole(...hrRoles));
router.get("/staff", payrollController.listStaff);
router.get("/", payrollController.list);
router.post("/", payrollController.create);
router.put("/:id", payrollController.update);
router.delete("/:id", payrollController.remove);

export default router;
