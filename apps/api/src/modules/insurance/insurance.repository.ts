import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const patientInclude = { include: { user: { select: { firstName: true, lastName: true } } } };
const policyInclude = { include: { patient: patientInclude } };

export const insuranceRepository = {
  async findManyPolicies(params: { skip: number; take: number }) {
    const [items, total] = await Promise.all([
      prisma.insurancePolicy.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        ...policyInclude,
      }),
      prisma.insurancePolicy.count(),
    ]);
    return { items, total };
  },

  findPolicyById: (id: string) => prisma.insurancePolicy.findUnique({ where: { id }, ...policyInclude }),

  createPolicy: (data: {
    patientId: string;
    provider: string;
    policyNumber: string;
    coverageDetails?: string;
    startDate: Date;
    endDate?: Date;
  }) => prisma.insurancePolicy.create({ data, ...policyInclude }),

  updatePolicy: (id: string, data: Prisma.InsurancePolicyUpdateInput) =>
    prisma.insurancePolicy.update({ where: { id }, data, ...policyInclude }),

  deletePolicy: (id: string) => prisma.insurancePolicy.delete({ where: { id } }),

  async findManyClaims(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.InsuranceClaimWhereInput = params.status ? { status: params.status as any } : {};

    const [items, total] = await Promise.all([
      prisma.insuranceClaim.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { submittedAt: "desc" },
        include: { policy: policyInclude },
      }),
      prisma.insuranceClaim.count({ where }),
    ]);

    return { items, total };
  },

  findClaimById: (id: string) =>
    prisma.insuranceClaim.findUnique({ where: { id }, include: { policy: policyInclude } }),

  createClaim: (data: { policyId: string; invoiceId?: string; amountClaimed: number; notes?: string }) => {
    const claimNumber = `CLM-${Date.now().toString().slice(-8)}`;
    return prisma.insuranceClaim.create({
      data: { ...data, claimNumber },
      include: { policy: policyInclude },
    });
  },

  updateClaim: (id: string, data: Prisma.InsuranceClaimUpdateInput) =>
    prisma.insuranceClaim.update({ where: { id }, data, include: { policy: policyInclude } }),

  deleteClaim: (id: string) => prisma.insuranceClaim.delete({ where: { id } }),
};
