import { Router } from "express";
import { billingController } from "./billing.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT", "RECEPTIONIST"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), billingController.list);
router.get("/:id", requireRole(...staffRoles), billingController.getById);
router.post("/", requireRole(...staffRoles), billingController.create);
router.post("/:id/payments", requireRole(...staffRoles), billingController.recordPayment);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), billingController.remove);

export default router;
