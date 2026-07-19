import crypto from "crypto";
import { nursesRepository } from "./nurses.repository";
import { hashPassword } from "../../utils/password.util";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateNurseInput, UpdateNurseInput, ListNursesQuery } from "./nurses.validation";

export const nursesService = {
  async list(query: ListNursesQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await nursesRepository.findMany({
      skip,
      take: query.pageSize,
      search: query.search,
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
    const nurse = await nursesRepository.findById(id);
    if (!nurse) throw new AppError(404, "Nurse not found");
    return nurse;
  },

  async create(input: CreateNurseInput) {
    const tempPassword = crypto.randomBytes(12).toString("hex");
    const passwordHash = await hashPassword(tempPassword);

    const nurse = await nursesRepository.create({ ...input, passwordHash });

    return { nurse, tempPassword };
  },

  async update(id: string, input: UpdateNurseInput) {
    await this.getById(id);
    return nursesRepository.update(id, input);
  },

  async remove(id: string) {
    await this.getById(id);
    return nursesRepository.delete(id);
  },
};
