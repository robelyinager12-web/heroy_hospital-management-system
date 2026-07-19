import { apiClient } from "@/lib/api-client";

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title?: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export const aiApi = {
  listConversations: () => apiClient.get("/ai/conversations"),
  getConversation: (id: string) => apiClient.get(`/ai/conversations/${id}`),
  sendMessage: (message: string, conversationId?: string) =>
    apiClient.post("/ai/chat", { message, conversationId }),
};
