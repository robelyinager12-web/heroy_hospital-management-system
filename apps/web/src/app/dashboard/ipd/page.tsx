"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, LogOut, Bed as BedIcon } from "lucide-react";
import { ipdApi, AdmissionListResponse } from "@/features/ipd/api/ipd.api";
import { AdmitPatientModal } from "@/features/ipd/components/admit-patient-modal";
import { ManageWardsModal } from "@/features/ipd/components/manage-wards-modal";

export default function IpdPage() {
  const [page, setPage] = useState(1);
  const [activeOnly, setActiveOnly] = useState(true);
  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [wardsModalOpen, setWardsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ipd", page, activeOnly],
    queryFn: async () => {
      const res = await ipdApi.list({ page, activeOnly });
      return res.data as AdmissionListResponse;
    },
  });

  const dischargeMutation = useMutation({
    mutationFn: (id: string) => ipdApi.discharge(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ipd"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ipdApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ipd"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">IPD — Inpatient Ward</h1>
          <p className="text-slate-400 text-sm mt-1">
            {data?.pagination.total ?? 0} {activeOnly ? "active" : "total"} admissions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWardsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition"
          >
            <BedIcon size={16} />
            Manage Wards
          </button>
          <button
            onClick={() => setAdmitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
          >
            <Plus size={16} />
            Admit Patient
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveOnly(true)}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            activeOnly ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-slate-400"
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
            Loading admissions...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load admissions. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            No {activeOnly ? "active" : ""} admissions. Make sure you've added wards and beds first.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Bed</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">Admitted</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {a.patient.user.firstName} {a.patient.user.lastName}
                    <span className="text-slate-500 ml-2 text-xs">{a.patient.patientCode}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {a.bed ? `${a.bed.ward.name} — Bed ${a.bed.bedNumber}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{a.reason}</td>
                  <td className="px-5 py-3 text-slate-400">{new Date(a.admittedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    {a.dischargedAt ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20">
                        Discharged
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Admitted
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                    {!a.dischargedAt && (
                      <button
                        onClick={() => dischargeMutation.mutate(a.id)}
                        title="Discharge patient"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(a.id)}
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

      <AdmitPatientModal open={admitModalOpen} onClose={() => setAdmitModalOpen(false)} />
      <ManageWardsModal open={wardsModalOpen} onClose={() => setWardsModalOpen(false)} />
    </div>
  );
}
