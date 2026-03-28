import { ChatPanel } from "@/components/chat/chat-panel";

export default function AssistantPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">AI Assistant</h1>
      <ChatPanel />
    </section>
  );
}
