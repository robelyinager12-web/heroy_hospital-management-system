import { Router } from "express";
import { appointmentsController } from "./appointments.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PATIENT"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), appointmentsController.list);
router.get("/:id", requireRole(...staffRoles), appointmentsController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"), appointmentsController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST", "DOCTOR"), appointmentsController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), appointmentsController.remove);

export default router;
