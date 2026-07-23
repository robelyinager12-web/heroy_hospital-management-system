"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, User } from "lucide-react";
import { chatApi, ChatUser } from "@/features/chat/api/chat.api";

interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
  onStarted: (conversationId: string) => void;
}

export function NewConversationModal({ open, onClose, onStarted }: NewConversationModalProps) {
  const queryClient = useQueryClient();

  const { data: staff } = useQuery({
    queryKey: ["chat", "staff"],
    queryFn: async () => (await chatApi.listStaff()).data.staff as ChatUser[],
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (userId: string) => chatApi.startConversation(userId),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
      onStarted(res.data.conversation.id);
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">New Conversation</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1">
          {!staff || staff.length === 0 ? (
            <p className="text-sm text-slate-500">No other staff members found.</p>
          ) : (
            staff.map((u) => (
              <button
                key={u.id}
                onClick={() => mutation.mutate(u.id)}
                disabled={mutation.isPending}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left disabled:opacity-50"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                  {u.firstName[0]}
                  {u.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{u.role.replace(/_/g, " ")}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
