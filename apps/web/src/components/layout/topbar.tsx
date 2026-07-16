"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { useState } from "react";

export function Topbar() {
  const [isDark, setIsDark] = useState(true);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          placeholder="Search patients, doctors, records..."
          className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDark((d) => !d)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>
      </div>
    </header>
  );
}