import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userSelect = {
  select: { id: true, firstName: true, lastName: true, email: true },
};

export const appointmentsRepository = {
  async findMany(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.AppointmentWhereInput = params.status ? { status: params.status as any } : {};

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { scheduledAt: "desc" },
        include: { patient: userSelect, doctor: userSelect },
      }),
      prisma.appointment.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.appointment.findUnique({
      where: { id },
      include: { patient: userSelect, doctor: userSelect },
    }),

  create: (data: {
    patientId: string;
    doctorId: string;
    type: any;
    scheduledAt: Date;
    durationMins: number;
    reason?: string;
    notes?: string;
  }) =>
    prisma.appointment.create({
      data,
      include: { patient: userSelect, doctor: userSelect },
    }),

  update: (id: string, data: Prisma.AppointmentUpdateInput) =>
    prisma.appointment.update({
      where: { id },
      data,
      include: { patient: userSelect, doctor: userSelect },
    }),

  delete: (id: string) => prisma.appointment.delete({ where: { id } }),
};
