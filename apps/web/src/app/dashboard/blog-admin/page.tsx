"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { cmsApi, BlogListResponse } from "@/features/cms/api/cms.api";
import { CreatePostModal } from "@/features/cms/components/create-post-modal";

export default function BlogAdminPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cms", "posts", page],
    queryFn: async () => {
      const res = await cmsApi.listPosts({ page });
      return res.data as BlogListResponse;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => cmsApi.updatePost(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cms"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cmsApi.removePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cms"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-slate-400 text-sm mt-1">{data?.pagination.total ?? 0} total posts</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading posts...
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-red-400">Couldn't load posts.</div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No posts yet. Write your first one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Author</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 text-white">
                    {p.title}
                    {p.excerpt && <p className="text-xs text-slate-500 mt-0.5 max-w-md truncate">{p.excerpt}</p>}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {p.author.firstName} {p.author.lastName}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={p.status}
                      onChange={(e) => statusMutation.mutate({ id: p.id, status: e.target.value })}
                      className={`px-2 py-1 rounded-full text-xs border bg-transparent ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}
                    >
                      <option value="DRAFT" className="bg-slate-900 text-white">Draft</option>
                      <option value="PUBLISHED" className="bg-slate-900 text-white">Published</option>
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

      <CreatePostModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
