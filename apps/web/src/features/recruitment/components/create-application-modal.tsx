"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { recruitmentApi, JobListResponse } from "@/features/recruitment/api/recruitment.api";

interface CreateApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateApplicationModal({ open, onClose }: CreateApplicationModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    jobPostingId: "",
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
  });

  const { data: jobsData } = useQuery({
    queryKey: ["recruitment", "jobs", "for-application-select"],
    queryFn: async () => (await recruitmentApi.listJobs(1)).data as JobListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => recruitmentApi.createApplication(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ jobPostingId: "", applicantName: "", applicantEmail: "", applicantPhone: "", coverLetter: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Log an Application</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-3"
        >
          <select
            required
            value={form.jobPostingId}
            onChange={(e) => setForm((f) => ({ ...f, jobPostingId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select job posting...</option>
            {jobsData?.items.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          <input
            required
            placeholder="Applicant name"
            value={form.applicantName}
            onChange={(e) => setForm((f) => ({ ...f, applicantName: e.target.value }))}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="email"
              placeholder="Email"
              value={form.applicantEmail}
              onChange={(e) => setForm((f) => ({ ...f, applicantEmail: e.target.value }))}
              className={inputClass}
            />
            <input
              placeholder="Phone (optional)"
              value={form.applicantPhone}
              onChange={(e) => setForm((f) => ({ ...f, applicantPhone: e.target.value }))}
              className={inputClass}
            />
          </div>

          <textarea
            placeholder="Cover letter (optional)"
            value={form.coverLetter}
            onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
            rows={3}
            className={inputClass}
          />

          {mutation.isError && (
            <p className="text-sm text-red-400">
              {(mutation.error as any)?.message ?? "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Log Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
