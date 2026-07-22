"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { insuranceApi } from "@/features/insurance/api/insurance.api";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";

interface CreatePolicyModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePolicyModal({ open, onClose }: CreatePolicyModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ patientId: "", provider: "", policyNumber: "", startDate: "", coverageDetails: "" });

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "for-insurance-select"],
    queryFn: async () => (await patientsApi.list({ page: 1 })).data as PatientListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => insuranceApi.createPolicy(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ patientId: "", provider: "", policyNumber: "", startDate: "", coverageDetails: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Add Insurance Policy</h2>
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
            value={form.patientId}
            onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select patient...</option>
            {patientsData?.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user.firstName} {p.user.lastName} ({p.patientCode})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Provider (e.g. NIB Insurance)"
              value={form.provider}
              onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
              className={inputClass}
            />
            <input
              required
              placeholder="Policy number"
              value={form.policyNumber}
              onChange={(e) => setForm((f) => ({ ...f, policyNumber: e.target.value }))}
              className={inputClass}
            />
          </div>

          <input
            required
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            className={inputClass}
          />

          <textarea
            placeholder="Coverage details (optional)"
            value={form.coverageDetails}
            onChange={(e) => setForm((f) => ({ ...f, coverageDetails: e.target.value }))}
            rows={2}
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
            {mutation.isPending ? "Adding..." : "Add Policy"}
          </button>
        </form>
      </div>
    </div>
  );
}
