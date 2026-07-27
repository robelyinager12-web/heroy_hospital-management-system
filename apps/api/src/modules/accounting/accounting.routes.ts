import { Router } from "express";
import { accountingController } from "./accounting.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const financeRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "ACCOUNTANT"];

router.use(authenticate, requireRole(...financeRoles));

router.get("/summary", accountingController.summary);
router.get("/expenses", accountingController.list);
router.post("/expenses", accountingController.create);
router.delete("/expenses/:id", accountingController.remove);

export default router;
