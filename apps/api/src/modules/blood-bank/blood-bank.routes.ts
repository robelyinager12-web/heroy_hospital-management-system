import { Router } from "express";
import { bloodBankController } from "./blood-bank.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"];

router.use(authenticate);

router.get("/stock", requireRole(...staffRoles), bloodBankController.listStock);
router.post("/stock/adjust", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"), bloodBankController.adjustStock);

router.get("/", requireRole(...staffRoles), bloodBankController.list);
router.post("/", requireRole(...staffRoles), bloodBankController.createRequest);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"), bloodBankController.updateRequest);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), bloodBankController.remove);

export default router;
