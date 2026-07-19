import { Router } from "express";
import { pharmacyController } from "./pharmacy.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST", "DOCTOR"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), pharmacyController.list);
router.get("/:id", requireRole(...staffRoles), pharmacyController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"), pharmacyController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"), pharmacyController.update);
router.post("/:id/adjust-stock", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"), pharmacyController.adjustStock);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), pharmacyController.remove);

export default router;
