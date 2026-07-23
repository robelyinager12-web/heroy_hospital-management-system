"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Send, Plus, MessageSquare } from "lucide-react";
import { chatApi, Conversation, ChatMessage } from "@/features/chat/api/chat.api";
import { NewConversationModal } from "@/features/chat/components/new-conversation-modal";
import { useAuthStore } from "@/store/auth-store";

export default function ChatPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: async () => (await chatApi.listConversations()).data.conversations as Conversation[],
    refetchInterval: 8000,
  });

  const { data: thread } = useQuery({
    queryKey: ["chat", "messages", activeId],
    queryFn: async () => {
      const res = await chatApi.getMessages(activeId!);
      return res.data as { conversation: Conversation; messages: ChatMessage[] };
    },
    enabled: !!activeId,
    refetchInterval: 4000,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(activeId!, content),
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries({ queryKey: ["chat", "messages", activeId] });
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread?.messages]);

  function otherParticipant(conv: Conversation) {
    return conv.participants.find((p) => p.user.id !== currentUser?.id)?.user;
  }

  function handleSend() {
    const text = input.trim();
    if (!text || sendMutation.isPending) return;
    sendMutation.mutate(text);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      {/* Conversation list */}
      <div className="w-72 border-r border-white/10 flex flex-col shrink-0">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Messages</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="p-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!conversations || conversations.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8 px-4">
              No conversations yet. Start one with the + button.
            </p>
          ) : (
            conversations.map((c) => {
              const other = otherParticipant(c);
              const lastMsg = c.messages?.[0];
              const isActive = activeId === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors text-left ${
                    isActive ? "bg-cyan-500/10" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                    {other?.firstName?.[0]}
                    {other?.lastName?.[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">
                      {other?.firstName} {other?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {lastMsg?.content ?? "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col">
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2">
            <MessageSquare size={32} />
            <p className="text-sm">Select a conversation or start a new one</p>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {thread?.messages.map((m) => {
                const isMe = m.sender.id === currentUser?.id;
                return (
                  <div key={m.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-semibold text-white">
                      {m.sender.firstName[0]}
                      {m.sender.lastName[0]}
                    </div>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMe
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : "bg-white/5 border border-white/10 text-slate-200"
                      }`}
                    >
                      {m.content}
                      <p className={`text-[10px] mt-1 ${isMe ? "text-cyan-100/70" : "text-slate-500"}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/10 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <button
                onClick={handleSend}
                disabled={sendMutation.isPending || !input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      <NewConversationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStarted={(id) => setActiveId(id)}
      />
    </div>
  );
}
