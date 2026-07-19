"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, LogOut } from "lucide-react";
import { emergencyApi, EmergencyListResponse } from "@/features/emergency/api/emergency.api";
import { CreateEmergencyModal } from "@/features/emergency/components/create-emergency-modal";

export default function EmergencyPage() {
  const [page, setPage] = useState(1);
  const [activeOnly, setActiveOnly] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["emergency", page, activeOnly],
    queryFn: async () => {
      const res = await emergencyApi.list({ page, activeOnly });
      return res.data as EmergencyListResponse;
    },
  });

  const dischargeMutation = useMutation({
    mutationFn: (id: string) => emergencyApi.discharge(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emergency"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => emergencyApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["emergency"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Emergency</h1>
          <p className="text-slate-400 text-sm mt-1">
            {data?.pagination.total ?? 0} {activeOnly ? "active" : "total"} cases
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          New Case
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveOnly(true)}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            activeOnly ? "bg-red-500/10 border-red-500/30 text-red-400" : "border-white/10 text-slate-400"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveOnly(false)}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            !activeOnly ? "bg-white/10 border-white/20 text-white" : "border-white/10 text-slate-400"
          }`}
        >
          All
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading emergency cases...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load emergency cases. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            No {activeOnly ? "active" : ""} emergency cases right now.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Admitted</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {c.patient.user.firstName} {c.patient.user.lastName}
                    <span className="text-slate-500 ml-2 text-xs">{c.patient.patientCode}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{c.reason}</td>
                  <td className="px-5 py-3 text-slate-400">{new Date(c.admittedAt).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    {c.dischargedAt ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20">
                        Discharged
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                    {!c.dischargedAt && (
                      <button
                        onClick={() => dischargeMutation.mutate(c.id)}
                        title="Discharge patient"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(c.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateEmergencyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
