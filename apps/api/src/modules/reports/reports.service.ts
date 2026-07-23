import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const reportsService = {
  async getOverview() {
    const [
      totalPatients,
      totalDoctors,
      totalNurses,
      totalAppointments,
      appointmentsByStatus,
      totalBeds,
      occupiedBeds,
      completedPayments,
      pendingInvoicesTotal,
      activeEmergencies,
      lowStockMedicines,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.user.count({ where: { role: "DOCTOR" } }),
      prisma.user.count({ where: { role: "NURSE" } }),
      prisma.appointment.count(),
      prisma.appointment.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.bed.count(),
      prisma.bed.count({ where: { isOccupied: true } }),
      prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
      prisma.invoice.aggregate({ where: { status: { in: ["PENDING", "PARTIALLY_PAID"] } }, _sum: { total: true } }),
      prisma.admission.count({ where: { dischargedAt: null } }),
      prisma.inventoryItem.findMany({ where: { category: "medicine" } }),
    ]);

    const lowStockCount = lowStockMedicines.filter((m) => m.quantity <= m.reorderLevel).length;

    return {
      totalPatients,
      totalDoctors,
      totalNurses,
      totalAppointments,
      appointmentsByStatus: appointmentsByStatus.map((a) => ({ status: a.status, count: a._count.status })),
      bedOccupancy: { total: totalBeds, occupied: occupiedBeds },
      totalRevenue: completedPayments._sum.amount ?? 0,
      pendingInvoicesTotal: pendingInvoicesTotal._sum.total ?? 0,
      activeEmergencies,
      lowStockCount,
    };
  },

  async getRevenueTrend() {
    // Last 6 months of completed payments, grouped by month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const payments = await prisma.payment.findMany({
      where: { status: "COMPLETED", paidAt: { gte: sixMonthsAgo } },
      select: { amount: true, paidAt: true },
    });

    const monthMap = new Map<string, number>();
    const monthLabels: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString("default", { month: "short" });
      monthMap.set(key, 0);
      monthLabels.push(label);
    }

    payments.forEach((p) => {
      if (!p.paidAt) return;
      const key = `${p.paidAt.getFullYear()}-${p.paidAt.getMonth()}`;
      if (monthMap.has(key)) {
        monthMap.set(key, (monthMap.get(key) ?? 0) + Number(p.amount));
      }
    });

    const values = Array.from(monthMap.values());
    return monthLabels.map((month, i) => ({ month, revenue: values[i] }));
  },

  async getPatientGrowth() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const patients = await prisma.patient.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    const monthMap = new Map<string, number>();
    const monthLabels: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString("default", { month: "short" });
      monthMap.set(key, 0);
      monthLabels.push(label);
    }

    patients.forEach((p) => {
      const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`;
      if (monthMap.has(key)) {
        monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
      }
    });

    const values = Array.from(monthMap.values());
    return monthLabels.map((month, i) => ({ month, patients: values[i] }));
  },

  async getTopDoctors() {
    const grouped = await prisma.appointment.groupBy({
      by: ["doctorId"],
      _count: { doctorId: true },
      orderBy: { _count: { doctorId: "desc" } },
      take: 5,
    });

    const doctorIds = grouped.map((g) => g.doctorId);
    const users = await prisma.user.findMany({
      where: { id: { in: doctorIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    return grouped.map((g) => {
      const user = users.find((u) => u.id === g.doctorId);
      return {
        name: user ? `Dr. ${user.firstName} ${user.lastName}` : "Unknown",
        appointments: g._count.doctorId,
      };
    });
  },
};
