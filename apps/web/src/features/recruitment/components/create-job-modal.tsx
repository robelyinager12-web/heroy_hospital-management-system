"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { recruitmentApi } from "@/features/recruitment/api/recruitment.api";

interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateJobModal({ open, onClose }: CreateJobModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", department: "", description: "", requirements: "" });

  const mutation = useMutation({
    mutationFn: () => recruitmentApi.createJob(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ title: "", department: "", description: "", requirements: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Post a Job</h2>
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
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Job title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputClass}
            />
            <input
              placeholder="Department (optional)"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              className={inputClass}
            />
          </div>

          <textarea
            required
            placeholder="Job description..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className={inputClass}
          />

          <textarea
            placeholder="Requirements (optional)"
            value={form.requirements}
            onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
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
            {mutation.isPending ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
