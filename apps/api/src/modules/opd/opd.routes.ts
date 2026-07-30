import { Router } from "express";
import { opdController } from "./opd.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();
const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"];

router.use(authenticate);
router.get("/", requireRole(...staffRoles), opdController.list);
router.post("/", requireRole(...staffRoles), opdController.create);
router.put("/:id", requireRole(...staffRoles), opdController.update);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), opdController.remove);

export default router;
