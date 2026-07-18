import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const patientsRepository = {
  async findMany(params: { skip: number; take: number; search?: string }) {
    const where: Prisma.PatientWhereInput = params.search
      ? {
          OR: [
            { patientCode: { contains: params.search, mode: "insensitive" } },
            { user: { firstName: { contains: params.search, mode: "insensitive" } } },
            { user: { lastName: { contains: params.search, mode: "insensitive" } } },
            { user: { email: { contains: params.search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } } },
      }),
      prisma.patient.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.patient.findUnique({
      where: { id },
      include: { user: true, medicalRecords: true, admissions: true },
    }),

  findByUserId: (userId: string) => prisma.patient.findUnique({ where: { userId } }),

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: any;
    bloodGroup?: any;
    address?: string;
    city?: string;
    country?: string;
    emergencyContact?: string;
    allergies?: string;
    chronicConditions?: string;
    passwordHash: string;
  }) {
    const count = await prisma.patient.count();
    const patientCode = `PAT-${String(count + 1).padStart(6, "0")}`;

    return prisma.patient.create({
      data: {
        patientCode,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        address: data.address,
        city: data.city,
        country: data.country,
        emergencyContact: data.emergencyContact,
        allergies: data.allergies,
        chronicConditions: data.chronicConditions,
        user: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            passwordHash: data.passwordHash,
            role: "PATIENT",
            status: "ACTIVE",
          },
        },
      },
      include: { user: true },
    });
  },

  update: (id: string, data: Prisma.PatientUpdateInput) =>
    prisma.patient.update({ where: { id }, data, include: { user: true } }),

  delete: (id: string) => prisma.patient.delete({ where: { id } }),
};