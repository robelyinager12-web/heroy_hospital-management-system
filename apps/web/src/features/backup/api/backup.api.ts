import { apiClient } from "@/lib/api-client";

export interface BackupFile {
  filename: string;
  sizeBytes: number;
  createdAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const backupApi = {
  list: () => apiClient.get("/backup"),
  create: () => apiClient.post("/backup"),
  remove: (filename: string) => apiClient.delete(`/backup/${filename}`),

  async download(filename: string) {
    const token = JSON.parse(localStorage.getItem("heroy-auth") ?? "{}")?.state?.accessToken;
    const res = await fetch(`${BASE_URL}/backup/${filename}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};
