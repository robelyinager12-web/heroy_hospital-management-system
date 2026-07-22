"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { insuranceApi, PolicyListResponse, ClaimListResponse } from "@/features/insurance/api/insurance.api";
import { CreatePolicyModal } from "@/features/insurance/components/create-policy-modal";
import { CreateClaimModal } from "@/features/insurance/components/create-claim-modal";

const claimStatusColors: Record<string, string> = {
  SUBMITTED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function InsurancePage() {
  const [tab, setTab] = useState<"policies" | "claims">("policies");
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: policiesData, isLoading: policiesLoading } = useQuery({
    queryKey: ["insurance", "policies"],
    queryFn: async () => (await insuranceApi.listPolicies(1)).data as PolicyListResponse,
    enabled: tab === "policies",
  });

  const { data: claimsData, isLoading: claimsLoading } = useQuery({
    queryKey: ["insurance", "claims"],
    queryFn: async () => (await insuranceApi.listClaims({ page: 1 })).data as ClaimListResponse,
    enabled: tab === "claims",
  });

  const deletePolicyMutation = useMutation({
    mutationFn: (id: string) => insuranceApi.removePolicy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insurance"] }),
  });

  const claimStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => insuranceApi.updateClaim(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insurance"] }),
  });

  const deleteClaimMutation = useMutation({
    mutationFn: (id: string) => insuranceApi.removeClaim(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["insurance"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Insurance</h1>
          <p className="text-slate-400 text-sm mt-1">Policies and claims</p>
        </div>
        <button
          onClick={() => (tab === "policies" ? setPolicyModalOpen(true) : setClaimModalOpen(true))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          {tab === "policies" ? "Add Policy" : "Submit Claim"}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("policies")}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            tab === "policies" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-slate-400"
          }`}
        >
          Policies
        </button>
        <button
          onClick={() => setTab("claims")}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            tab === "claims" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-slate-400"
          }`}
        >
          Claims
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {tab === "policies" ? (
          policiesLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="animate-spin mr-2" size={18} />
              Loading policies...
            </div>
          ) : policiesData?.items.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No policies yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Provider</th>
                  <th className="px-5 py-3 font-medium">Policy Number</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {policiesData?.items.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white">
                      {p.patient.user.firstName} {p.patient.user.lastName}
                    </td>
                    <td className="px-5 py-3 text-slate-400">{p.provider}</td>
                    <td className="px-5 py-3 text-slate-400">{p.policyNumber}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => deletePolicyMutation.mutate(p.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : claimsLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading claims...
          </div>
        ) : claimsData?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No claims yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Claim #</th>
                <th className="px-5 py-3 font-medium">Patient</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {claimsData?.items.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">{c.claimNumber}</td>
                  <td className="px-5 py-3 text-slate-400">
                    {c.policy.patient.user.firstName} {c.policy.patient.user.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-300 font-medium">${c.amountClaimed}</td>
                  <td className="px-5 py-3">
                    <select
                      value={c.status}
                      onChange={(e) => claimStatusMutation.mutate({ id: c.id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border bg-transparent ${claimStatusColors[c.status] ?? ""}`}
                    >
                      {Object.keys(claimStatusColors).map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteClaimMutation.mutate(c.id)}
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

      <CreatePolicyModal open={policyModalOpen} onClose={() => setPolicyModalOpen(false)} />
      <CreateClaimModal open={claimModalOpen} onClose={() => setClaimModalOpen(false)} />
    </div>
  );
}
