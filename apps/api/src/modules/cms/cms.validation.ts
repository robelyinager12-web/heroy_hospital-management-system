import { z } from "zod";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const createBlogPostSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  coverImageUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const createPageSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const updatePageSchema = createPageSchema.partial();

export const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export { slugify };
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
