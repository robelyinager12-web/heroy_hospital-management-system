import { billingRepository } from "./billing.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateInvoiceInput, RecordPaymentInput, ListInvoicesQuery } from "./billing.validation";

export const billingService = {
  async list(query: ListInvoicesQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await billingRepository.findMany({
      skip,
      take: query.pageSize,
      status: query.status,
    });

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  },

  async getById(id: string) {
    const invoice = await billingRepository.findById(id);
    if (!invoice) throw new AppError(404, "Invoice not found");
    return invoice;
  },

  create: (input: CreateInvoiceInput) =>
    billingRepository.create({
      ...input,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    }),

  async recordPayment(invoiceId: string, input: RecordPaymentInput) {
    const invoice = await this.getById(invoiceId);

    await billingRepository.addPayment(invoiceId, input);

    const totalPaid = (await billingRepository.getTotalPaid(invoiceId)) as number;
    const total = Number(invoice.total);

    let newStatus: string;
    if (totalPaid >= total) newStatus = "PAID";
    else if (totalPaid > 0) newStatus = "PARTIALLY_PAID";
    else newStatus = "PENDING";

    return billingRepository.updateStatus(invoiceId, newStatus);
  },

  async remove(id: string) {
    await this.getById(id);
    return billingRepository.delete(id);
  },
};
