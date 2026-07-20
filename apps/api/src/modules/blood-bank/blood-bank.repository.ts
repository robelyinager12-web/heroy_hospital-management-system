import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const patientInclude = { include: { user: { select: { firstName: true, lastName: true } } } };

const ALL_GROUPS = [
  "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
  "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE",
] as const;

export const bloodBankRepository = {
  async listStock() {
    // Ensure every blood group has a row, even if never touched before
    const existing = await prisma.bloodStock.findMany();
    const existingGroups = new Set(existing.map((s) => s.bloodGroup));
    const missing = ALL_GROUPS.filter((g) => !existingGroups.has(g));

    if (missing.length > 0) {
      await prisma.bloodStock.createMany({
        data: missing.map((bloodGroup) => ({ bloodGroup, units: 0 })),
        skipDuplicates: true,
      });
    }

    return prisma.bloodStock.findMany({ orderBy: { bloodGroup: "asc" } });
  },

  adjustStock: (bloodGroup: any, delta: number) =>
    prisma.bloodStock.upsert({
      where: { bloodGroup },
      create: { bloodGroup, units: Math.max(delta, 0) },
      update: { units: { increment: delta } },
    }),

  findStockByGroup: (bloodGroup: any) => prisma.bloodStock.findUnique({ where: { bloodGroup } }),

  async findManyRequests(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.BloodRequestWhereInput = params.status ? { status: params.status as any } : {};

    const [items, total] = await Promise.all([
      prisma.bloodRequest.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { requestedAt: "desc" },
        include: { patient: patientInclude },
      }),
      prisma.bloodRequest.count({ where }),
    ]);

    return { items, total };
  },

  findRequestById: (id: string) =>
    prisma.bloodRequest.findUnique({ where: { id }, include: { patient: patientInclude } }),

  createRequest: (data: { patientId?: string; bloodGroup: any; unitsRequested: number; notes?: string }) =>
    prisma.bloodRequest.create({ data, include: { patient: patientInclude } }),

  updateRequest: (id: string, data: Prisma.BloodRequestUpdateInput) =>
    prisma.bloodRequest.update({ where: { id }, data, include: { patient: patientInclude } }),

  deleteRequest: (id: string) => prisma.bloodRequest.delete({ where: { id } }),
};
