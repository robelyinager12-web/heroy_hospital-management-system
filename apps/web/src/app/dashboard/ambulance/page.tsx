"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Truck } from "lucide-react";
import { ambulanceApi, RequestListResponse } from "@/features/ambulance/api/ambulance.api";
import { RequestModal } from "@/features/ambulance/components/request-modal";
import { ManageVehiclesModal } from "@/features/ambulance/components/manage-vehicles-modal";

const statusColors: Record<string, string> = {
  REQUESTED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DISPATCHED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  EN_ROUTE: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AmbulancePage() {
  const [page, setPage] = useState(1);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [vehiclesModalOpen, setVehiclesModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ambulance", page],
    queryFn: async () => {
      const res = await ambulanceApi.list({ page });
      return res.data as RequestListResponse;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ambulanceApi.updateRequest(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ambulance"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ambulanceApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ambulance"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ambulance</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} total requests</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVehiclesModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition"
          >
            <Truck size={16} />
            Manage Fleet
          </button>
          <button
            onClick={() => setRequestModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-medium hover:opacity-90 transition"
          >
            <Plus size={16} />
            Request Ambulance
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading requests...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load ambulance requests. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No ambulance requests yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Pickup → Destination</th>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {r.patient ? `${r.patient.user.firstName} ${r.patient.user.lastName}` : "External call"}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {r.pickupLocation} → {r.destination}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {r.ambulance ? `${r.ambulance.vehicleNumber} (${r.ambulance.driverName})` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => statusMutation.mutate({ id: r.id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border bg-transparent ${statusColors[r.status] ?? ""}`}
                    >
                      {Object.keys(statusColors).map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-white">
                          {s.replace(/_/g, " ")}
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

      <RequestModal open={requestModalOpen} onClose={() => setRequestModalOpen(false)} />
      <ManageVehiclesModal open={vehiclesModalOpen} onClose={() => setVehiclesModalOpen(false)} />
    </div>
  );
}
