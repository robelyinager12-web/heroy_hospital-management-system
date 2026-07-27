import { accountingRepository } from "./accounting.repository";
import { CreateExpenseInput, ListQuery } from "./accounting.validation";

export const accountingService = {
  async list(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await accountingRepository.findMany({
      skip,
      take: query.pageSize,
      category: query.category,
    });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  create: (recordedById: string, input: CreateExpenseInput) =>
    accountingRepository.create({
      ...input,
      incurredAt: input.incurredAt ? new Date(input.incurredAt) : undefined,
      recordedById,
    }),

  remove: (id: string) => accountingRepository.delete(id),

  async getSummary() {
    const [totalRevenue, totalExpenses, byCategory] = await Promise.all([
      accountingRepository.getTotalRevenue(),
      accountingRepository.getTotalExpenses(),
      accountingRepository.getExpensesByCategory(),
    ]);

    const netProfit = Number(totalRevenue) - Number(totalExpenses);

    return { totalRevenue, totalExpenses, netProfit, byCategory };
  },
};
