import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
const employeeInclude = { include: { employee: { select: { firstName: true, lastName: true, role: true } } } };

export const payrollRepository = {
  async findMany(params: { skip: number; take: number }) {
    const [items, total] = await Promise.all([
      prisma.payslip.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
        ...employeeInclude,
      }),
      prisma.payslip.count(),
    ]);
    return { items, total };
  },

  findById: (id: string) => prisma.payslip.findUnique({ where: { id }, ...employeeInclude }),

  listStaff: () =>
    prisma.user.findMany({
      where: { role: { not: "PATIENT" } },
      select: { id: true, firstName: true, lastName: true, role: true },
      orderBy: { firstName: "asc" },
    }),

  create: (data: {
    employeeId: string;
    baseSalary: number;
    bonus: number;
    deductions: number;
    netPay: number;
    periodMonth: number;
    periodYear: number;
  }) => prisma.payslip.create({ data, ...employeeInclude }),

  update: (id: string, data: Prisma.PayslipUpdateInput) => prisma.payslip.update({ where: { id }, data, ...employeeInclude }),

  delete: (id: string) => prisma.payslip.delete({ where: { id } }),
};
