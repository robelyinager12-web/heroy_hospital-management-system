import { Router } from "express";
import { nursesController } from "./nurses.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER", "DOCTOR"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), nursesController.list);
router.get("/:id", requireRole(...staffRoles), nursesController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"), nursesController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "HR_MANAGER"), nursesController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), nursesController.remove);

export default router;
