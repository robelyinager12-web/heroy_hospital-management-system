import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const patientInclude = {
  include: { user: { select: { firstName: true, lastName: true } } },
};

// Radiology orders are stored in the same LabTest table as lab tests,
// tagged via resultUnit = "IMAGING" so the two modules stay visually and
// functionally separate without needing a schema migration.
const RADIOLOGY_TAG = "IMAGING";

export const radiologyRepository = {
  async findMany(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.LabTestWhereInput = {
      resultUnit: RADIOLOGY_TAG,
      ...(params.status ? { status: params.status as any } : {}),
    };

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
    prisma.labTest.findFirst({ where: { id, resultUnit: RADIOLOGY_TAG }, include: { patient: patientInclude } }),

  create: (data: { patientId: string; testName: string; notes?: string }) =>
    prisma.labTest.create({
      data: { ...data, resultUnit: RADIOLOGY_TAG },
      include: { patient: patientInclude },
    }),

  update: (id: string, data: Prisma.LabTestUpdateInput) =>
    prisma.labTest.update({
      where: { id },
      data: { ...data, resultUnit: RADIOLOGY_TAG },
      include: { patient: patientInclude },
    }),

  delete: (id: string) => prisma.labTest.delete({ where: { id } }),
};
