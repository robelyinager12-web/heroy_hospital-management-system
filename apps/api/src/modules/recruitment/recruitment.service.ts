import { recruitmentRepository } from "./recruitment.repository";
import { AppError } from "../../middlewares/error-handler.middleware";
import {
  CreateJobInput,
  UpdateJobInput,
  CreateApplicationInput,
  UpdateApplicationInput,
  ListQuery,
} from "./recruitment.validation";

export const recruitmentService = {
  async listJobs(query: ListQuery) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await recruitmentRepository.findManyJobs({ skip, take: query.pageSize });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getJobById(id: string) {
    const job = await recruitmentRepository.findJobById(id);
    if (!job) throw new AppError(404, "Job posting not found");
    return job;
  },

  createJob: (postedById: string, input: CreateJobInput) => recruitmentRepository.createJob({ ...input, postedById }),

  async updateJob(id: string, input: UpdateJobInput) {
    await this.getJobById(id);
    return recruitmentRepository.updateJob(id, input);
  },

  async removeJob(id: string) {
    await this.getJobById(id);
    return recruitmentRepository.deleteJob(id);
  },

  async listApplications(query: ListQuery & { jobPostingId?: string }) {
    const skip = (query.page - 1) * query.pageSize;
    const { items, total } = await recruitmentRepository.findManyApplications({
      skip,
      take: query.pageSize,
      jobPostingId: query.jobPostingId,
    });

    return {
      items,
      pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
    };
  },

  async getApplicationById(id: string) {
    const application = await recruitmentRepository.findApplicationById(id);
    if (!application) throw new AppError(404, "Application not found");
    return application;
  },

  createApplication: (input: CreateApplicationInput) => recruitmentRepository.createApplication(input),

  async updateApplication(id: string, input: UpdateApplicationInput) {
    await this.getApplicationById(id);
    return recruitmentRepository.updateApplication(id, input);
  },

  async removeApplication(id: string) {
    await this.getApplicationById(id);
    return recruitmentRepository.deleteApplication(id);
  },
};
