import { Router } from "express";
import { notificationsController } from "./notifications.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", notificationsController.list);
router.post("/:id/read", notificationsController.markRead);
router.post("/read-all", notificationsController.markAllRead);

export default router;
