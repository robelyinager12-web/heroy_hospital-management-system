import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const patientInclude = {
  include: { user: { select: { firstName: true, lastName: true } } },
};

export const laboratoryRepository = {
  async findMany(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.LabTestWhereInput = params.status ? { status: params.status as any } : {};

    const [items, total] = await Promise.all([
      prisma.labTest.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { orderedAt: "desc" },
        include: { patient: patientInclude },
      }),
      prisma.labTest.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.labTest.findUnique({ where: { id }, include: { patient: patientInclude } }),

  create: (data: { patientId: string; testName: string; notes?: string }) =>
    prisma.labTest.create({ data, include: { patient: patientInclude } }),

  update: (id: string, data: Prisma.LabTestUpdateInput) =>
    prisma.labTest.update({
      where: { id },
      data,
      include: { patient: patientInclude },
    }),

  delete: (id: string) => prisma.labTest.delete({ where: { id } }),
};
