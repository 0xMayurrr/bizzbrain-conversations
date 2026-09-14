import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChatList } from "@/components/bizzbrain/ChatList";
import { ChatWindow } from "@/components/bizzbrain/ChatWindow";
import { MemoryPanel } from "@/components/bizzbrain/MemoryPanel";
import { initialBusinessMemory } from "@/components/bizzbrain/data";
import type { BusinessMemoryState } from "@/components/bizzbrain/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BizzBrain — Your Business. In Your Conversation." },
      {
        name: "description",
        content:
          "BizzBrain turns everyday WhatsApp-style chat and voice notes in Malayalam, Tamil, Hindi, or English into sales records, payment reminders and daily profit insights.",
      },
      { property: "og:title", content: "BizzBrain — Your Business. In Your Conversation." },
      {
        property: "og:description",
        content:
          "Speak or drop voice notes, and BizzBrain records the sale, remembers the due, and answers your profit question — in Malayalam, Tamil, Hindi, or English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeThread, setActiveThread] = useState("bizzbrain");
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [businessMemory, setBusinessMemory] = useState<BusinessMemoryState>(initialBusinessMemory);

  function handleNewChat() {
    setActiveThread("bizzbrain");
  }

  return (
    <main className="h-screen w-full bg-background">
      <h1 className="sr-only">BizzBrain — your business, inside your conversation</h1>
      <div className="mx-auto flex h-full max-w-[1600px] overflow-hidden border-x border-hairline bg-card shadow-sm">
        <div className="hidden h-full w-[300px] shrink-0 md:block lg:w-[340px]">
          <ChatList activeId={activeThread} onSelect={setActiveThread} onNewChat={handleNewChat} />
        </div>

        <div className="h-full min-w-0 flex-1">
          <ChatWindow
            memory={businessMemory}
            onUpdateMemory={setBusinessMemory}
            onToggleMemory={() => setMemoryOpen((v) => !v)}
            onNewChat={handleNewChat}
          />
        </div>

        <div className="hidden h-full w-[320px] shrink-0 xl:block">
          <MemoryPanel memory={businessMemory} />
        </div>
      </div>

      {memoryOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end xl:hidden">
          <button
            type="button"
            aria-label="Close business memory"
            onClick={() => setMemoryOpen(false)}
            className="flex-1 bg-foreground/30"
          />
          <div className="h-full w-[320px] max-w-[88vw] animate-fade-up">
            <MemoryPanel memory={businessMemory} />
          </div>
        </div>
      ) : null}
    </main>
  );
}
