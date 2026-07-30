import { opdRepository, OPD_TAG } from "./opd.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyUser } from "../notifications/notifications.service";
import { CreateOpdVisitInput, UpdateOpdVisitInput, ListQuery } from "./opd.validation";

function stripTag(reason: string) {
  return reason.replace(`${OPD_TAG} `, "");
}

function formatItem(item: any) {
  return { ...item, visitReason: stripTag(item.reason ?? "") };
}

export const opdService = {
  async list(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await opdRepository.findMany({ skip, take: query.pageSize, status: query.status });

    return {
      items: items.map(formatItem),
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getById(id: string) {
    const visit = await opdRepository.findById(id);
    if (!visit) throw new AppError(404, "OPD visit not found");
    return formatItem(visit);
  },

  async create(input: CreateOpdVisitInput) {
    const visit = await opdRepository.create({
      patientId: input.patientUserId,
      doctorId: input.doctorUserId,
      reason: input.reason,
      notes: input.notes,
    });

    await notifyUser({
      userId: visit.doctorId,
      title: "New OPD patient checked in",
      message: `${visit.patient.firstName} ${visit.patient.lastName} is waiting — ${input.reason}.`,
      metadata: { visitId: visit.id },
    });

    return formatItem(visit);
  },

  async update(id: string, input: UpdateOpdVisitInput) {
    await this.getById(id);
    const visit = await opdRepository.update(id, input);
    return formatItem(visit);
  },

  async remove(id: string) {
    await this.getById(id);
    return opdRepository.delete(id);
  },
};
