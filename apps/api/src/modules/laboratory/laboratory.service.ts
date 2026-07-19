import { laboratoryRepository } from "./laboratory.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateLabTestInput, UpdateLabResultInput, ListLabTestsQuery } from "./laboratory.validation";

export const laboratoryService = {
  async list(query: ListLabTestsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await laboratoryRepository.findMany({
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
    const labTest = await laboratoryRepository.findById(id);
    if (!labTest) throw new AppError(404, "Lab test not found");
    return labTest;
  },

  create: (input: CreateLabTestInput) => laboratoryRepository.create(input),

  async update(id: string, input: UpdateLabResultInput) {
    await this.getById(id);

    const data: any = { ...input };
    if (input.status === "COMPLETED") {
      data.completedAt = new Date();
    }

    return laboratoryRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return laboratoryRepository.delete(id);
  },
};
