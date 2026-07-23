import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userSelect = { select: { id: true, firstName: true, lastName: true, role: true, avatarUrl: true } };

export const chatRepository = {
  async listConversationsForUser(userId: string) {
    const conversations = await prisma.chatConversation.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: { include: { user: userSelect } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    return conversations;
  },

  async findExistingDirectConversation(userIdA: string, userIdB: string) {
    const conversations = await prisma.chatConversation.findMany({
      where: {
        isGroup: false,
        AND: [
          { participants: { some: { userId: userIdA } } },
          { participants: { some: { userId: userIdB } } },
        ],
      },
      include: { participants: true },
    });

    return conversations.find((c) => c.participants.length === 2) ?? null;
  },

  createDirectConversation: (userIdA: string, userIdB: string) =>
    prisma.chatConversation.create({
      data: {
        isGroup: false,
        participants: { create: [{ userId: userIdA }, { userId: userIdB }] },
      },
      include: { participants: { include: { user: userSelect } } },
    }),

  findConversationForUser: (conversationId: string, userId: string) =>
    prisma.chatConversation.findFirst({
      where: { id: conversationId, participants: { some: { userId } } },
      include: { participants: { include: { user: userSelect } } },
    }),

  listMessages: (conversationId: string) =>
    prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: { sender: userSelect },
    }),

  createMessage: (conversationId: string, senderId: string, content: string) =>
    prisma.chatMessage.create({
      data: { conversationId, senderId, content },
      include: { sender: userSelect },
    }),

  touchConversation: (id: string) =>
    prisma.chatConversation.update({ where: { id }, data: { updatedAt: new Date() } }),

  markRead: (conversationId: string, userId: string) =>
    prisma.chatParticipant.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: new Date() },
    }),

  listStaffUsers: (excludeUserId: string) =>
    prisma.user.findMany({
      where: { id: { not: excludeUserId }, role: { not: "PATIENT" } },
      select: { id: true, firstName: true, lastName: true, role: true, avatarUrl: true },
      orderBy: { firstName: "asc" },
    }),
};
