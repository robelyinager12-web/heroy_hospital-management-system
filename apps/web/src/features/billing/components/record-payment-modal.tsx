"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { billingApi, Invoice } from "@/features/billing/api/billing.api";

interface RecordPaymentModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function RecordPaymentModal({ invoice, onClose }: RecordPaymentModalProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");

  const mutation = useMutation({
    mutationFn: () => billingApi.recordPayment(invoice!.id, { amount: Number(amount), method }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      setAmount("");
      onClose();
    },
  });

  if (!invoice) return null;

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Record Payment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-3">
          Invoice {invoice.invoiceNo} — Total: ${invoice.total}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-3"
        >
          <input
            required
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />

          <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputClass}>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="INSURANCE">Insurance</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
          </select>

          {mutation.isError && (
            <p className="text-sm text-red-400">
              {(mutation.error as any)?.message ?? "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-white font-medium disabled:opacity-50"
          >
            {mutation.isPending ? "Recording..." : "Record Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}
