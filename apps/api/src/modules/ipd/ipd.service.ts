import { ipdRepository } from "./ipd.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { CreateWardInput, CreateBedInput, AdmitPatientInput, ListAdmissionsQuery } from "./ipd.validation";

export const ipdService = {
  listWards: () => ipdRepository.listWards(),
  createWard: (input: CreateWardInput) => ipdRepository.createWard(input),

  listBeds: (wardId?: string) => ipdRepository.listBeds(wardId),
  createBed: (input: CreateBedInput) => ipdRepository.createBed(input),

  async list(query: ListAdmissionsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await ipdRepository.findManyAdmissions({
      skip,
      take: query.pageSize,
      activeOnly: query.activeOnly,
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
    const admission = await ipdRepository.findAdmissionById(id);
    if (!admission) throw new AppError(404, "Admission not found");
    return admission;
  },

  async admit(input: AdmitPatientInput) {
    const bed = await ipdRepository.findBedById(input.bedId);
    if (!bed) throw new AppError(404, "Bed not found");
    if (bed.isOccupied) throw new AppError(400, "This bed is already occupied");

    const admission = await ipdRepository.createAdmission(input);
    await ipdRepository.setBedOccupied(input.bedId, true);

    return admission;
  },

  async discharge(id: string) {
    const admission = await this.getById(id);
    const updated = await ipdRepository.dischargeAdmission(id);

    if (admission.bedId) {
      await ipdRepository.setBedOccupied(admission.bedId, false);
    }

    return updated;
  },

  async remove(id: string) {
    const admission = await this.getById(id);
    if (!admission.dischargedAt && admission.bedId) {
      await ipdRepository.setBedOccupied(admission.bedId, false);
    }
    return ipdRepository.deleteAdmission(id);
  },
};
