"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { appointmentsApi } from "@/features/appointments/api/appointments.api";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";
import { doctorsApi, DoctorListResponse } from "@/features/doctors/api/doctors.api";

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAppointmentModal({ open, onClose }: CreateAppointmentModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    patientUserId: "",
    doctorUserId: "",
    type: "IN_PERSON",
    scheduledAt: "",
    durationMins: "30",
    reason: "",
  });

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "for-appointment-select"],
    queryFn: async () => (await patientsApi.list({ page: 1 })).data as PatientListResponse,
    enabled: open,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors", "for-appointment-select"],
    queryFn: async () => (await doctorsApi.list({ page: 1 })).data as DoctorListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () =>
      appointmentsApi.create({ ...form, durationMins: Number(form.durationMins) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ patientUserId: "", doctorUserId: "", type: "IN_PERSON", scheduledAt: "", durationMins: "30", reason: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Book Appointment</h2>
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
            value={form.doctorUserId}
            onChange={(e) => setForm((f) => ({ ...f, doctorUserId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select doctor...</option>
            {doctorsData?.items.map((d) => (
              <option key={d.id} value={d.userId}>
                Dr. {d.user.firstName} {d.user.lastName} — {d.specialization}
              </option>
            ))}
          </select>

          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className={inputClass}
          >
            <option value="IN_PERSON">In Person</option>
            <option value="VIDEO_CONSULTATION">Video Consultation</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="FOLLOW_UP">Follow Up</option>
          </select>

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

          <input
            placeholder="Reason for visit (optional)"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
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
            {mutation.isPending ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
}
