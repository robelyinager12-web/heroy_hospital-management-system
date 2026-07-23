import { z } from "zod";

export const startConversationSchema = z.object({
  userId: z.string().min(1), // the other participant
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
