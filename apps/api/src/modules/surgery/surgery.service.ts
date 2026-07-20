import { surgeryRepository, SURGERY_TAG } from "./surgery.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyRoles } from "../notifications/notifications.service";
import { CreateSurgeryInput, UpdateSurgeryInput, ListSurgeriesQuery } from "./surgery.validation";

function stripTag(reason: string) {
  return reason.replace(`${SURGERY_TAG} `, "");
}

function formatItem(item: any) {
  return { ...item, procedureName: stripTag(item.reason ?? "") };
}

export const surgeryService = {
  async list(query: ListSurgeriesQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await surgeryRepository.findMany({
      skip,
      take: query.pageSize,
      status: query.status,
    });

    return {
      items: items.map(formatItem),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  },

  async getById(id: string) {
    const surgery = await surgeryRepository.findById(id);
    if (!surgery) throw new AppError(404, "Surgery not found");
    return formatItem(surgery);
  },

  async create(input: CreateSurgeryInput) {
    const surgery = await surgeryRepository.create({
      patientId: input.patientUserId,
      doctorId: input.surgeonUserId,
      procedureName: input.procedureName,
      scheduledAt: new Date(input.scheduledAt),
      durationMins: input.durationMins,
      notes: input.notes,
    });

    const when = new Date(surgery.scheduledAt).toLocaleString();

    await notifyRoles(["SUPER_ADMIN", "HOSPITAL_ADMIN"], {
      title: "Surgery scheduled",
      message: `${input.procedureName} scheduled for ${surgery.patient.firstName} ${surgery.patient.lastName} with Dr. ${surgery.doctor.firstName} ${surgery.doctor.lastName} on ${when}.`,
      metadata: { surgeryId: surgery.id },
    });

    return formatItem(surgery);
  },

  async update(id: string, input: UpdateSurgeryInput) {
    await this.getById(id);
    const surgery = await surgeryRepository.update(id, {
      ...input,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
    });
    return formatItem(surgery);
  },

  async remove(id: string) {
    await this.getById(id);
    return surgeryRepository.delete(id);
  },
};
