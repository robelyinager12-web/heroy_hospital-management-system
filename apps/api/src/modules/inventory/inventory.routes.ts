import { Router } from "express";
import { inventoryController } from "./inventory.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

const staffRoles = ["SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE", "DOCTOR"];

router.use(authenticate);

router.get("/", requireRole(...staffRoles), inventoryController.list);
router.get("/:id", requireRole(...staffRoles), inventoryController.getById);
router.post("/", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), inventoryController.create);
router.put("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), inventoryController.update);
router.post("/:id/adjust-stock", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN", "NURSE"), inventoryController.adjustStock);
router.delete("/:id", requireRole("SUPER_ADMIN", "HOSPITAL_ADMIN"), inventoryController.remove);

export default router;
