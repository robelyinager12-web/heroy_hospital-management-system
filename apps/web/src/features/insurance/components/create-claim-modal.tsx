"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { insuranceApi, PolicyListResponse } from "@/features/insurance/api/insurance.api";

interface CreateClaimModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateClaimModal({ open, onClose }: CreateClaimModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ policyId: "", amountClaimed: "", notes: "" });

  const { data: policiesData } = useQuery({
    queryKey: ["insurance", "policies", "for-claim-select"],
    queryFn: async () => (await insuranceApi.listPolicies(1)).data as PolicyListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => insuranceApi.createClaim({ ...form, amountClaimed: Number(form.amountClaimed) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ policyId: "", amountClaimed: "", notes: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Submit Claim</h2>
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
            value={form.policyId}
            onChange={(e) => setForm((f) => ({ ...f, policyId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select policy...</option>
            {policiesData?.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.patient.user.firstName} {p.patient.user.lastName} — {p.provider} ({p.policyNumber})
              </option>
            ))}
          </select>

          <input
            required
            type="number"
            step="0.01"
            placeholder="Amount claimed"
            value={form.amountClaimed}
            onChange={(e) => setForm((f) => ({ ...f, amountClaimed: e.target.value }))}
            className={inputClass}
          />

          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
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
            {mutation.isPending ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
    </div>
  );
}
