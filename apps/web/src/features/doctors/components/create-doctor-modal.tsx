"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { doctorsApi } from "@/features/doctors/api/doctors.api";

interface CreateDoctorModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateDoctorModal({ open, onClose }: CreateDoctorModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    consultationFee: "",
  });
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => doctorsApi.create(form),
    onSuccess: (res: any) => {
      setTempPassword(res.data.tempPassword);
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      licenseNumber: "",
      consultationFee: "",
    });
    setTempPassword(null);
    mutation.reset();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Add Doctor</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {tempPassword ? (
          <div className="space-y-3">
            <p className="text-sm text-emerald-400">Doctor added successfully.</p>
            <p className="text-sm text-slate-300">
              Temporary password: <span className="font-mono text-white">{tempPassword}</span>
            </p>
            <p className="text-xs text-slate-500">Share this with the doctor so they can log in and set their own password.</p>
            <button
              onClick={handleClose}
              className="w-full mt-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-white font-medium"
            >
              Done
            </button>
          </div>
        ) : (
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
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
              <input
                required
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
            <input
              required
              placeholder="Specialization (e.g. Cardiology)"
              value={form.specialization}
              onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
            <input
              required
              placeholder="License number"
              value={form.licenseNumber}
              onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
              <input
                placeholder="Fee (optional)"
                type="number"
                value={form.consultationFee}
                onChange={(e) => setForm((f) => ({ ...f, consultationFee: e.target.value }))}
                className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
            </div>

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
              {mutation.isPending ? "Creating..." : "Add Doctor"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
