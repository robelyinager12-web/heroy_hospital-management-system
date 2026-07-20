import { appointmentsRepository } from "./appointments.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyUser, notifyRoles } from "../notifications/notifications.service";
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
    const appointment = await appointmentsRepository.create({
      patientId: input.patientUserId,
      doctorId: input.doctorUserId,
      type: input.type,
      scheduledAt: new Date(input.scheduledAt),
      durationMins: input.durationMins,
      reason: input.reason,
      notes: input.notes,
    });

    const when = new Date(appointment.scheduledAt).toLocaleString();
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    const doctorName = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`;

    await notifyUser({
      userId: appointment.doctorId,
      title: "New appointment booked",
      message: `${patientName} booked an appointment with you on ${when}.`,
      metadata: { appointmentId: appointment.id },
    });

    await notifyRoles(["SUPER_ADMIN", "HOSPITAL_ADMIN"], {
      title: "New appointment booked",
      message: `${patientName} booked with Dr. ${doctorName} on ${when}.`,
      metadata: { appointmentId: appointment.id },
    });

    return appointment;
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
