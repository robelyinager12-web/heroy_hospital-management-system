"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2 } from "lucide-react";
import { billingApi } from "@/features/billing/api/billing.api";
import { patientsApi, PatientListResponse } from "@/features/patients/api/patients.api";

interface CreateInvoiceModalProps {
  open: boolean;
  onClose: () => void;
}

interface LineItem {
  description: string;
  quantity: string;
  unitPrice: string;
}

export function CreateInvoiceModal({ open, onClose }: CreateInvoiceModalProps) {
  const queryClient = useQueryClient();
  const [patientId, setPatientId] = useState("");
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: "1", unitPrice: "" }]);

  const { data: patientsData } = useQuery({
    queryKey: ["patients", "for-invoice-select"],
    queryFn: async () => (await patientsApi.list({ page: 1 })).data as PatientListResponse,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () =>
      billingApi.create({
        patientId,
        tax: Number(tax),
        discount: Number(discount),
        items: items.map((i) => ({
          description: i.description,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setPatientId("");
    setTax("0");
    setDiscount("0");
    setItems([{ description: "", quantity: "1", unitPrice: "" }]);
    mutation.reset();
    onClose();
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  const subtotal = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);
  const total = subtotal + (Number(tax) || 0) - (Number(discount) || 0);

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Create Invoice</h2>
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
          <select required value={patientId} onChange={(e) => setPatientId(e.target.value)} className={inputClass}>
            <option value="">Select patient...</option>
            {patientsData?.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.user.firstName} {p.user.lastName} ({p.patientCode})
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400">Line Items</label>
              <button
                type="button"
                onClick={() => setItems((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }])}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <Plus size={12} /> Add item
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  required
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <input
                  required
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  className={`${inputClass} w-16`}
                />
                <input
                  required
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                  className={`${inputClass} w-24`}
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Tax"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              className={inputClass}
            />
            <input
              type="number"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex justify-between text-sm text-slate-300 pt-2 border-t border-white/10">
            <span>Total</span>
            <span className="font-semibold text-white">${total.toFixed(2)}</span>
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
            {mutation.isPending ? "Creating..." : "Create Invoice"}
          </button>
        </form>
      </div>
    </div>
  );
}
