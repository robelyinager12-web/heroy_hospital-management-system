"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { radiologyApi } from "@/features/radiology/api/radiology.api";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
}

const COMMON_STUDIES = [
  "Chest X-Ray",
  "Abdominal CT",
  "Brain MRI",
  "Spine X-Ray",
  "Ultrasound - Abdomen",
  "Mammography",
];

export function CreateOrderModal({ open, onClose }: CreateOrderModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ patientId: "", testName: "", notes: "" });

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "for-radiology-select"],
    queryFn: async () => (await patientsApi.list({ page: 1 })).data as PatientListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => radiologyApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radiology"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ patientId: "", testName: "", notes: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Order Imaging Study</h2>
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

          <input
            required
            list="common-studies"
            placeholder="Study type (e.g. Chest X-Ray)"
            value={form.testName}
            onChange={(e) => setForm((f) => ({ ...f, testName: e.target.value }))}
            className={inputClass}
          />
          <datalist id="common-studies">
            {COMMON_STUDIES.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          <textarea
            placeholder="Clinical notes / reason for study (optional)"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
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
            {mutation.isPending ? "Ordering..." : "Order Study"}
          </button>
        </form>
      </div>
    </div>
  );
}
