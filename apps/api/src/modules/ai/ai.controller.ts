import { Response, NextFunction } from "express";
import { aiService } from "./ai.service";
import { sendMessageSchema } from "./ai.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const aiController = {
  async listConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const conversations = await aiService.listConversations(req.user!.id);
      res.json({ conversations });
    } catch (err) {
      next(err);
    }
  },

  async getConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const conversation = await aiService.getConversation(req.params.id, req.user!.id);
      res.json({ conversation });
    } catch (err) {
      next(err);
    }
  },

  async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = sendMessageSchema.parse(req.body);
      const result = await aiService.sendMessage(req.user!.id, input);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async transcribe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }
      const text = await aiService.transcribeAudio(req.file.buffer, req.file.originalname);
      res.json({ text });
    } catch (err) {
      next(err);
    }
  },
};
