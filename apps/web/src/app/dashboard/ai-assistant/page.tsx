"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { aiApi } from "@/features/ai/api/ai.api";

interface LocalMessage {
  role: "USER" | "ASSISTANT";
  content: string;
}

const SUGGESTIONS = [
  "What are common signs of dehydration?",
  "Summarize the process for admitting an emergency patient",
  "What should I know about drug interactions with ibuprofen?",
  "Explain what a CBC blood test measures",
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: (message: string) => aiApi.sendMessage(message, conversationId),
    onSuccess: (res: any) => {
      setConversationId(res.data.conversationId);
      setMessages((prev) => [...prev, { role: "ASSISTANT", content: res.data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "ASSISTANT", content: "Sorry, I ran into a problem responding. Please try again." },
      ]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message || mutation.isPending) return;

    setMessages((prev) => [...prev, { role: "USER", content: message }]);
    setInput("");
    mutation.mutate(message);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Medical Assistant</h1>
          <p className="text-xs text-slate-400">Powered by Groq · Not a substitute for professional medical advice</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <Sparkles className="text-cyan-400" size={32} />
            <p className="text-slate-400 text-sm">Ask me anything about patient care, medications, or navigating HEROY.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:border-cyan-400/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "USER" ? "flex-row-reverse" : ""}`}>
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === "USER" ? "bg-white/10" : "bg-gradient-to-br from-cyan-500 to-blue-600"
                }`}
              >
                {m.role === "USER" ? <User size={15} className="text-slate-300" /> : <Bot size={15} className="text-white" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  m.role === "USER"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "bg-white/5 border border-white/10 text-slate-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}

        {mutation.isPending && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Bot size={15} className="text-white" />
            </div>
            <div className="rounded-2xl px-4 py-2.5 bg-white/5 border border-white/10 flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 size={14} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask the AI assistant..."
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
        <button
          onClick={() => handleSend()}
          disabled={mutation.isPending || !input.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50 hover:opacity-90 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
