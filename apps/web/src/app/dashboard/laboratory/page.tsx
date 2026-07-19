"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, FlaskConical } from "lucide-react";
import { laboratoryApi, LabTestListResponse, LabTest } from "@/features/laboratory/api/laboratory.api";
import { CreateLabTestModal } from "@/features/laboratory/components/create-labtest-modal";
import { EnterResultModal } from "@/features/laboratory/components/enter-result-modal";

const statusColors: Record<string, string> = {
  ORDERED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SAMPLE_COLLECTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  IN_PROGRESS: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LaboratoryPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultTest, setResultTest] = useState<LabTest | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["laboratory", page],
    queryFn: async () => {
      const res = await laboratoryApi.list({ page });
      return res.data as LabTestListResponse;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => laboratoryApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["laboratory"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Laboratory</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} total tests</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Order Test
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading lab tests...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load lab tests. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No lab tests ordered yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Test</th>
                <th className="px-5 py-3 font-medium">Result</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((t) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {t.patient.user.firstName} {t.patient.user.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{t.testName}</td>
                  <td className="px-5 py-3 text-slate-400">
                    {t.resultValue ? `${t.resultValue} ${t.resultUnit ?? ""}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[t.status] ?? ""}`}>
                      {t.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                    {t.status !== "COMPLETED" && t.status !== "CANCELLED" && (
                      <button
                        onClick={() => setResultTest(t)}
                        title="Enter result"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <FlaskConical size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(t.id)}
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

      <CreateLabTestModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EnterResultModal labTest={resultTest} onClose={() => setResultTest(null)} />
    </div>
  );
}
