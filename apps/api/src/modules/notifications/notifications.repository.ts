import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const notificationsRepository = {
  async findMany(userId: string, params: { skip: number; take: number; unreadOnly?: boolean }) {
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(params.unreadOnly ? { status: "UNREAD" } : {}),
    };

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, status: "UNREAD" } }),
    ]);

    return { items, total, unreadCount };
  },

  markRead: (id: string, userId: string) =>
    prisma.notification.updateMany({ where: { id, userId }, data: { status: "READ" } }),

  markAllRead: (userId: string) =>
    prisma.notification.updateMany({ where: { userId, status: "UNREAD" }, data: { status: "READ" } }),

  // Used internally by other modules to create notifications (e.g. appointment booked, low stock)
  create: (data: { userId: string; title: string; message: string; metadata?: any }) =>
    prisma.notification.create({
      data: { ...data, channel: "IN_APP", status: "UNREAD" },
    }),

  createForRoles: async (roles: string[], data: { title: string; message: string; metadata?: any }) => {
    const users = await prisma.user.findMany({ where: { role: { in: roles as any } }, select: { id: true } });
    if (users.length === 0) return;

    await prisma.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
        channel: "IN_APP",
        status: "UNREAD",
      })),
    });
  },
};
