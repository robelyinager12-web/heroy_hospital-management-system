import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const recruitmentRepository = {
  async findManyJobs(params: { skip: number; take: number }) {
    const [items, total] = await Promise.all([
      prisma.jobPosting.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { applications: true } } },
      }),
      prisma.jobPosting.count(),
    ]);
    return { items, total };
  },

  findJobById: (id: string) =>
    prisma.jobPosting.findUnique({ where: { id }, include: { applications: true } }),

  createJob: (data: { title: string; department?: string; description: string; requirements?: string; postedById: string }) =>
    prisma.jobPosting.create({ data }),

  updateJob: (id: string, data: Prisma.JobPostingUpdateInput) => prisma.jobPosting.update({ where: { id }, data }),

  deleteJob: (id: string) => prisma.jobPosting.delete({ where: { id } }),

  async findManyApplications(params: { skip: number; take: number; jobPostingId?: string }) {
    const where: Prisma.JobApplicationWhereInput = params.jobPostingId ? { jobPostingId: params.jobPostingId } : {};

    const [items, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { appliedAt: "desc" },
        include: { jobPosting: { select: { title: true } } },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return { items, total };
  },

  findApplicationById: (id: string) =>
    prisma.jobApplication.findUnique({ where: { id }, include: { jobPosting: { select: { title: true } } } }),

  createApplication: (data: {
    jobPostingId: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    resumeUrl?: string;
    coverLetter?: string;
  }) => prisma.jobApplication.create({ data, include: { jobPosting: { select: { title: true } } } }),

  updateApplication: (id: string, data: Prisma.JobApplicationUpdateInput) =>
    prisma.jobApplication.update({ where: { id }, data, include: { jobPosting: { select: { title: true } } } }),

  deleteApplication: (id: string) => prisma.jobApplication.delete({ where: { id } }),
};
