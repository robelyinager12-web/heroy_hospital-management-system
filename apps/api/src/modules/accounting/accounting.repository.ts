import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const accountingRepository = {
  async findMany(params: { skip: number; take: number; category?: string }) {
    const where: Prisma.ExpenseWhereInput = params.category ? { category: params.category as any } : {};

    const [items, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { incurredAt: "desc" },
        include: { recordedBy: { select: { firstName: true, lastName: true } } },
      }),
      prisma.expense.count({ where }),
    ]);

    return { items, total };
  },

  create: (data: { description: string; category: any; amount: number; incurredAt?: Date; recordedById: string }) =>
    prisma.expense.create({ data, include: { recordedBy: { select: { firstName: true, lastName: true } } } }),

  delete: (id: string) => prisma.expense.delete({ where: { id } }),

  async getTotalExpenses() {
    const result = await prisma.expense.aggregate({ _sum: { amount: true } });
    return result._sum.amount ?? 0;
  },

  async getTotalRevenue() {
    const result = await prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } });
    return result._sum.amount ?? 0;
  },

  async getExpensesByCategory() {
    const grouped = await prisma.expense.groupBy({ by: ["category"], _sum: { amount: true } });
    return grouped.map((g) => ({ category: g.category, total: g._sum.amount ?? 0 }));
  },
};
