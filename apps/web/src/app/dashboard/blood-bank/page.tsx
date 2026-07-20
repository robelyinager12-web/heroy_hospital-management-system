"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Droplet, Minus, PlusCircle } from "lucide-react";
import { bloodBankApi, RequestListResponse, BloodStock } from "@/features/blood-bank/api/blood-bank.api";
import { RequestModal } from "@/features/blood-bank/components/request-modal";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  FULFILLED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function BloodBankPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: stockData } = useQuery({
    queryKey: ["blood-bank", "stock"],
    queryFn: async () => (await bloodBankApi.listStock()).data.stock as BloodStock[],
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blood-bank", "requests", page],
    queryFn: async () => {
      const res = await bloodBankApi.list({ page });
      return res.data as RequestListResponse;
    },
  });

  const adjustMutation = useMutation({
    mutationFn: ({ bloodGroup, delta }: { bloodGroup: string; delta: number }) =>
      bloodBankApi.adjustStock(bloodGroup, delta),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blood-bank"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bloodBankApi.updateRequest(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blood-bank"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bloodBankApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blood-bank"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blood Bank</h1>
          <p className="text-slate-400 text-sm mt-1">Stock levels and requests</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Request Blood
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stockData?.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Droplet size={14} className="text-red-400" />
                {s.bloodGroup.replace("_", " ")}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{s.units} <span className="text-xs text-slate-400 font-normal">units</span></p>
            <div className="flex gap-1.5">
              <button
                onClick={() => adjustMutation.mutate({ bloodGroup: s.bloodGroup, delta: -1 })}
                className="flex-1 py-1 rounded-lg bg-white/5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center justify-center"
              >
                <Minus size={13} />
              </button>
              <button
                onClick={() => adjustMutation.mutate({ bloodGroup: s.bloodGroup, delta: 5 })}
                className="flex-1 py-1 rounded-lg bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center justify-center"
              >
                <PlusCircle size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading requests...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">Couldn't load requests.</div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No blood requests yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Blood Group</th>
                <th className="px-5 py-3 font-medium">Units</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {r.patient ? `${r.patient.user.firstName} ${r.patient.user.lastName}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{r.bloodGroup.replace("_", " ")}</td>
                  <td className="px-5 py-3 text-slate-400">{r.unitsRequested}</td>
                  <td className="px-5 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => statusMutation.mutate({ id: r.id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border bg-transparent ${statusColors[r.status] ?? ""}`}
                    >
                      {Object.keys(statusColors).map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(r.id)}
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

      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
