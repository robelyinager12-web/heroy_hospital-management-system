"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Plus } from "lucide-react";
import { ambulanceApi, Ambulance } from "@/features/ambulance/api/ambulance.api";

interface ManageVehiclesModalProps {
  open: boolean;
  onClose: () => void;
}

export function ManageVehiclesModal({ open, onClose }: ManageVehiclesModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ vehicleNumber: "", driverName: "", driverPhone: "" });

  const { data: vehicles } = useQuery({
    queryKey: ["ambulance", "vehicles"],
    queryFn: async () => (await ambulanceApi.listVehicles()).data.ambulances as Ambulance[],
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => ambulanceApi.createVehicle(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ambulance"] });
      setForm({ vehicleNumber: "", driverName: "", driverPhone: "" });
    },
  });

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Manage Ambulance Fleet</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-3 mb-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Vehicle number"
              value={form.vehicleNumber}
              onChange={(e) => setForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
              className={inputClass}
            />
            <input
              required
              placeholder="Driver name"
              value={form.driverName}
              onChange={(e) => setForm((f) => ({ ...f, driverName: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Driver phone (optional)"
              value={form.driverPhone}
              onChange={(e) => setForm((f) => ({ ...f, driverPhone: e.target.value }))}
              className={`${inputClass} flex-1`}
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center gap-1 disabled:opacity-50"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </form>

        <div className="border-t border-white/10 pt-4 space-y-2">
          <p className="text-xs text-slate-400">Fleet</p>
          {!vehicles || vehicles.length === 0 ? (
            <p className="text-sm text-slate-500">No vehicles yet — add one above.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-sm">
                <div>
                  <span className="text-white">{v.vehicleNumber}</span>
                  <span className="text-slate-400 ml-2">{v.driverName}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    v.status === "AVAILABLE"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : v.status === "ON_CALL"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-slate-500/10 text-slate-400"
                  }`}
                >
                  {v.status.replace(/_/g, " ")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
