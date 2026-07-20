"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, ScanLine } from "lucide-react";
import { radiologyApi, RadiologyListResponse, RadiologyOrder } from "@/features/radiology/api/radiology.api";
import { CreateOrderModal } from "@/features/radiology/components/create-order-modal";
import { EnterReportModal } from "@/features/radiology/components/enter-report-modal";

const statusColors: Record<string, string> = {
  ORDERED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SAMPLE_COLLECTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  IN_PROGRESS: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function RadiologyPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportOrder, setReportOrder] = useState<RadiologyOrder | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["radiology", page],
    queryFn: async () => {
      const res = await radiologyApi.list({ page });
      return res.data as RadiologyListResponse;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => radiologyApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["radiology"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Radiology</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} imaging studies</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Order Study
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading studies...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load radiology orders. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No imaging studies ordered yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Study</th>
                <th className="px-5 py-3 font-medium">Findings</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {o.patient.user.firstName} {o.patient.user.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{o.testName}</td>
                  <td className="px-5 py-3 text-slate-400 max-w-xs truncate">{o.resultValue ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[o.status] ?? ""}`}>
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                    {o.status !== "COMPLETED" && o.status !== "CANCELLED" && (
                      <button
                        onClick={() => setReportOrder(o)}
                        title="Enter findings"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <ScanLine size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(o.id)}
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

      <CreateOrderModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EnterReportModal order={reportOrder} onClose={() => setReportOrder(null)} />
    </div>
  );
}
