import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const authorInclude = { include: { author: { select: { firstName: true, lastName: true } } } };

export const cmsRepository = {
  // Blog posts
  async findManyPosts(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.BlogPostWhereInput = params.status ? { status: params.status as any } : {};

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        ...authorInclude,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { items, total };
  },

  findPostById: (id: string) => prisma.blogPost.findUnique({ where: { id }, ...authorInclude }),
  findPostBySlug: (slug: string) => prisma.blogPost.findUnique({ where: { slug }, ...authorInclude }),

  createPost: (data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImageUrl?: string;
    status: any;
    authorId: string;
    publishedAt?: Date;
  }) => prisma.blogPost.create({ data, ...authorInclude }),

  updatePost: (id: string, data: Prisma.BlogPostUpdateInput) =>
    prisma.blogPost.update({ where: { id }, data, ...authorInclude }),

  deletePost: (id: string) => prisma.blogPost.delete({ where: { id } }),

  // CMS pages
  async findManyPages(params: { skip: number; take: number }) {
    const [items, total] = await Promise.all([
      prisma.cmsPage.findMany({ skip: params.skip, take: params.take, orderBy: { title: "asc" } }),
      prisma.cmsPage.count(),
    ]);
    return { items, total };
  },

  findPageById: (id: string) => prisma.cmsPage.findUnique({ where: { id } }),

  createPage: (data: { title: string; slug: string; content: string; status: any }) =>
    prisma.cmsPage.create({ data }),

  updatePage: (id: string, data: Prisma.CmsPageUpdateInput) => prisma.cmsPage.update({ where: { id }, data }),

  deletePage: (id: string) => prisma.cmsPage.delete({ where: { id } }),
};
