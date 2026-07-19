import { appointmentsRepository } from "./appointments.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateAppointmentInput, UpdateAppointmentInput, ListAppointmentsQuery } from "./appointments.validation";

export const appointmentsService = {
  async list(query: ListAppointmentsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await appointmentsRepository.findMany({
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
    const appointment = await appointmentsRepository.findById(id);
    if (!appointment) throw new AppError(404, "Appointment not found");
    return appointment;
  },

  async create(input: CreateAppointmentInput) {
    return appointmentsRepository.create({
      patientId: input.patientUserId,
      doctorId: input.doctorUserId,
      type: input.type,
      scheduledAt: new Date(input.scheduledAt),
      durationMins: input.durationMins,
      reason: input.reason,
      notes: input.notes,
    });
  },

  async update(id: string, input: UpdateAppointmentInput) {
    await this.getById(id);
    return appointmentsRepository.update(id, {
      ...input,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    });
  },

  async remove(id: string) {
    await this.getById(id);
    return appointmentsRepository.delete(id);
  },
};
