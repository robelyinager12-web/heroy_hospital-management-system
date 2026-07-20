"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Plus } from "lucide-react";
import { ipdApi, Ward } from "@/features/ipd/api/ipd.api";

interface ManageWardsModalProps {
  open: boolean;
  onClose: () => void;
}

export function ManageWardsModal({ open, onClose }: ManageWardsModalProps) {
  const queryClient = useQueryClient();
  const [wardName, setWardName] = useState("");
  const [floor, setFloor] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [bedNumber, setBedNumber] = useState("");

  const { data: wardsData } = useQuery({
    queryKey: ["ipd", "wards"],
    queryFn: async () => (await ipdApi.listWards()).data.wards as Ward[],
    enabled: open,
  });

  const createWardMutation = useMutation({
    mutationFn: () => ipdApi.createWard({ name: wardName, floor: floor || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ipd"] });
      setWardName("");
      setFloor("");
    },
  });

  const createBedMutation = useMutation({
    mutationFn: () => ipdApi.createBed({ wardId: selectedWardId, bedNumber }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ipd"] });
      setBedNumber("");
    },
  });

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Manage Wards & Beds</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-400 mb-2">Add a new ward</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createWardMutation.mutate();
              }}
              className="flex gap-2"
            >
              <input
                required
                placeholder="Ward name (e.g. General Ward A)"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <input
                placeholder="Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className={`${inputClass} w-20`}
              />
              <button
                type="submit"
                disabled={createWardMutation.isPending}
                className="px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-slate-400 mb-2">Add a bed to a ward</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createBedMutation.mutate();
              }}
              className="flex gap-2"
            >
              <select
                required
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className={`${inputClass} flex-1`}
              >
                <option value="">Select ward...</option>
                {wardsData?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Bed #"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                className={`${inputClass} w-20`}
              />
              <button
                type="submit"
                disabled={createBedMutation.isPending}
                className="px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-xs text-slate-400">Existing wards</p>
            {wardsData?.length === 0 || !wardsData ? (
              <p className="text-sm text-slate-500">No wards yet — add one above.</p>
            ) : (
              wardsData.map((w) => (
                <div key={w.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 text-sm">
                  <span className="text-white">
                    {w.name} {w.floor && `(Floor ${w.floor})`}
                  </span>
                  <span className="text-slate-400">{w.beds.length} beds</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
