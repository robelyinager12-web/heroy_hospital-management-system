import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const aiRepository = {
  createConversation: (userId: string, title: string) =>
    prisma.aiConversation.create({ data: { userId, title, channel: "TEXT" } }),

  findConversation: (id: string, userId: string) =>
    prisma.aiConversation.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    }),

  listConversations: (userId: string) =>
    prisma.aiConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),

  addMessage: (conversationId: string, role: "USER" | "ASSISTANT" | "SYSTEM", content: string) =>
    prisma.aiConversationMessage.create({
      data: { conversationId, role, content },
    }),

  touchConversation: (id: string) =>
    prisma.aiConversation.update({ where: { id }, data: { updatedAt: new Date() } }),
};
