"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ScrollText } from "lucide-react";
import { auditLogsApi, AuditLogListResponse } from "@/features/audit-logs/api/audit-logs.api";

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  UPDATE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs", page, actionFilter],
    queryFn: async () => {
      const res = await auditLogsApi.list({ page, action: actionFilter || undefined });
      return res.data as AuditLogListResponse;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} recorded actions</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["", "CREATE", "UPDATE", "DELETE"].map((a) => (
          <button
            key={a}
            onClick={() => {
              setActionFilter(a);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              actionFilter === a ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-slate-400"
            }`}
          >
            {a || "All"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading audit logs...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">Couldn't load audit logs.</div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
            <ScrollText size={28} className="text-slate-600" />
            No actions recorded yet. Actions across the system will appear here automatically.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Entity</th>
                <th className="px-5 py-3 font-medium">IP Address</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {log.user ? `${log.user.firstName} ${log.user.lastName}` : "System"}
                    {log.user && <span className="text-slate-500 ml-2 text-xs">{log.user.role.replace(/_/g, " ")}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${actionColors[log.action] ?? ""}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400 capitalize">
                    {log.entity}
                    {log.entityId && <span className="text-slate-600 ml-1 text-xs">({log.entityId.slice(0, 8)}...)</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{log.ipAddress ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5"
          >
            Previous
          </button>
          <span>Page {data.pagination.page} of {data.pagination.totalPages}</span>
          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
