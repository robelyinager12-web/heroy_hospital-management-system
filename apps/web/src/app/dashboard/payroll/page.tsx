"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { payrollApi, PayslipListResponse } from "@/features/payroll/api/payroll.api";
import { CreatePayslipModal } from "@/features/payroll/components/create-payslip-modal";

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function PayrollPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payroll", page],
    queryFn: async () => (await payrollApi.list(page)).data as PayslipListResponse,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => payrollApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payroll"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => payrollApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payroll"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payroll</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} payslips generated</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Generate Payslip
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading payslips...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">Couldn't load payslips.</div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No payslips yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Period</th>
                <th className="px-5 py-3 font-medium">Net Pay</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {p.employee.firstName} {p.employee.lastName}
                    <span className="text-slate-500 ml-2 text-xs">{p.employee.role.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {MONTHS[p.periodMonth]} {p.periodYear}
                  </td>
                  <td className="px-5 py-3 text-slate-300 font-medium">Br {p.netPay}</td>
                  <td className="px-5 py-3">
                    <select
                      value={p.status}
                      onChange={(e) => statusMutation.mutate({ id: p.id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border bg-transparent ${
                        p.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      <option value="PENDING" className="bg-slate-900 text-white">Pending</option>
                      <option value="PAID" className="bg-slate-900 text-white">Paid</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(p.id)}
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

      <CreatePayslipModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
