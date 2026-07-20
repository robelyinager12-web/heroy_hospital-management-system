"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { surgeryApi, SurgeryListResponse } from "@/features/surgery/api/surgery.api";
import { ScheduleSurgeryModal } from "@/features/surgery/components/schedule-surgery-modal";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CHECKED_IN: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  IN_PROGRESS: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  NO_SHOW: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function SurgeryPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["surgery", page],
    queryFn: async () => {
      const res = await surgeryApi.list({ page });
      return res.data as SurgeryListResponse;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => surgeryApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["surgery"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => surgeryApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["surgery"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Surgery</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} scheduled procedures</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Schedule Surgery
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading surgeries...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load surgeries. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No surgeries scheduled yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Procedure</th>
                <th className="px-5 py-3 font-medium">Surgeon</th>
                <th className="px-5 py-3 font-medium">When</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {s.patient.firstName} {s.patient.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{s.procedureName}</td>
                  <td className="px-5 py-3 text-slate-400">
                    Dr. {s.doctor.firstName} {s.doctor.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{new Date(s.scheduledAt).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <select
                      value={s.status}
                      onChange={(e) => statusMutation.mutate({ id: s.id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border bg-transparent ${statusColors[s.status] ?? ""}`}
                    >
                      {Object.keys(statusColors).map((st) => (
                        <option key={st} value={st} className="bg-slate-900 text-white">
                          {st.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(s.id)}
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

      <ScheduleSurgeryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
