"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { radiologyApi, RadiologyOrder } from "@/features/radiology/api/radiology.api";

interface EnterReportModalProps {
  order: RadiologyOrder | null;
  onClose: () => void;
}

export function EnterReportModal({ order, onClose }: EnterReportModalProps) {
  const queryClient = useQueryClient();
  const [findings, setFindings] = useState("");

  useEffect(() => {
    if (order) setFindings(order.resultValue ?? "");
  }, [order]);

  const mutation = useMutation({
    mutationFn: () => radiologyApi.update(order!.id, { status: "COMPLETED", resultValue: findings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radiology"] });
      onClose();
    },
  });

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Enter Findings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-3">{order.testName}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-3"
        >
          <textarea
            required
            placeholder="Radiologist findings / impression..."
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            rows={6}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />

          {mutation.isError && (
            <p className="text-sm text-red-400">
              {(mutation.error as any)?.message ?? "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Mark Completed"}
          </button>
        </form>
      </div>
    </div>
  );
}
