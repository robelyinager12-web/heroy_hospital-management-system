import { Router } from "express";
import { radiologyController } from "./radiology.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), radiologyController.list);
router.get("/:id", requireRole(...staffRoles), radiologyController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR"), radiologyController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"), radiologyController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), radiologyController.remove);

export default router;
