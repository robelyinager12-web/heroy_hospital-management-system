"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { surgeryApi } from "@/features/surgery/api/surgery.api";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";
import { doctorsApi, DoctorListResponse } from "@/features/doctors/api/doctors.api";

interface ScheduleSurgeryModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScheduleSurgeryModal({ open, onClose }: ScheduleSurgeryModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    patientUserId: "",
    surgeonUserId: "",
    procedureName: "",
    scheduledAt: "",
    durationMins: "90",
    notes: "",
  });

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "for-surgery-select"],
    queryFn: async () => (await patientsApi.list({ page: 1 })).data as PatientListResponse,
    enabled: open,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors", "for-surgery-select"],
    queryFn: async () => (await doctorsApi.list({ page: 1 })).data as DoctorListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => surgeryApi.create({ ...form, durationMins: Number(form.durationMins) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surgery"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ patientUserId: "", surgeonUserId: "", procedureName: "", scheduledAt: "", durationMins: "90", notes: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Schedule Surgery</h2>
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
            value={form.patientUserId}
            onChange={(e) => setForm((f) => ({ ...f, patientUserId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select patient...</option>
            {patientsData?.items.map((p) => (
              <option key={p.id} value={p.userId}>
                {p.user.firstName} {p.user.lastName} ({p.patientCode})
              </option>
            ))}
          </select>

          <select
            required
            value={form.surgeonUserId}
            onChange={(e) => setForm((f) => ({ ...f, surgeonUserId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select surgeon...</option>
            {doctorsData?.items.map((d) => (
              <option key={d.id} value={d.userId}>
                Dr. {d.user.firstName} {d.user.lastName} — {d.specialization}
              </option>
            ))}
          </select>

          <input
            required
            placeholder="Procedure name (e.g. Appendectomy)"
            value={form.procedureName}
            onChange={(e) => setForm((f) => ({ ...f, procedureName: e.target.value }))}
            className={inputClass}
          />

          <input
            required
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
            className={inputClass}
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={form.durationMins}
            onChange={(e) => setForm((f) => ({ ...f, durationMins: e.target.value }))}
            className={inputClass}
          />

          <textarea
            placeholder="Pre-op notes (optional)"
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
            {mutation.isPending ? "Scheduling..." : "Schedule Surgery"}
          </button>
        </form>
      </div>
    </div>
  );
}
