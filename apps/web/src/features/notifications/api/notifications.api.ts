import { apiClient } from "@/lib/api-client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
  createdAt: string;
  metadata?: any;
}

export interface NotificationListResponse {
  items: Notification[];
  unreadCount: number;
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const notificationsApi = {
  list: (params: { page?: number; unreadOnly?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.unreadOnly) query.set("unreadOnly", "true");
    return apiClient.get(`/notifications?${query.toString()}`);
  },
  markRead: (id: string) => apiClient.post(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post(`/notifications/read-all`),
};
