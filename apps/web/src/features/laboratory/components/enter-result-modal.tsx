"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { laboratoryApi, LabTest } from "@/features/laboratory/api/laboratory.api";

interface EnterResultModalProps {
  labTest: LabTest | null;
  onClose: () => void;
}

export function EnterResultModal({ labTest, onClose }: EnterResultModalProps) {
  const queryClient = useQueryClient();
  const [resultValue, setResultValue] = useState("");
  const [resultUnit, setResultUnit] = useState("");
  const [referenceRange, setReferenceRange] = useState("");

  useEffect(() => {
    if (labTest) {
      setResultValue(labTest.resultValue ?? "");
      setResultUnit(labTest.resultUnit ?? "");
      setReferenceRange(labTest.referenceRange ?? "");
    }
  }, [labTest]);

  const mutation = useMutation({
    mutationFn: () =>
      laboratoryApi.update(labTest!.id, {
        status: "COMPLETED",
        resultValue,
        resultUnit,
        referenceRange,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laboratory"] });
      onClose();
    },
  });

  if (!labTest) return null;

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Enter Result</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-3">{labTest.testName}</p>

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
              placeholder="Result value"
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Unit"
              value={resultUnit}
              onChange={(e) => setResultUnit(e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            placeholder="Reference range (e.g. 4.0 - 11.0)"
            value={referenceRange}
            onChange={(e) => setReferenceRange(e.target.value)}
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
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Mark Completed"}
          </button>
        </form>
      </div>
    </div>
  );
}
