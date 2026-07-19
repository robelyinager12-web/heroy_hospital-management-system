import { aiRepository } from "./ai.repository";
import { groqClient, GROQ_MODEL } from "../../config/groq.config";
import { AppError } from "../../middlewares/error-handler.middleware";
import { SendMessageInput } from "./ai.validation";

const SYSTEM_PROMPT = `You are the HEROY Hospital Management System AI assistant. You help hospital staff and patients with:
- General medical information and explanations (never a diagnosis)
- Navigating the hospital system's features
- Answering questions about symptoms, medications, and general health topics
- Summarizing information clearly and concisely

Always remind users that you are not a substitute for professional medical advice when discussing symptoms or treatment. Be warm, clear, and concise.`;

export const aiService = {
  async listConversations(userId: string) {
    return aiRepository.listConversations(userId);
  },

  async getConversation(id: string, userId: string) {
    const conversation = await aiRepository.findConversation(id, userId);
    if (!conversation) throw new AppError(404, "Conversation not found");
    return conversation;
  },

  async sendMessage(userId: string, input: SendMessageInput) {
    let conversation;

    if (input.conversationId) {
      conversation = await aiRepository.findConversation(input.conversationId, userId);
      if (!conversation) throw new AppError(404, "Conversation not found");
    } else {
      const title = input.message.slice(0, 60);
      conversation = await aiRepository.createConversation(userId, title);
      conversation = { ...conversation, messages: [] };
    }

    await aiRepository.addMessage(conversation.id, "USER", input.message);

    const history = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...conversation.messages.map((m) => ({
        role: m.role.toLowerCase() as "user" | "assistant" | "system",
        content: m.content,
      })),
      { role: "user" as const, content: input.message },
    ];

    let assistantReply: string;
    try {
      const completion = await groqClient.chat.completions.create({
        model: GROQ_MODEL,
        messages: history,
        temperature: 0.7,
        max_tokens: 1024,
      });
      assistantReply = completion.choices[0]?.message?.content ?? "I couldn't generate a response. Please try again.";
    } catch (err) {
      console.error("Groq API error:", err);
      throw new AppError(502, "The AI assistant is temporarily unavailable. Please try again shortly.");
    }

    await aiRepository.addMessage(conversation.id, "ASSISTANT", assistantReply);
    await aiRepository.touchConversation(conversation.id);

    return { conversationId: conversation.id, reply: assistantReply };
  },
};
