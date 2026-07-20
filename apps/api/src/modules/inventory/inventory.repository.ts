import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Excludes "medicine" so Inventory and Pharmacy never show each other's items
export const inventoryRepository = {
  async findMany(params: {
    skip: number;
    take: number;
    search?: string;
    category?: string;
    lowStockOnly?: boolean;
  }) {
    const where: Prisma.InventoryItemWhereInput = {
      category: params.category ?? { in: ["equipment", "supply"] },
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { sku: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    if (params.lowStockOnly) {
      const all = await prisma.inventoryItem.findMany({ where });
      const lowStock = all.filter((item) => item.quantity <= item.reorderLevel);
      const paged = lowStock.slice(params.skip, params.skip + params.take);
      return { items: paged, total: lowStock.length };
    }

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { name: "asc" },
      }),
      prisma.inventoryItem.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) =>
    prisma.inventoryItem.findFirst({ where: { id, category: { in: ["equipment", "supply"] } } }),

  create: (data: {
    name: string;
    category: string;
    sku: string;
    unit: string;
    quantity: number;
    reorderLevel: number;
    unitCost?: number;
  }) => prisma.inventoryItem.create({ data }),

  update: (id: string, data: Prisma.InventoryItemUpdateInput) =>
    prisma.inventoryItem.update({ where: { id }, data }),

  adjustStock: (id: string, delta: number) =>
    prisma.inventoryItem.update({ where: { id }, data: { quantity: { increment: delta } } }),

  delete: (id: string) => prisma.inventoryItem.delete({ where: { id } }),
};
