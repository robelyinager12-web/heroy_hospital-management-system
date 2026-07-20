import { Router } from "express";
import { surgeryController } from "./surgery.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), surgeryController.list);
router.get("/:id", requireRole(...staffRoles), surgeryController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR"), surgeryController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR"), surgeryController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), surgeryController.remove);

export default router;
