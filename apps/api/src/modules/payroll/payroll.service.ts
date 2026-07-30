import { payrollRepository } from "./payroll.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyUser } from "../notifications/notifications.service";
import { CreatePayslipInput, UpdatePayslipInput, ListQuery } from "./payroll.validation";

export const payrollService = {
  async list(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await payrollRepository.findMany({ skip, take: query.pageSize });
    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  listStaff: () => payrollRepository.listStaff(),

  async getById(id: string) {
    const payslip = await payrollRepository.findById(id);
    if (!payslip) throw new AppError(404, "Payslip not found");
    return payslip;
  },

  async create(input: CreatePayslipInput) {
    const netPay = input.baseSalary + input.bonus - input.deductions;
    const payslip = await payrollRepository.create({ ...input, netPay });

    await notifyUser({
      userId: input.employeeId,
      title: "Payslip generated",
      message: `Your payslip for ${input.periodMonth}/${input.periodYear} is ready — net pay $${netPay.toFixed(2)}.`,
      metadata: { payslipId: payslip.id },
    });

    return payslip;
  },

  async update(id: string, input: UpdatePayslipInput) {
    await this.getById(id);
    const data: any = { ...input };
    if (input.status === "PAID") data.paidAt = new Date();
    return payrollRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return payrollRepository.delete(id);
  },
};
