import { radiologyRepository } from "./radiology.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateRadiologyOrderInput, UpdateRadiologyResultInput, ListRadiologyQuery } from "./radiology.validation";

export const radiologyService = {
  async list(query: ListRadiologyQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await radiologyRepository.findMany({
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
    const order = await radiologyRepository.findById(id);
    if (!order) throw new AppError(404, "Radiology order not found");
    return order;
  },

  create: (input: CreateRadiologyOrderInput) => radiologyRepository.create(input),

  async update(id: string, input: UpdateRadiologyResultInput) {
    await this.getById(id);

    const data: any = { ...input };
    if (input.status === "COMPLETED") {
      data.completedAt = new Date();
    }

    return radiologyRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return radiologyRepository.delete(id);
  },
};
