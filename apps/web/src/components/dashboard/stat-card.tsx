"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number; // e.g. 12.4 or -3.2
  icon: LucideIcon;
  gradient: string; // tailwind gradient classes, e.g. "from-cyan-500 to-blue-600"
}

export function StatCard({ label, value, prefix = "", suffix = "", change, icon: Icon, gradient }: StatCardProps) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1.2, bounce: 0 });
  const rounded = useTransform(springValue, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  const isPositive = (change ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 overflow-hidden group"
    >
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
          </p>

          {change !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-xs ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(change)}% vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}