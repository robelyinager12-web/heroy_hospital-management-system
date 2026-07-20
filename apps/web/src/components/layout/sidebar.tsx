"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { getNavForRole } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const navItems = getNavForRole(user?.role ?? "PATIENT");

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-white/10 bg-slate-950/60 backdrop-blur-xl theme-surface">
      <div className="px-6 py-6 border-b border-white/10">
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          HEROY
        </span>
        <p className="text-xs text-slate-400 mt-0.5">Hospital Management System</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative block">
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className={isActive ? "font-medium" : ""}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
