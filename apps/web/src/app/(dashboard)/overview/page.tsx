"use client";

import { Users, CalendarClock, BedDouble, Receipt } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";

const patientTrend = [
  { month: "Jan", patients: 320 },
  { month: "Feb", patients: 410 },
  { month: "Mar", patients: 380 },
  { month: "Apr", patients: 490 },
  { month: "May", patients: 560 },
  { month: "Jun", patients: 610 },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back — here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={4821} change={8.2} icon={Users} gradient="from-cyan-500 to-blue-600" />
        <StatCard label="Today's Appointments" value={132} change={-2.4} icon={CalendarClock} gradient="from-violet-500 to-purple-600" />
        <StatCard label="Occupied Beds" value={287} suffix=" / 340" change={4.1} icon={BedDouble} gradient="from-amber-500 to-orange-600" />
        <StatCard label="Revenue This Month" value={184200} prefix="$" change={12.7} icon={Receipt} gradient="from-emerald-500 to-teal-600" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Patient Growth</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={patientTrend}>
            <defs>
              <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
              labelStyle={{ color: "#fff" }}
            />
            <Area type="monotone" dataKey="patients" stroke="#22d3ee" strokeWidth={2} fill="url(#patientGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}