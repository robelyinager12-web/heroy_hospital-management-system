import { Router } from "express";
import { backupController } from "./backup.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

router.use(authenticate, requireRole("SUPER_ADMIN"));

router.get("/", backupController.list);
router.post("/", backupController.create);
router.get("/:filename/download", backupController.download);
router.delete("/:filename", backupController.remove);

export default router;
