"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, BedDouble } from "lucide-react";
import { ipdApi, Bed } from "@/features/ipd/api/ipd.api";

export default function BedsPage() {
  const { data: beds, isLoading } = useQuery({
    queryKey: ["ipd", "beds", "all"],
    queryFn: async () => (await ipdApi.listBeds()).data.beds as Bed[],
  });

  const grouped = (beds ?? []).reduce<Record<string, Bed[]>>((acc, bed) => {
    const wardName = bed.ward?.name ?? "Unassigned";
    acc[wardName] = acc[wardName] ?? [];
    acc[wardName].push(bed);
    return acc;
  }, {});

  const totalBeds = beds?.length ?? 0;
  const occupiedBeds = beds?.filter((b) => b.isOccupied).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Beds</h1>
        <p className="text-slate-400 text-sm mt-1">
          {occupiedBeds} / {totalBeds} beds occupied · Manage wards and beds from the IPD page
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={18} />
          Loading beds...
        </div>
      ) : totalBeds === 0 ? (
        <div className="text-center py-16 text-slate-400 rounded-2xl border border-white/10 bg-white/5">
          No beds set up yet. Go to IPD → Manage Wards to add wards and beds.
        </div>
      ) : (
        Object.entries(grouped).map(([wardName, wardBeds]) => (
          <div key={wardName} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h2 className="text-white font-semibold mb-4">{wardName}</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {wardBeds.map((bed) => (
                <div
                  key={bed.id}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 text-xs ${
                    bed.isOccupied
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  }`}
                >
                  <BedDouble size={16} />
                  {bed.bedNumber}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
