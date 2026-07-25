import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const auditLogsRepository = {
  async findMany(params: { skip: number; take: number; entity?: string; action?: string }) {
    const where: Prisma.AuditLogWhereInput = {
      ...(params.entity ? { entity: params.entity } : {}),
      ...(params.action ? { action: params.action } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, role: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  },

  create: (data: { userId?: string; action: string; entity: string; entityId?: string; metadata?: any; ipAddress?: string }) =>
    prisma.auditLog.create({ data }),
};
