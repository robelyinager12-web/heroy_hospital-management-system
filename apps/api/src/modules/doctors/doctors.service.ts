import crypto from "crypto";
import { doctorsRepository } from "./doctors.repository";
import { hashPassword } from "../../utils/password.util";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateDoctorInput, UpdateDoctorInput, ListDoctorsQuery } from "./doctors.validation";

export const doctorsService = {
  async list(query: ListDoctorsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await doctorsRepository.findMany({
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
    const doctor = await doctorsRepository.findById(id);
    if (!doctor) throw new AppError(404, "Doctor not found");
    return doctor;
  },

  async create(input: CreateDoctorInput) {
    const tempPassword = crypto.randomBytes(12).toString("hex");
    const passwordHash = await hashPassword(tempPassword);

    const doctor = await doctorsRepository.create({ ...input, passwordHash });

    return { doctor, tempPassword };
  },

  async update(id: string, input: UpdateDoctorInput) {
    await this.getById(id);

    const { firstName, lastName, phone, ...doctorFields } = input;

    return doctorsRepository.update(id, {
      ...doctorFields,
      user:
        firstName || lastName || phone
          ? { update: { firstName, lastName, phone } }
          : undefined,
    });
  },

  async remove(id: string) {
    await this.getById(id);
    return doctorsRepository.delete(id);
  },
};
