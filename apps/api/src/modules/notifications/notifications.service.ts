import { notificationsRepository } from "./notifications.repository";
import { ListNotificationsQuery } from "./notifications.validation";

export const notificationsService = {
  async list(userId: string, query: ListNotificationsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total, unreadCount } = await notificationsRepository.findMany(userId, {
      skip,
      take: query.pageSize,
      unreadOnly: query.unreadOnly,
    });

    return {
      items,
      unreadCount,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  },

  markRead: (id: string, userId: string) => notificationsRepository.markRead(id, userId),
  markAllRead: (userId: string) => notificationsRepository.markAllRead(userId),
};

// Exported so other modules (appointments, pharmacy, emergency) can trigger real notifications
export const notifyRoles = notificationsRepository.createForRoles;
export const notifyUser = notificationsRepository.create;
