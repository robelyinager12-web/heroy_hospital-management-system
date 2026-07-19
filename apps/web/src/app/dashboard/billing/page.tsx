"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, CreditCard } from "lucide-react";
import { billingApi, InvoiceListResponse, Invoice } from "@/features/billing/api/billing.api";
import { CreateInvoiceModal } from "@/features/billing/components/create-invoice-modal";
import { RecordPaymentModal } from "@/features/billing/components/record-payment-modal";

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PARTIALLY_PAID: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  OVERDUE: "bg-red-500/10 text-red-400 border-red-500/20",
  CANCELLED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function BillingPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["billing", page],
    queryFn: async () => {
      const res = await billingApi.list({ page });
      return res.data as InvoiceListResponse;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billingApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["billing"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} total invoices</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Create Invoice
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading invoices...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load invoices. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No invoices yet. Create the first one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((inv) => (
                <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">{inv.invoiceNo}</td>
                  <td className="px-5 py-3 text-slate-400">
                    {inv.patient.user.firstName} {inv.patient.user.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-300 font-medium">${inv.total}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColors[inv.status] ?? ""}`}>
                      {inv.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                    {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                      <button
                        onClick={() => setPayingInvoice(inv)}
                        title="Record payment"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <CreditCard size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(inv.id)}
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

      <CreateInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <RecordPaymentModal invoice={payingInvoice} onClose={() => setPayingInvoice(null)} />
    </div>
  );
}
