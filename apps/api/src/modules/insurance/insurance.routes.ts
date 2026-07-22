import { Router } from "express";
import { insuranceController } from "./insurance.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER", "ACCOUNTANT", "RECEPTIONIST"];

router.use(authenticate);

router.get("/policies", requireRole(...staffRoles), insuranceController.listPolicies);
router.post("/policies", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER"), insuranceController.createPolicy);
router.put("/policies/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER"), insuranceController.updatePolicy);
router.delete("/policies/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), insuranceController.removePolicy);

router.get("/claims", requireRole(...staffRoles), insuranceController.listClaims);
router.post("/claims", requireRole(...staffRoles), insuranceController.createClaim);
router.put("/claims/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER"), insuranceController.updateClaim);
router.delete("/claims/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), insuranceController.removeClaim);

export default router;
