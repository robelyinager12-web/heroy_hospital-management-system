import { emergencyRepository } from "./emergency.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateEmergencyCaseInput, UpdateEmergencyCaseInput, ListEmergencyQuery } from "./emergency.validation";

export const emergencyService = {
  async list(query: ListEmergencyQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await emergencyRepository.findMany({
      skip,
      take: query.pageSize,
      activeOnly: query.activeOnly,
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
    const emergencyCase = await emergencyRepository.findById(id);
    if (!emergencyCase) throw new AppError(404, "Emergency case not found");
    return emergencyCase;
  },

  create: (input: CreateEmergencyCaseInput) => emergencyRepository.create(input),

  async update(id: string, input: UpdateEmergencyCaseInput) {
    await this.getById(id);
    return emergencyRepository.update(id, {
      ...input,
      dischargedAt: input.dischargedAt ? new Date(input.dischargedAt) : undefined,
    });
  },

  async remove(id: string) {
    await this.getById(id);
    return emergencyRepository.delete(id);
  },

  async discharge(id: string) {
    await this.getById(id);
    return emergencyRepository.update(id, { dischargedAt: new Date() });
  },
};
