"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Search, Plus, Trash2, Loader2, TriangleAlert, Minus, PlusCircle } from "lucide-react";
import { inventoryApi, InventoryListResponse } from "@/features/inventory/api/inventory.api";
import { CreateItemModal } from "@/features/inventory/components/create-item-modal";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventory", page, search, category, lowStockOnly],
    queryFn: async () => {
      const res = await inventoryApi.list({ page, search, category: category || undefined, lowStockOnly });
      return res.data as InventoryListResponse;
    },
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) => inventoryApi.adjustStock(id, delta),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} items in stock</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or SKU..."
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white"
        >
          <option value="">All categories</option>
          <option value="equipment">Equipment</option>
          <option value="supply">Supply</option>
        </select>

        <button
          onClick={() => {
            setLowStockOnly((v) => !v);
            setPage(1);
          }}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm border ${
            lowStockOnly ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "border-white/10 text-slate-400"
          }`}
        >
          <TriangleAlert size={14} />
          Low Stock Only
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading inventory...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">
            Couldn't load inventory. Is the backend running on port 4000?
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No items found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((item) => {
                const isLow = item.quantity <= item.reorderLevel;
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white">{item.name}</td>
                    <td className="px-5 py-3 text-slate-400 capitalize">{item.category}</td>
                    <td className="px-5 py-3 text-slate-400">{item.sku}</td>
                    <td className="px-5 py-3">
                      <span className={isLow ? "text-amber-400 font-medium" : "text-slate-300"}>
                        {item.quantity} {item.unit}
                        {isLow && <TriangleAlert size={12} className="inline ml-1.5 mb-0.5" />}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right flex items-center justify-end gap-1">
                      <button
                        onClick={() => adjustMutation.mutate({ id: item.id, delta: -1 })}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <Minus size={15} />
                      </button>
                      <button
                        onClick={() => adjustMutation.mutate({ id: item.id, delta: 10 })}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <PlusCircle size={15} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <CreateItemModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
