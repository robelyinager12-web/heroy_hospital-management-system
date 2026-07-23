import { apiClient } from "@/lib/api-client";

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: ChatUser;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  updatedAt: string;
  participants: { user: ChatUser }[];
  messages: ChatMessage[]; // last message only, from list endpoint
}

export const chatApi = {
  listStaff: () => apiClient.get("/chat/staff"),
  listConversations: () => apiClient.get("/chat/conversations"),
  startConversation: (userId: string) => apiClient.post("/chat/conversations", { userId }),
  getMessages: (conversationId: string) => apiClient.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string) =>
    apiClient.post(`/chat/conversations/${conversationId}/messages`, { content }),
};
