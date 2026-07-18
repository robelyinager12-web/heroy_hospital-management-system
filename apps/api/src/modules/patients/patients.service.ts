import crypto from "crypto";
import { patientsRepository } from "./patients.repository";
import { hashPassword } from "../../utils/password.util";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreatePatientInput, UpdatePatientInput, ListPatientsQuery } from "./patients.validation";

export const patientsService = {
  async list(query: ListPatientsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await patientsRepository.findMany({
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
    const patient = await patientsRepository.findById(id);
    if (!patient) throw new AppError(404, "Patient not found");
    return patient;
  },

  async create(input: CreatePatientInput) {
    // Patients created by staff get a random temporary password; they'll reset it via email later
    const tempPassword = crypto.randomBytes(12).toString("hex");
    const passwordHash = await hashPassword(tempPassword);

    const patient = await patientsRepository.create({
      ...input,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      passwordHash,
    });

    return { patient, tempPassword };
  },

  async update(id: string, input: UpdatePatientInput) {
    await this.getById(id);

    const { firstName, lastName, phone, ...patientFields } = input;

    return patientsRepository.update(id, {
      ...patientFields,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      user:
        firstName || lastName || phone
          ? { update: { firstName, lastName, phone } }
          : undefined,
    });
  },

  async remove(id: string) {
    await this.getById(id);
    return patientsRepository.delete(id);
  },
};