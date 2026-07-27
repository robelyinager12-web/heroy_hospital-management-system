"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DatabaseBackup, Download, Trash2, Loader2, PlusCircle, ShieldAlert } from "lucide-react";
import { backupApi, BackupFile } from "@/features/backup/api/backup.api";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BackupPage() {
  const queryClient = useQueryClient();
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["backup"],
    queryFn: async () => (await backupApi.list()).data.backups as BackupFile[],
  });

  const createMutation = useMutation({
    mutationFn: () => backupApi.create(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["backup"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (filename: string) => backupApi.remove(filename),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["backup"] }),
  });

  async function handleDownload(filename: string) {
    setDownloadingFile(filename);
    try {
      await backupApi.download(filename);
    } finally {
      setDownloadingFile(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Backup & Recovery</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.length ?? 0} backups stored on this server</p>
        </div>
        <button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
          {createMutation.isPending ? "Creating backup..." : "Create Backup Now"}
        </button>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
        <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200/80">
          <p className="font-medium text-amber-300">Restoring a backup is a manual, deliberate action</p>
          <p className="mt-1 text-amber-200/60">
            To restore, download the file below and run: <code className="text-amber-300">psql -U postgres -d your_db -f backup.sql</code>{" "}
            on a server where you've first confirmed the current database can be safely overwritten. This is intentionally not automated in the UI to prevent accidental data loss.
          </p>
        </div>
      </div>

      {createMutation.isError && (
        <p className="text-sm text-red-400">
          {(createMutation.error as any)?.message ?? "Backup failed. Check that pg_dump is installed and accessible."}
        </p>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading backups...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">Couldn't load backups.</div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
            <DatabaseBackup size={28} className="text-slate-600" />
            No backups yet. Create your first one above.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Filename</th>
                <th className="px-5 py-3 font-medium">Size</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b.filename} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white font-mono text-xs">{b.filename}</td>
                  <td className="px-5 py-3 text-slate-400">{formatBytes(b.sizeBytes)}</td>
                  <td className="px-5 py-3 text-slate-400">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleDownload(b.filename)}
                      disabled={downloadingFile === b.filename}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors disabled:opacity-50"
                    >
                      {downloadingFile === b.filename ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(b.filename)}
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
    </div>
  );
}
