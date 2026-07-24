"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { recruitmentApi, JobListResponse, ApplicationListResponse } from "@/features/recruitment/api/recruitment.api";
import { CreateJobModal } from "@/features/recruitment/components/create-job-modal";
import { CreateApplicationModal } from "@/features/recruitment/components/create-application-modal";

const appStatusColors: Record<string, string> = {
  SUBMITTED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SHORTLISTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  INTERVIEWING: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  OFFERED: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  HIRED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function RecruitmentPage() {
  const [tab, setTab] = useState<"jobs" | "applications">("jobs");
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["recruitment", "jobs"],
    queryFn: async () => (await recruitmentApi.listJobs(1)).data as JobListResponse,
    enabled: tab === "jobs",
  });

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ["recruitment", "applications"],
    queryFn: async () => (await recruitmentApi.listApplications({ page: 1 })).data as ApplicationListResponse,
    enabled: tab === "applications",
  });

  const jobStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => recruitmentApi.updateJob(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recruitment"] }),
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => recruitmentApi.removeJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recruitment"] }),
  });

  const appStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => recruitmentApi.updateApplication(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recruitment"] }),
  });

  const deleteAppMutation = useMutation({
    mutationFn: (id: string) => recruitmentApi.removeApplication(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recruitment"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Recruitment</h1>
          <p className="text-slate-400 text-sm mt-1">Job postings and applications</p>
        </div>
        <button
          onClick={() => (tab === "jobs" ? setJobModalOpen(true) : setAppModalOpen(true))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          {tab === "jobs" ? "Post Job" : "Log Application"}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("jobs")}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            tab === "jobs" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-slate-400"
          }`}
        >
          Jobs
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            tab === "applications" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-slate-400"
          }`}
        >
          Applications
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {tab === "jobs" ? (
          jobsLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading jobs...
            </div>
          ) : jobsData?.items.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No job postings yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Applications</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {jobsData?.items.map((j) => (
                  <tr key={j.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white">{j.title}</td>
                    <td className="px-5 py-3 text-slate-400">{j.department ?? "—"}</td>
                    <td className="px-5 py-3 text-slate-400">{j._count?.applications ?? 0}</td>
                    <td className="px-5 py-3">
                      <select
                        value={j.status}
                        onChange={(e) => jobStatusMutation.mutate({ id: j.id, status: e.target.value })}
                        className={`px-2 py-1 rounded-full text-xs border bg-transparent ${
                          j.status === "OPEN"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        <option value="OPEN" className="bg-slate-900 text-white">Open</option>
                        <option value="CLOSED" className="bg-slate-900 text-white">Closed</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => deleteJobMutation.mutate(j.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : appsLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading applications...
          </div>
        ) : appsData?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No applications logged yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Applicant</th>
                <th className="px-5 py-3 font-medium">Job</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {appsData?.items.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">{a.applicantName}</td>
                  <td className="px-5 py-3 text-slate-400">{a.jobPosting.title}</td>
                  <td className="px-5 py-3 text-slate-400">{a.applicantEmail}</td>
                  <td className="px-5 py-3">
                    <select
                      value={a.status}
                      onChange={(e) => appStatusMutation.mutate({ id: a.id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border bg-transparent ${appStatusColors[a.status] ?? ""}`}
                    >
                      {Object.keys(appStatusColors).map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteAppMutation.mutate(a.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateJobModal open={jobModalOpen} onClose={() => setJobModalOpen(false)} />
      <CreateApplicationModal open={appModalOpen} onClose={() => setAppModalOpen(false)} />
    </div>
  );
}
