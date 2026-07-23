import { Response, NextFunction } from "express";
import { chatService } from "./chat.service";
import { startConversationSchema, sendMessageSchema } from "./chat.validation";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export const chatController = {
  async listConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const conversations = await chatService.listConversations(req.user!.id);
      res.json({ conversations });
    } catch (err) {
      next(err);
    }
  },

  async listStaff(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const staff = await chatService.listStaff(req.user!.id);
      res.json({ staff });
    } catch (err) {
      next(err);
    }
  },

  async startConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = startConversationSchema.parse(req.body);
      const conversation = await chatService.startConversation(req.user!.id, input);
      res.status(201).json({ conversation });
    } catch (err) {
      next(err);
    }
  },

  async getMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await chatService.getMessages(req.params.id, req.user!.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = sendMessageSchema.parse(req.body);
      const message = await chatService.sendMessage(req.params.id, req.user!.id, input);
      res.status(201).json({ message });
    } catch (err) {
      next(err);
    }
  },
};
