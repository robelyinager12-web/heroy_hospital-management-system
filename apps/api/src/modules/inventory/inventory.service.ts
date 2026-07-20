import { inventoryRepository } from "./inventory.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyRoles } from "../notifications/notifications.service";
import {
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  AdjustStockInput,
  ListInventoryQuery,
} from "./inventory.validation";

export const inventoryService = {
  async list(query: ListInventoryQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await inventoryRepository.findMany({
      skip,
      take: query.pageSize,
      search: query.search,
      category: query.category,
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
    const item = await inventoryRepository.findById(id);
    if (!item) throw new AppError(404, "Inventory item not found");
    return item;
  },

  create: (input: CreateInventoryItemInput) => inventoryRepository.create(input),

  async update(id: string, input: UpdateInventoryItemInput) {
    await this.getById(id);
    return inventoryRepository.update(id, input);
  },

  async adjustStock(id: string, input: AdjustStockInput) {
    const item = await this.getById(id);

    if (item.quantity + input.delta < 0) {
      throw new AppError(400, "Cannot remove more than the available stock");
    }

    const updated = await inventoryRepository.adjustStock(id, input.delta);

    if (updated.quantity <= updated.reorderLevel && item.quantity > item.reorderLevel) {
      await notifyRoles(["SUPER_ADMIN", "HOSPITAL_ADMIN"], {
        title: "Low inventory alert",
        message: `${updated.name} is running low (${updated.quantity} ${updated.unit} remaining, reorder level ${updated.reorderLevel}).`,
        metadata: { inventoryItemId: updated.id },
      });
    }

    return updated;
  },

  async remove(id: string) {
    await this.getById(id);
    return inventoryRepository.delete(id);
  },
};
