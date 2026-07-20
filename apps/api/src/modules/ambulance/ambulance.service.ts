import { ambulanceRepository } from "./ambulance.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyRoles } from "../notifications/notifications.service";
import { CreateAmbulanceInput, CreateRequestInput, UpdateRequestInput, ListRequestsQuery } from "./ambulance.validation";

export const ambulanceService = {
  listAmbulances: () => ambulanceRepository.listAmbulances(),
  createAmbulance: (input: CreateAmbulanceInput) => ambulanceRepository.createAmbulance(input),

  async list(query: ListRequestsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await ambulanceRepository.findManyRequests({
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
    const request = await ambulanceRepository.findRequestById(id);
    if (!request) throw new AppError(404, "Ambulance request not found");
    return request;
  },

  async createRequest(input: CreateRequestInput) {
    const request = await ambulanceRepository.createRequest(input);

    await notifyRoles(["SUPER_ADMIN", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"], {
      title: "New ambulance request",
      message: `Pickup requested at ${request.pickupLocation}, heading to ${request.destination}.`,
      metadata: { requestId: request.id },
    });

    return request;
  },

  async updateRequest(id: string, input: UpdateRequestInput) {
    await this.getById(id);

    const data: any = { ...input };
    if (input.status === "COMPLETED" || input.status === "CANCELLED") {
      data.completedAt = new Date();
    }

    const updated = await ambulanceRepository.updateRequest(id, data);

    if (input.ambulanceId && input.status === "DISPATCHED") {
      await ambulanceRepository.setAmbulanceStatus(input.ambulanceId, "ON_CALL");
    }
    if (input.status === "COMPLETED" && updated.ambulanceId) {
      await ambulanceRepository.setAmbulanceStatus(updated.ambulanceId, "AVAILABLE");
    }

    return updated;
  },

  async remove(id: string) {
    await this.getById(id);
    return ambulanceRepository.deleteRequest(id);
  },
};
