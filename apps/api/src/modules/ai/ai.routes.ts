import { Router } from "express";
import multer from "multer";
import { aiController } from "./ai.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.use(authenticate);

router.get("/conversations", aiController.listConversations);
router.get("/conversations/:id", aiController.getConversation);
router.post("/chat", aiController.sendMessage);
router.post("/transcribe", upload.single("audio"), aiController.transcribe);

export default router;
