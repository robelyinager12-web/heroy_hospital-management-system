"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { pharmacyApi } from "@/features/pharmacy/api/pharmacy.api";

interface CreateMedicineModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateMedicineModal({ open, onClose }: CreateMedicineModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    unit: "",
    quantity: "0",
    reorderLevel: "10",
    unitCost: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      pharmacyApi.create({
        ...form,
        quantity: Number(form.quantity),
        reorderLevel: Number(form.reorderLevel),
        unitCost: form.unitCost ? Number(form.unitCost) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] });
      handleClose();
    },
  });

  if (!open) return null;

  function handleClose() {
    setForm({ name: "", sku: "", unit: "", quantity: "0", reorderLevel: "10", unitCost: "" });
    mutation.reset();
    onClose();
  }

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Add Medicine</h2>
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
          <input
            required
            placeholder="Medicine name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className={inputClass}
            />
            <input
              required
              placeholder="Unit (box, ml...)"
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Starting quantity"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className={inputClass}
            />
            <input
              type="number"
              placeholder="Reorder level"
              value={form.reorderLevel}
              onChange={(e) => setForm((f) => ({ ...f, reorderLevel: e.target.value }))}
              className={inputClass}
            />
          </div>
          <input
            type="number"
            step="0.01"
            placeholder="Unit cost (optional)"
            value={form.unitCost}
            onChange={(e) => setForm((f) => ({ ...f, unitCost: e.target.value }))}
            className={inputClass}
          />

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
            {mutation.isPending ? "Adding..." : "Add Medicine"}
          </button>
        </form>
      </div>
    </div>
  );
}
