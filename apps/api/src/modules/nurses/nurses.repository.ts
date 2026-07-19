import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const nursesRepository = {
  async findMany(params: { skip: number; take: number; search?: string }) {
    const where: Prisma.UserWhereInput = {
      role: "NURSE",
      ...(params.search
        ? {
            OR: [
              { firstName: { contains: params.search, mode: "insensitive" } },
              { lastName: { contains: params.search, mode: "insensitive" } },
              { email: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.user.findFirst({
      where: { id, role: "NURSE" },
    }),

  create: (data: { firstName: string; lastName: string; email: string; phone?: string; passwordHash: string }) =>
    prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        role: "NURSE",
        status: "ACTIVE",
      },
    }),

  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data }),

  delete: (id: string) => prisma.user.delete({ where: { id } }),
};
