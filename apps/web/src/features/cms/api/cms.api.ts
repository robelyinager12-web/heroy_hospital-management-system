import { apiClient } from "@/lib/api-client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  author: { firstName: string; lastName: string };
}

export interface BlogListResponse {
  items: BlogPost[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const cmsApi = {
  listPosts: (params: { page?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.status) query.set("status", params.status);
    return apiClient.get(`/cms/posts?${query.toString()}`);
  },
  createPost: (data: Record<string, unknown>) => apiClient.post("/cms/posts", data),
  updatePost: (id: string, data: Record<string, unknown>) => apiClient.put(`/cms/posts/${id}`, data),
  removePost: (id: string) => apiClient.delete(`/cms/posts/${id}`),
};
