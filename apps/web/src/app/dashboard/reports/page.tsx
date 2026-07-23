"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, CalendarClock, BedDouble, DollarSign, Siren, PackageX, Stethoscope, HeartPulse } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { reportsApi, OverviewData } from "@/features/reports/api/reports.api";

function StatCard({ label, value, icon: Icon, gradient }: { label: string; value: string | number; icon: any; gradient: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { data: overview } = useQuery({
    queryKey: ["reports", "overview"],
    queryFn: async () => (await reportsApi.getOverview()).data as OverviewData,
  });

  const { data: revenueTrend } = useQuery({
    queryKey: ["reports", "revenue-trend"],
    queryFn: async () => (await reportsApi.getRevenueTrend()).data.data,
  });

  const { data: patientGrowth } = useQuery({
    queryKey: ["reports", "patient-growth"],
    queryFn: async () => (await reportsApi.getPatientGrowth()).data.data,
  });

  const { data: topDoctors } = useQuery({
    queryKey: ["reports", "top-doctors"],
    queryFn: async () => (await reportsApi.getTopDoctors()).data.data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time overview across the whole system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={overview?.totalPatients ?? "—"} icon={Users} gradient="from-cyan-500 to-blue-600" />
        <StatCard label="Total Doctors" value={overview?.totalDoctors ?? "—"} icon={Stethoscope} gradient="from-violet-500 to-purple-600" />
        <StatCard label="Total Nurses" value={overview?.totalNurses ?? "—"} icon={HeartPulse} gradient="from-pink-500 to-rose-600" />
        <StatCard label="Total Appointments" value={overview?.totalAppointments ?? "—"} icon={CalendarClock} gradient="from-amber-500 to-orange-600" />
        <StatCard
          label="Bed Occupancy"
          value={overview ? `${overview.bedOccupancy.occupied} / ${overview.bedOccupancy.total}` : "—"}
          icon={BedDouble}
          gradient="from-teal-500 to-emerald-600"
        />
        <StatCard label="Total Revenue" value={overview ? `$${Number(overview.totalRevenue).toLocaleString()}` : "—"} icon={DollarSign} gradient="from-emerald-500 to-teal-600" />
        <StatCard label="Active Emergencies" value={overview?.activeEmergencies ?? "—"} icon={Siren} gradient="from-red-500 to-orange-600" />
        <StatCard label="Low Stock Items" value={overview?.lowStockCount ?? "—"} icon={PackageX} gradient="from-amber-500 to-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend (6 months)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend ?? []}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} labelStyle={{ color: "#fff" }} />
              <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} fill="url(#revGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Patient Growth (6 months)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={patientGrowth ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} labelStyle={{ color: "#fff" }} />
              <Bar dataKey="patients" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Busiest Doctors</h2>
        {!topDoctors || topDoctors.length === 0 ? (
          <p className="text-sm text-slate-400">No appointment data yet.</p>
        ) : (
          <div className="space-y-3">
            {topDoctors.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-white">{d.name}</span>
                <div className="flex items-center gap-2 flex-1 mx-4">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      style={{ width: `${Math.min((d.appointments / (topDoctors[0]?.appointments || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-400">{d.appointments} appts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
