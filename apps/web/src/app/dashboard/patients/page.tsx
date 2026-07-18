"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Search, Plus, Trash2, Loader2 } from "lucide-react";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patients", page, search],
    queryFn: async () => {
      const res = await patientsApi.list({ page, search });
      return res.data as PatientListResponse;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => patientsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Patients</h1>
          <p className="text-slate-400 text-sm mt-1">
            {data?.pagination.total ?? 0} total patients
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition">
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, or patient code..."
          className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading patients...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load patients. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            No patients found. Try adjusting your search, or add a new patient.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((patient) => (
                <tr key={patient.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {patient.user.firstName} {patient.user.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{patient.patientCode}</td>
                  <td className="px-5 py-3 text-slate-400">{patient.user.email}</td>
                  <td className="px-5 py-3 text-slate-400">{patient.user.phone ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-400">{patient.city ?? "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(patient.id)}
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

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border border-white/10 disabled:opacity-40 hover:bg-white/5"
          >
            Previous
          </button>
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
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