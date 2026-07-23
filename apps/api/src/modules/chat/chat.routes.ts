import { Router } from "express";
import { chatController } from "./chat.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/staff", chatController.listStaff);
router.get("/conversations", chatController.listConversations);
router.post("/conversations", chatController.startConversation);
router.get("/conversations/:id/messages", chatController.getMessages);
router.post("/conversations/:id/messages", chatController.sendMessage);

export default router;
