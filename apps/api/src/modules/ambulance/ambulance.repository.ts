import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const patientInclude = { include: { user: { select: { firstName: true, lastName: true } } } };

export const ambulanceRepository = {
  listAmbulances: () => prisma.ambulance.findMany({ orderBy: { vehicleNumber: "asc" } }),

  createAmbulance: (data: { vehicleNumber: string; driverName: string; driverPhone?: string }) =>
    prisma.ambulance.create({ data }),

  setAmbulanceStatus: (id: string, status: any) => prisma.ambulance.update({ where: { id }, data: { status } }),

  async findManyRequests(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.AmbulanceRequestWhereInput = params.status ? { status: params.status as any } : {};

    const [items, total] = await Promise.all([
      prisma.ambulanceRequest.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { requestedAt: "desc" },
        include: { patient: patientInclude, ambulance: true },
      }),
      prisma.ambulanceRequest.count({ where }),
    ]);

    return { items, total };
  },

  findRequestById: (id: string) =>
    prisma.ambulanceRequest.findUnique({ where: { id }, include: { patient: patientInclude, ambulance: true } }),

  createRequest: (data: { patientId?: string; pickupLocation: string; destination: string; notes?: string }) =>
    prisma.ambulanceRequest.create({ data, include: { patient: patientInclude, ambulance: true } }),

  updateRequest: (id: string, data: Prisma.AmbulanceRequestUpdateInput) =>
    prisma.ambulanceRequest.update({
      where: { id },
      data,
      include: { patient: patientInclude, ambulance: true },
    }),

  deleteRequest: (id: string) => prisma.ambulanceRequest.delete({ where: { id } }),
};
