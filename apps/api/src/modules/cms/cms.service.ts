import { cmsRepository } from "./cms.repository";
import { slugify } from "./cms.validation";
import { AppError } from "../../middlewares/error-handler.middleware";
import {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  CreatePageInput,
  UpdatePageInput,
  ListQuery,
} from "./cms.validation";

export const cmsService = {
  async listPosts(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await cmsRepository.findManyPosts({ skip, take: query.pageSize, status: query.status });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getPostById(id: string) {
    const post = await cmsRepository.findPostById(id);
    if (!post) throw new AppError(404, "Blog post not found");
    return post;
  },

  createPost: (authorId: string, input: CreateBlogPostInput) =>
    cmsRepository.createPost({
      ...input,
      slug: slugify(input.title),
      authorId,
      publishedAt: input.status === "PUBLISHED" ? new Date() : undefined,
    }),

  async updatePost(id: string, input: UpdateBlogPostInput) {
    const existing = await this.getPostById(id);
    const wasPublished = existing.status === "PUBLISHED";
    const willBePublished = input.status === "PUBLISHED";

    return cmsRepository.updatePost(id, {
      ...input,
      slug: input.title ? slugify(input.title) : undefined,
      publishedAt: !wasPublished && willBePublished ? new Date() : undefined,
    });
  },

  async removePost(id: string) {
    await this.getPostById(id);
    return cmsRepository.deletePost(id);
  },

  async listPages(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await cmsRepository.findManyPages({ skip, take: query.pageSize });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getPageById(id: string) {
    const page = await cmsRepository.findPageById(id);
    if (!page) throw new AppError(404, "Page not found");
    return page;
  },

  createPage: (input: CreatePageInput) => cmsRepository.createPage({ ...input, slug: slugify(input.title) }),

  async updatePage(id: string, input: UpdatePageInput) {
    await this.getPageById(id);
    return cmsRepository.updatePage(id, { ...input, slug: input.title ? slugify(input.title) : undefined });
  },

  async removePage(id: string) {
    await this.getPageById(id);
    return cmsRepository.deletePage(id);
  },
};
