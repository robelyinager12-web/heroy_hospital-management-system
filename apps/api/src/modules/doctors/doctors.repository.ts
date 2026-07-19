import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const doctorsRepository = {
  async findMany(params: { skip: number; take: number; search?: string }) {
    const where: Prisma.DoctorWhereInput = params.search
      ? {
          OR: [
            { doctorCode: { contains: params.search, mode: "insensitive" } },
            { specialization: { contains: params.search, mode: "insensitive" } },
            { user: { firstName: { contains: params.search, mode: "insensitive" } } },
            { user: { lastName: { contains: params.search, mode: "insensitive" } } },
            { user: { email: { contains: params.search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
          department: { select: { name: true } },
        },
      }),
      prisma.doctor.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.doctor.findUnique({
      where: { id },
      include: { user: true, department: true, schedules: true },
    }),

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    specialization: string;
    licenseNumber: string;
    qualifications?: string;
    yearsExperience?: number;
    consultationFee?: number;
    bio?: string;
    departmentId?: string;
    passwordHash: string;
  }) {
    const count = await prisma.doctor.count();
    const doctorCode = `DOC-${String(count + 1).padStart(6, "0")}`;

    return prisma.doctor.create({
      data: {
        doctorCode,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        qualifications: data.qualifications,
        yearsExperience: data.yearsExperience,
        consultationFee: data.consultationFee,
        bio: data.bio,
        departmentId: data.departmentId,
        user: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            passwordHash: data.passwordHash,
            role: "DOCTOR",
            status: "ACTIVE",
          },
        },
      },
      include: { user: true },
    });
  },

  update: (id: string, data: Prisma.DoctorUpdateInput) =>
    prisma.doctor.update({ where: { id }, data, include: { user: true } }),

  delete: (id: string) => prisma.doctor.delete({ where: { id } }),
};
