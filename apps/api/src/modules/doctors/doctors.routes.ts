import { Router } from "express";
import { doctorsController } from "./doctors.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER", "RECEPTIONIST", "PATIENT"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), doctorsController.list);
router.get("/:id", requireRole(...staffRoles), doctorsController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"), doctorsController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"), doctorsController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), doctorsController.remove);

export default router;
