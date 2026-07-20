"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { bloodBankApi } from "@/features/blood-bank/api/blood-bank.api";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";

interface RequestModalProps {
  open: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];

export function RequestModal({ open, onClose }: RequestModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ patientId: "", bloodGroup: "O_POSITIVE", unitsRequested: "1", notes: "" });

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "for-blood-select"],
    queryFn: async () => (await patientsApi.list({ page: 1 })).data as PatientListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () =>
      bloodBankApi.createRequest({
        ...form,
        patientId: form.patientId || undefined,
        unitsRequested: Number(form.unitsRequested),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood-bank"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ patientId: "", bloodGroup: "O_POSITIVE", unitsRequested: "1", notes: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Request Blood</h2>
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
            value={form.patientId}
            onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
            className={inputClass}
          >
            <option value="">No patient linked</option>
            {patientsData?.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user.firstName} {p.user.lastName} ({p.patientCode})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.bloodGroup}
              onChange={(e) => setForm((f) => ({ ...f, bloodGroup: e.target.value }))}
              className={inputClass}
            >
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g.replace("_", " ")}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="1"
              placeholder="Units"
              value={form.unitsRequested}
              onChange={(e) => setForm((f) => ({ ...f, unitsRequested: e.target.value }))}
              className={inputClass}
            />
          </div>

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
            className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-600 py-2.5 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Requesting..." : "Request Blood"}
          </button>
        </form>
      </div>
    </div>
  );
}
