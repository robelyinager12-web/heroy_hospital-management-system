import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const patientInclude = {
  include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } },
};

export const emergencyRepository = {
  async findMany(params: { skip: number; take: number; activeOnly?: boolean }) {
    const where: Prisma.AdmissionWhereInput = params.activeOnly ? { dischargedAt: null } : {};

    const [items, total] = await Promise.all([
      prisma.admission.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { admittedAt: "desc" },
        include: { patient: patientInclude },
      }),
      prisma.admission.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.admission.findUnique({
      where: { id },
      include: { patient: patientInclude },
    }),

  create: (data: { patientId: string; reason: string; notes?: string }) =>
    prisma.admission.create({
      data,
      include: { patient: patientInclude },
    }),

  update: (id: string, data: Prisma.AdmissionUpdateInput) =>
    prisma.admission.update({
      where: { id },
      data,
      include: { patient: patientInclude },
    }),

  delete: (id: string) => prisma.admission.delete({ where: { id } }),
};
