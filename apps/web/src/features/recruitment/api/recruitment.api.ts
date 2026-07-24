import { apiClient } from "@/lib/api-client";

export interface JobPosting {
  id: string;
  title: string;
  department?: string;
  description: string;
  requirements?: string;
  status: string;
  createdAt: string;
  _count?: { applications: number };
}

export interface JobApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  status: string;
  appliedAt: string;
  jobPosting: { title: string };
}

export interface JobListResponse {
  items: JobPosting[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface ApplicationListResponse {
  items: JobApplication[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export const recruitmentApi = {
  listJobs: (page = 1) => apiClient.get(`/recruitment/jobs?page=${page}`),
  createJob: (data: Record<string, unknown>) => apiClient.post("/recruitment/jobs", data),
  updateJob: (id: string, data: Record<string, unknown>) => apiClient.put(`/recruitment/jobs/${id}`, data),
  removeJob: (id: string) => apiClient.delete(`/recruitment/jobs/${id}`),

  listApplications: (params: { page?: number; jobPostingId?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.jobPostingId) query.set("jobPostingId", params.jobPostingId);
    return apiClient.get(`/recruitment/applications?${query.toString()}`);
  },
  createApplication: (data: Record<string, unknown>) => apiClient.post("/recruitment/applications", data),
  updateApplication: (id: string, status: string) => apiClient.put(`/recruitment/applications/${id}`, { status }),
  removeApplication: (id: string) => apiClient.delete(`/recruitment/applications/${id}`),
};
