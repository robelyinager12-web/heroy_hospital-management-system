"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mic, Square, Bot, User, Loader2, Volume2, VolumeX } from "lucide-react";
import { aiApi } from "@/features/ai/api/ai.api";

interface LocalMessage {
  role: "USER" | "ASSISTANT";
  content: string;
}

export default function VoiceAssistantPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [statusText, setStatusText] = useState("Tap the mic to speak");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const chatMutation = useMutation({
    mutationFn: (message: string) => aiApi.sendMessage(message, conversationId),
    onSuccess: (res: any) => {
      setConversationId(res.data.conversationId);
      setMessages((prev) => [...prev, { role: "ASSISTANT", content: res.data.reply }]);
      setStatusText("Tap the mic to speak");

      if (voiceEnabled && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(res.data.reply);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    },
    onError: () => {
      setStatusText("Something went wrong. Tap the mic to try again.");
    },
  });

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setIsTranscribing(true);
        setStatusText("Transcribing...");

        try {
          const res = await aiApi.transcribe(blob);
          const text = res.data.text?.trim();

          if (!text) {
            setStatusText("Didn't catch that. Tap the mic to try again.");
            setIsTranscribing(false);
            return;
          }

          setMessages((prev) => [...prev, { role: "USER", content: text }]);
          setStatusText("Thinking...");
          setIsTranscribing(false);
          chatMutation.mutate(text);
        } catch {
          setStatusText("Couldn't transcribe that. Tap the mic to try again.");
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatusText("Listening...");
    } catch {
      setStatusText("Microphone access denied. Please allow microphone access.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  const isBusy = isTranscribing || chatMutation.isPending;

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
        <button
          onClick={() => setVoiceEnabled((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/5"
        >
          {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          {voiceEnabled ? "Voice reply on" : "Voice reply off"}
        </button>
      </div>

      <div className="relative mb-8">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 blur-2xl opacity-30 ${
            isRecording ? "animate-pulse scale-125" : ""
          } transition-transform duration-500`}
        />
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isBusy}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-gradient-to-br from-red-500 to-orange-600 scale-110"
              : "bg-gradient-to-br from-cyan-500 to-blue-600 hover:scale-105"
          } disabled:opacity-60 shadow-2xl`}
        >
          {isBusy ? (
            <Loader2 size={32} className="text-white animate-spin" />
          ) : isRecording ? (
            <Square size={28} className="text-white" fill="white" />
          ) : (
            <Mic size={32} className="text-white" />
          )}
        </button>
      </div>

      <p className="text-sm text-slate-400 mb-8">{statusText}</p>

      <div className="w-full max-h-64 overflow-y-auto space-y-3 px-4">
        {messages.slice(-4).map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "USER" ? "flex-row-reverse" : ""}`}>
            <div
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                m.role === "USER" ? "bg-white/10" : "bg-gradient-to-br from-cyan-500 to-blue-600"
              }`}
            >
              {m.role === "USER" ? <User size={13} className="text-slate-300" /> : <Bot size={13} className="text-white" />}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "USER"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "bg-white/5 border border-white/10 text-slate-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
