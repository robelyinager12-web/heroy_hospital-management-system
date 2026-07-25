import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const hospitalsRepository = {
  async findMany(params: { skip: number; take: number }) {
    const [items, total] = await Promise.all([
      prisma.hospital.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { users: true, departments: true, patients: true, doctors: true } } },
      }),
      prisma.hospital.count(),
    ]);
    return { items, total };
  },

  findById: (id: string) => prisma.hospital.findUnique({ where: { id } }),

  create: (data: { name: string; slug: string; address?: string; city?: string; country?: string; phone?: string; email?: string }) =>
    prisma.hospital.create({ data }),

  update: (id: string, data: Prisma.HospitalUpdateInput) => prisma.hospital.update({ where: { id }, data }),

  delete: (id: string) => prisma.hospital.delete({ where: { id } }),
};
