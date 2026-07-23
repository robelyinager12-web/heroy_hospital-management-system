import { chatRepository } from "./chat.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { StartConversationInput, SendMessageInput } from "./chat.validation";

export const chatService = {
  listConversations: (userId: string) => chatRepository.listConversationsForUser(userId),

  listStaff: (userId: string) => chatRepository.listStaffUsers(userId),

  async startConversation(currentUserId: string, input: StartConversationInput) {
    if (currentUserId === input.userId) {
      throw new AppError(400, "You can't start a conversation with yourself");
    }

    const existing = await chatRepository.findExistingDirectConversation(currentUserId, input.userId);
    if (existing) return existing;

    return chatRepository.createDirectConversation(currentUserId, input.userId);
  },

  async getMessages(conversationId: string, userId: string) {
    const conversation = await chatRepository.findConversationForUser(conversationId, userId);
    if (!conversation) throw new AppError(404, "Conversation not found");

    await chatRepository.markRead(conversationId, userId);

    const messages = await chatRepository.listMessages(conversationId);
    return { conversation, messages };
  },

  async sendMessage(conversationId: string, senderId: string, input: SendMessageInput) {
    const conversation = await chatRepository.findConversationForUser(conversationId, senderId);
    if (!conversation) throw new AppError(404, "Conversation not found");

    const message = await chatRepository.createMessage(conversationId, senderId, input.content);
    await chatRepository.touchConversation(conversationId);

    return message;
  },
};
