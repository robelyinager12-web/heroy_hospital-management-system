"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { payrollApi, StaffMember } from "@/features/payroll/api/payroll.api";

interface CreatePayslipModalProps {
  open: boolean;
  onClose: () => void;
}

const now = new Date();

export function CreatePayslipModal({ open, onClose }: CreatePayslipModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    employeeId: "",
    baseSalary: "",
    bonus: "0",
    deductions: "0",
    periodMonth: String(now.getMonth() + 1),
    periodYear: String(now.getFullYear()),
  });

  const { data: staff } = useQuery({
    queryKey: ["payroll", "staff"],
    queryFn: async () => (await payrollApi.listStaff()).data.staff as StaffMember[],
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () =>
      payrollApi.create({
        ...form,
        baseSalary: Number(form.baseSalary),
        bonus: Number(form.bonus),
        deductions: Number(form.deductions),
        periodMonth: Number(form.periodMonth),
        periodYear: Number(form.periodYear),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({
      employeeId: "",
      baseSalary: "",
      bonus: "0",
      deductions: "0",
      periodMonth: String(now.getMonth() + 1),
      periodYear: String(now.getFullYear()),
    });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  const netPay =
    (Number(form.baseSalary) || 0) + (Number(form.bonus) || 0) - (Number(form.deductions) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Generate Payslip</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-3"
        >
          <select
            required
            value={form.employeeId}
            onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select employee...</option>
            {staff?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} — {s.role.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              placeholder="Month (1-12)"
              value={form.periodMonth}
              onChange={(e) => setForm((f) => ({ ...f, periodMonth: e.target.value }))}
              className={inputClass}
            />
            <input
              required
              type="number"
              placeholder="Year"
              value={form.periodYear}
              onChange={(e) => setForm((f) => ({ ...f, periodYear: e.target.value }))}
              className={inputClass}
            />
          </div>

          <input
            required
            type="number"
            step="0.01"
            placeholder="Base salary"
            value={form.baseSalary}
            onChange={(e) => setForm((f) => ({ ...f, baseSalary: e.target.value }))}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Bonus"
              value={form.bonus}
              onChange={(e) => setForm((f) => ({ ...f, bonus: e.target.value }))}
              className={inputClass}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Deductions"
              value={form.deductions}
              onChange={(e) => setForm((f) => ({ ...f, deductions: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex justify-between text-sm text-slate-300 pt-2 border-t border-white/10">
            <span>Net Pay</span>
            <span className="font-semibold text-white">Br {netPay.toFixed(2)}</span>
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-400">
              {(mutation.error as any)?.message ?? "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Generating..." : "Generate Payslip"}
          </button>
        </form>
      </div>
    </div>
  );
}
