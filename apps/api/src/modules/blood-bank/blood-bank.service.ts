import { bloodBankRepository } from "./blood-bank.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyRoles } from "../notifications/notifications.service";
import { AdjustStockInput, CreateRequestInput, UpdateRequestInput, ListRequestsQuery } from "./blood-bank.validation";

export const bloodBankService = {
  listStock: () => bloodBankRepository.listStock(),

  async adjustStock(input: AdjustStockInput) {
    const current = await bloodBankRepository.findStockByGroup(input.bloodGroup);
    const currentUnits = current?.units ?? 0;

    if (currentUnits + input.delta < 0) {
      throw new AppError(400, "Cannot remove more units than are currently in stock");
    }

    return bloodBankRepository.adjustStock(input.bloodGroup, input.delta);
  },

  async list(query: ListRequestsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await bloodBankRepository.findManyRequests({
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
    const request = await bloodBankRepository.findRequestById(id);
    if (!request) throw new AppError(404, "Blood request not found");
    return request;
  },

  async createRequest(input: CreateRequestInput) {
    const request = await bloodBankRepository.createRequest(input);

    await notifyRoles(["SUPER_ADMIN", "HOSPITAL_ADMIN", "LAB_TECHNICIAN"], {
      title: "Blood request",
      message: `${input.unitsRequested} unit(s) of ${input.bloodGroup.replace("_", " ")} requested.`,
      metadata: { requestId: request.id },
    });

    return request;
  },

  async updateRequest(id: string, input: UpdateRequestInput) {
    const existing = await this.getById(id);

    const data: any = { ...input };
    if (input.status === "FULFILLED") {
      data.fulfilledAt = new Date();
      // Deduct from stock when fulfilled
      const stock = await bloodBankRepository.findStockByGroup(existing.bloodGroup);
      if (!stock || stock.units < existing.unitsRequested) {
        throw new AppError(400, "Not enough units in stock to fulfill this request");
      }
      await bloodBankRepository.adjustStock(existing.bloodGroup, -existing.unitsRequested);
    }

    return bloodBankRepository.updateRequest(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return bloodBankRepository.deleteRequest(id);
  },
};
