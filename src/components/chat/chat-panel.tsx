"use client";

import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "m_1", role: "assistant", content: "Hi! Ask me about your SaaS metrics or workflows." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: `u_${Date.now()}`, role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userMessage.content }),
      headers: { "Content-Type": "application/json" },
    });
    const data = (await response.json()) as { response: string };
    setMessages((prev) => [
      ...prev,
      { id: `a_${Date.now()}`, role: "assistant", content: data.response },
    ]);
    setLoading(false);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div ref={scrollRef} className="mb-3 flex-1 space-y-2 overflow-y-auto rounded-lg bg-zinc-50 p-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              message.role === "user" ? "ml-auto bg-indigo-600 text-white" : "bg-white text-zinc-800"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." />
        <Button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
