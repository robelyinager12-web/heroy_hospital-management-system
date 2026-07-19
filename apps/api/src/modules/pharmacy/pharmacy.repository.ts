import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const MEDICINE_CATEGORY = "medicine";

export const pharmacyRepository = {
  async findMany(params: { skip: number; take: number; search?: string; lowStockOnly?: boolean }) {
    const where: Prisma.InventoryItemWhereInput = {
      category: MEDICINE_CATEGORY,
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { sku: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [allMatching, total] = await Promise.all([
      params.lowStockOnly
        ? prisma.inventoryItem.findMany({ where })
        : Promise.resolve(null),
      prisma.inventoryItem.count({ where }),
    ]);

    if (params.lowStockOnly && allMatching) {
      const lowStock = allMatching.filter((item) => item.quantity <= item.reorderLevel);
      const paged = lowStock.slice(params.skip, params.skip + params.take);
      return { items: paged, total: lowStock.length };
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { name: "asc" },
    });

    return { items, total };
  },

  findById: (id: string) => prisma.inventoryItem.findFirst({ where: { id, category: MEDICINE_CATEGORY } }),

  create: (data: {
    name: string;
    sku: string;
    unit: string;
    quantity: number;
    reorderLevel: number;
    unitCost?: number;
    expiryDate?: Date;
  }) =>
    prisma.inventoryItem.create({
      data: { ...data, category: MEDICINE_CATEGORY },
    }),

  update: (id: string, data: Prisma.InventoryItemUpdateInput) =>
    prisma.inventoryItem.update({ where: { id }, data }),

  adjustStock: (id: string, delta: number) =>
    prisma.inventoryItem.update({
      where: { id },
      data: { quantity: { increment: delta } },
    }),

  delete: (id: string) => prisma.inventoryItem.delete({ where: { id } }),
};
