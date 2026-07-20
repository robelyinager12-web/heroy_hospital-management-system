import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userSelect = { select: { id: true, firstName: true, lastName: true } };
const SURGERY_TAG = "[SURGERY]";

export const surgeryRepository = {
  async findMany(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.AppointmentWhereInput = {
      reason: { startsWith: SURGERY_TAG },
      ...(params.status ? { status: params.status as any } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { scheduledAt: "asc" },
        include: { patient: userSelect, doctor: userSelect },
      }),
      prisma.appointment.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.appointment.findFirst({
      where: { id, reason: { startsWith: SURGERY_TAG } },
      include: { patient: userSelect, doctor: userSelect },
    }),

  create: (data: {
    patientId: string;
    doctorId: string;
    procedureName: string;
    scheduledAt: Date;
    durationMins: number;
    notes?: string;
  }) =>
    prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        type: "IN_PERSON",
        scheduledAt: data.scheduledAt,
        durationMins: data.durationMins,
        reason: `${SURGERY_TAG} ${data.procedureName}`,
        notes: data.notes,
      },
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

export { SURGERY_TAG };
