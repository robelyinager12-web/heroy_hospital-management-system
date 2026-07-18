import { Router } from "express";
import { patientsController } from "./patients.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), patientsController.list);
router.get("/:id", requireRole(...staffRoles), patientsController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"), patientsController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "RECEPTIONIST"), patientsController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), patientsController.remove);

export default router;