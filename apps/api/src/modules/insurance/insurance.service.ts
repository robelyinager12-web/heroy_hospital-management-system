import { insuranceRepository } from "./insurance.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import { notifyRoles } from "../notifications/notifications.service";
import {
  CreatePolicyInput,
  UpdatePolicyInput,
  CreateClaimInput,
  UpdateClaimInput,
  ListPoliciesQuery,
  ListClaimsQuery,
} from "./insurance.validation";

export const insuranceService = {
  async listPolicies(query: ListPoliciesQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await insuranceRepository.findManyPolicies({ skip, take: query.pageSize });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getPolicyById(id: string) {
    const policy = await insuranceRepository.findPolicyById(id);
    if (!policy) throw new AppError(404, "Insurance policy not found");
    return policy;
  },

  createPolicy: (input: CreatePolicyInput) =>
    insuranceRepository.createPolicy({
      ...input,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    }),

  async updatePolicy(id: string, input: UpdatePolicyInput) {
    await this.getPolicyById(id);
    return insuranceRepository.updatePolicy(id, {
      ...input,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    });
  },

  async removePolicy(id: string) {
    await this.getPolicyById(id);
    return insuranceRepository.deletePolicy(id);
  },

  async listClaims(query: ListClaimsQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await insuranceRepository.findManyClaims({
      skip,
      take: query.pageSize,
      status: query.status,
    });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getClaimById(id: string) {
    const claim = await insuranceRepository.findClaimById(id);
    if (!claim) throw new AppError(404, "Insurance claim not found");
    return claim;
  },

  async createClaim(input: CreateClaimInput) {
    const claim = await insuranceRepository.createClaim(input);

    await notifyRoles(["SUPER_ADMIN", "HOSPITAL_ADMIN", "INSURANCE_OFFICER", "ACCOUNTANT"], {
      title: "New insurance claim",
      message: `Claim ${claim.claimNumber} submitted for $${input.amountClaimed}.`,
      metadata: { claimId: claim.id },
    });

    return claim;
  },

  async updateClaim(id: string, input: UpdateClaimInput) {
    await this.getClaimById(id);
    const data: any = { ...input };
    if (input.status === "APPROVED" || input.status === "REJECTED" || input.status === "PAID") {
      data.resolvedAt = new Date();
    }
    return insuranceRepository.updateClaim(id, data);
  },

  async removeClaim(id: string) {
    await this.getClaimById(id);
    return insuranceRepository.deleteClaim(id);
  },
};
