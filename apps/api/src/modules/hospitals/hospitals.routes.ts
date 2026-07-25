import { Router } from "express";
import { hospitalsController } from "./hospitals.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";

const router = Router();

router.use(authenticate, requireRole("SUPER_ADMIN"));

router.get("/", hospitalsController.list);
router.post("/", hospitalsController.create);
router.put("/:id", hospitalsController.update);
router.delete("/:id", hospitalsController.remove);

export default router;
