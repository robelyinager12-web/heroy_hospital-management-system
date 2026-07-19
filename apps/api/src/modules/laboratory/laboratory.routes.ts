import { Router } from "express";
import { laboratoryController } from "./laboratory.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN", "DOCTOR"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), laboratoryController.list);
router.get("/:id", requireRole(...staffRoles), laboratoryController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR"), laboratoryController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"), laboratoryController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), laboratoryController.remove);

export default router;
