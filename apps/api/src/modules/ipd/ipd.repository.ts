import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const patientInclude = { include: { user: { select: { firstName: true, lastName: true } } } };
const bedInclude = { include: { ward: true } };

export const ipdRepository = {
  // Wards
  listWards: () => prisma.ward.findMany({ include: { beds: true }, orderBy: { name: "asc" } }),
  createWard: (data: { name: string; floor?: string }) => prisma.ward.create({ data }),

  // Beds
  listBeds: (wardId?: string) =>
    prisma.bed.findMany({
      where: wardId ? { wardId } : undefined,
      include: { ward: true },
      orderBy: [{ ward: { name: "asc" } }, { bedNumber: "asc" }],
    }),
  createBed: (data: { wardId: string; bedNumber: string }) =>
    prisma.bed.create({ data, ...bedInclude }),
  findBedById: (id: string) => prisma.bed.findUnique({ where: { id } }),
  setBedOccupied: (id: string, isOccupied: boolean) =>
    prisma.bed.update({ where: { id }, data: { isOccupied } }),

  // Admissions
  async findManyAdmissions(params: { skip: number; take: number; activeOnly?: boolean }) {
    const where: Prisma.AdmissionWhereInput = {
      bedId: { not: null },
      ...(params.activeOnly ? { dischargedAt: null } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.admission.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { admittedAt: "desc" },
        include: { patient: patientInclude, bed: bedInclude },
      }),
      prisma.admission.count({ where }),
    ]);

    return { items, total };
  },

  findAdmissionById: (id: string) =>
    prisma.admission.findUnique({ where: { id }, include: { patient: patientInclude, bed: bedInclude } }),

  createAdmission: (data: { patientId: string; bedId: string; reason: string; notes?: string }) =>
    prisma.admission.create({ data, include: { patient: patientInclude, bed: bedInclude } }),

  dischargeAdmission: (id: string) =>
    prisma.admission.update({
      where: { id },
      data: { dischargedAt: new Date() },
      include: { patient: patientInclude, bed: bedInclude },
    }),

  deleteAdmission: (id: string) => prisma.admission.delete({ where: { id } }),
};
