import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const invoiceInclude = {
  include: {
    patient: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
    items: true,
    payments: true,
  },
};

export const billingRepository = {
  async findMany(params: { skip: number; take: number; status?: string }) {
    const where: Prisma.InvoiceWhereInput = params.status ? { status: params.status as any } : {};

    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        ...invoiceInclude,
      }),
      prisma.invoice.count({ where }),
    ]);

    return { items, total };
  },

  findById: (id: string) => prisma.invoice.findUnique({ where: { id }, ...invoiceInclude }),

  async create(data: {
    patientId: string;
    items: { description: string; quantity: number; unitPrice: number }[];
    tax: number;
    discount: number;
    dueDate?: Date;
  }) {
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const total = subtotal + data.tax - data.discount;

    const count = await prisma.invoice.count();
    const invoiceNo = `INV-${String(count + 1).padStart(6, "0")}`;

    return prisma.invoice.create({
      data: {
        invoiceNo,
        patientId: data.patientId,
        subtotal,
        tax: data.tax,
        discount: data.discount,
        total,
        dueDate: data.dueDate,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      ...invoiceInclude,
    });
  },

  addPayment: (invoiceId: string, data: { amount: number; method: any; transactionRef?: string }) =>
    prisma.payment.create({
      data: {
        invoiceId,
        amount: data.amount,
        method: data.method,
        transactionRef: data.transactionRef,
        status: "COMPLETED",
        paidAt: new Date(),
      },
    }),

  updateStatus: (id: string, status: any) => prisma.invoice.update({ where: { id }, data: { status } }),

  getTotalPaid: async (invoiceId: string) => {
    const result = await prisma.payment.aggregate({
      where: { invoiceId, status: "COMPLETED" },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  },

  delete: (id: string) => prisma.invoice.delete({ where: { id } }),
};
