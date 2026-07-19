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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const aiApi = {
  listConversations: () => apiClient.get("/ai/conversations"),
  getConversation: (id: string) => apiClient.get(`/ai/conversations/${id}`),
  sendMessage: (message: string, conversationId?: string) =>
    apiClient.post("/ai/chat", { message, conversationId }),

  async transcribe(blob: Blob): Promise<{ data: { text: string } }> {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    const token = JSON.parse(localStorage.getItem("heroy-auth") ?? "{}")?.state?.accessToken;

    const res = await fetch(`${BASE_URL}/ai/transcribe`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message ?? "Transcription failed");
    return { data };
  },
};
