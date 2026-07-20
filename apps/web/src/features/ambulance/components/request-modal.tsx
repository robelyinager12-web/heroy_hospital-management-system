"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { ambulanceApi } from "@/features/ambulance/api/ambulance.api";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";

interface RequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function RequestModal({ open, onClose }: RequestModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ patientId: "", pickupLocation: "", destination: "", notes: "" });

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "for-ambulance-select"],
    queryFn: async () => (await patientsApi.list({ page: 1 })).data as PatientListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => ambulanceApi.createRequest({ ...form, patientId: form.patientId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulance"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ patientId: "", pickupLocation: "", destination: "", notes: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Request Ambulance</h2>
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
            <option value="">No patient linked (external call)</option>
            {patientsData?.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user.firstName} {p.user.lastName} ({p.patientCode})
              </option>
            ))}
          </select>

          <input
            required
            placeholder="Pickup location"
            value={form.pickupLocation}
            onChange={(e) => setForm((f) => ({ ...f, pickupLocation: e.target.value }))}
            className={inputClass}
          />
          <input
            required
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
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
            className="w-full rounded-lg bg-gradient-to-r from-red-500 to-orange-600 py-2.5 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Requesting..." : "Request Ambulance"}
          </button>
        </form>
      </div>
    </div>
  );
}
