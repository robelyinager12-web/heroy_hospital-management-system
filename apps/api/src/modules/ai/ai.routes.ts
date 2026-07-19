import { Router } from "express";
import { aiController } from "./ai.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/conversations", aiController.listConversations);
router.get("/conversations/:id", aiController.getConversation);
router.post("/chat", aiController.sendMessage);

export default router;
