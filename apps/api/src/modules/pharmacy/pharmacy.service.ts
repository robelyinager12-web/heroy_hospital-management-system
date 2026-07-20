import { pharmacyRepository } from "./pharmacy.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyRoles } from "../notifications/notifications.service";
import { CreateMedicineInput, UpdateMedicineInput, AdjustStockInput, ListMedicinesQuery } from "./pharmacy.validation";

export const pharmacyService = {
  async list(query: ListMedicinesQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await pharmacyRepository.findMany({
      skip,
      take: query.pageSize,
      search: query.search,
      lowStockOnly: query.lowStockOnly,
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
    const medicine = await pharmacyRepository.findById(id);
    if (!medicine) throw new AppError(404, "Medicine not found");
    return medicine;
  },

  create: (input: CreateMedicineInput) =>
    pharmacyRepository.create({
      ...input,
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
    }),

  async update(id: string, input: UpdateMedicineInput) {
    await this.getById(id);
    return pharmacyRepository.update(id, {
      ...input,
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
    });
  },

  async adjustStock(id: string, input: AdjustStockInput) {
    const medicine = await this.getById(id);

    if (medicine.quantity + input.delta < 0) {
      throw new AppError(400, "Cannot dispense more than the available stock");
    }

    const updated = await pharmacyRepository.adjustStock(id, input.delta);

    if (updated.quantity <= updated.reorderLevel && medicine.quantity > medicine.reorderLevel) {
      // Just crossed into low-stock territory — notify pharmacy staff
      await notifyRoles(["SUPER_ADMIN", "HOSPITAL_ADMIN", "PHARMACIST"], {
        title: "Low stock alert",
        message: `${updated.name} is running low (${updated.quantity} ${updated.unit} remaining, reorder level ${updated.reorderLevel}).`,
        metadata: { medicineId: updated.id },
      });
    }

    return updated;
  },

  async remove(id: string) {
    await this.getById(id);
    return pharmacyRepository.delete(id);
  },
};
