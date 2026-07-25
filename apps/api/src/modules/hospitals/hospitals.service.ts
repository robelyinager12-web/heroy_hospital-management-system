import { hospitalsRepository } from "./hospitals.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateHospitalInput, UpdateHospitalInput, ListQuery } from "./hospitals.validation";

export const hospitalsService = {
  async list(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await hospitalsRepository.findMany({ skip, take: query.pageSize });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getById(id: string) {
    const hospital = await hospitalsRepository.findById(id);
    if (!hospital) throw new AppError(404, "Hospital not found");
    return hospital;
  },

  create: (input: CreateHospitalInput) => hospitalsRepository.create(input),

  async update(id: string, input: UpdateHospitalInput) {
    await this.getById(id);
    return hospitalsRepository.update(id, input);
  },

  async remove(id: string) {
    await this.getById(id);
    return hospitalsRepository.delete(id);
  },
};
