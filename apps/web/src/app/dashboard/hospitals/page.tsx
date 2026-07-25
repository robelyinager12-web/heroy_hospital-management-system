"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Building2 } from "lucide-react";
import { hospitalsApi, HospitalListResponse } from "@/features/hospitals/api/hospitals.api";
import { CreateHospitalModal } from "@/features/hospitals/components/create-hospital-modal";

export default function HospitalsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => (await hospitalsApi.list(1)).data as HospitalListResponse,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => hospitalsApi.update(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hospitals"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hospitalsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hospitals"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hospitals</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} hospitals in this network</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add Hospital
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={18} />
          Loading hospitals...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400">
          Couldn't load hospitals. Is the backend running on port 4000?
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No hospitals added yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.items.map((h) => (
            <div key={h.id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Building2 size={18} className="text-white" />
                </div>
                <button
                  onClick={() => deleteMutation.mutate(h.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <h3 className="text-white font-semibold">{h.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {h.city ?? "—"}{h.country ? `, ${h.country}` : ""}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="rounded-lg bg-white/5 px-2 py-1.5">
                  <p className="text-slate-500">Doctors</p>
                  <p className="text-white font-medium">{h._count?.doctors ?? 0}</p>
                </div>
                <div className="rounded-lg bg-white/5 px-2 py-1.5">
                  <p className="text-slate-500">Patients</p>
                  <p className="text-white font-medium">{h._count?.patients ?? 0}</p>
                </div>
              </div>

              <button
                onClick={() => toggleActiveMutation.mutate({ id: h.id, isActive: !h.isActive })}
                className={`w-full mt-4 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  h.isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                }`}
              >
                {h.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          ))}
        </div>
      )}

      <CreateHospitalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
