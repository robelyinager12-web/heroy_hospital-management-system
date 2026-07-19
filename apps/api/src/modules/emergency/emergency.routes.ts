import { Router } from "express";
import { emergencyController } from "./emergency.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), emergencyController.list);
router.get("/:id", requireRole(...staffRoles), emergencyController.getById);
router.post("/", requireRole(...staffRoles), emergencyController.create);
router.put("/:id", requireRole(...staffRoles), emergencyController.update);
router.post("/:id/discharge", requireRole(...staffRoles), emergencyController.discharge);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), emergencyController.remove);

export default router;
