import { useEffect, useRef, useState } from "react";
import { Mic, Send, Paperclip, Smile, Search, MoreVertical, Phone, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageBubble, TypingBubble } from "./MessageBubble";
import { fallbackReply, scriptedReplies, seedMessages } from "./data";
import type { Message } from "./types";

function nowLabel() {
  return new Date()
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();
}

const suggestions = [
  "Innaiku 20 coffee vithen, one 20 rupees.",
  "Murugan ku next week 40k pay pannanum.",
  "Innaiku profit evlo?",
  "Sugar stock kitna bacha hai?",
];

export function ChatWindow({ onToggleMemory }: { onToggleMemory: () => void }) {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  function respondTo(text: string) {
    setTyping(true);
    const picked = scriptedReplies.find((r) => r.match.test(text))?.reply ?? fallbackReply;
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, from: "bot", time: nowLabel(), ...picked },
      ]);
    }, 1500);
  }

  function markRead(id: string) {
    window.setTimeout(
      () =>
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "read" as const } : m)),
        ),
      800,
    );
  }

  function send(text?: string) {
    const body = (text ?? draft).trim();
    if (!body) return;
    const id = `u-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id, from: "user", time: nowLabel(), status: "sent", text: body },
    ]);
    setDraft("");
    markRead(id);
    respondTo(body);
  }

  function stopRecording(send_: boolean) {
    const seconds = Math.max(1, Math.min(9, recSeconds));
    setRecording(false);
    setRecSeconds(0);
    if (!send_) return;
    const transcript = "Innaiku 8 kg sugar vanginen, 45 rupees kilo.";
    const id = `u-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id,
        from: "user",
        time: nowLabel(),
        status: "sent",
        voice: { seconds, transcript },
        lang: "Tanglish · voice",
      },
    ]);
    markRead(id);
    respondTo(transcript);
  }

  return (
    <section className="flex h-full min-w-0 flex-col">
      {/* Conversation header */}
      <header className="flex items-center gap-3 border-b border-hairline bg-brand px-4 py-2.5">
        <div className="flex size-10 items-center justify-center rounded-full bg-leaf text-sm font-bold text-leaf-foreground">
          BB
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[15px] font-semibold text-brand-foreground">BizzBrain</p>
          <p className="flex items-center gap-1.5 text-[11.5px] text-brand-foreground/75">
            <span className="inline-block size-1.5 rounded-full bg-leaf" />
            online · understands Tamil, Hindi & English
          </p>
        </div>
        <div className="flex items-center gap-1 text-brand-foreground/80">
          <button
            type="button"
            onClick={onToggleMemory}
            aria-label="Toggle business memory"
            className="rounded-full p-2 transition-colors hover:bg-brand-foreground/10 xl:hidden"
          >
            <Brain className="size-[18px]" />
          </button>
          {[Phone, Search, MoreVertical].map((Icon, i) => (
            <button
              key={i}
              type="button"
              aria-label="Chat action"
              className="rounded-full p-2 transition-colors hover:bg-brand-foreground/10"
            >
              <Icon className="size-[18px]" />
            </button>
          ))}
        </div>
      </header>

      {/* Messages */}
      <div className="chat-canvas scroll-slim flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="mx-auto mb-2 rounded-md bg-bubble-in/90 px-3 py-1 text-[11.5px] font-medium text-muted-foreground shadow-sm">
            Today
          </div>
          <div className="mx-auto mb-3 max-w-md rounded-md bg-accent/70 px-3 py-2 text-center text-[11.5px] leading-relaxed text-accent-foreground">
            Messages are understood, recorded and remembered by BizzBrain. Talk the way you already
            talk.
          </div>
          {messages.map((m) => (
            <MessageBubble key={m.id} m={m} />
          ))}
          {typing ? <TypingBubble /> : null}
          <div ref={endRef} />
        </div>
      </div>

      {/* Suggestions */}
      <div className="scroll-slim flex gap-2 overflow-x-auto border-t border-hairline bg-panel px-4 py-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="shrink-0 rounded-full border border-hairline bg-muted px-3 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Composer */}
      <footer className="border-t border-hairline bg-panel px-3 py-2.5 sm:px-4">
        {recording ? (
          <div className="flex items-center gap-3 rounded-full bg-muted px-4 py-2.5">
            <span className="size-2.5 animate-pulse rounded-full bg-destructive" />
            <span className="text-[13px] font-medium tabular-nums">
              Recording 0:{recSeconds.toString().padStart(2, "0")}
            </span>
            <div className="flex flex-1 items-center gap-[3px]">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  style={{ animationDelay: `${(i % 7) * 0.1}s`, height: `${6 + ((i * 5) % 16)}px` }}
                  className="w-[3px] animate-blink rounded-full bg-teal"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => stopRecording(false)}
              className="rounded-full px-2 py-1 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => stopRecording(true)}
              aria-label="Send voice message"
              className="flex size-10 items-center justify-center rounded-full bg-teal text-brand-foreground transition-transform hover:scale-105"
            >
              <Send className="size-[18px]" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex flex-1 items-end gap-2 rounded-3xl bg-muted px-3 py-2">
              <button
                type="button"
                aria-label="Emoji"
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Smile className="size-[20px]" />
              </button>
              <button
                type="button"
                aria-label="Attach"
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Paperclip className="size-[19px]" />
              </button>
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type a message — Tamil, Tanglish, Hindi or English"
                className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-[14.5px] outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type={draft.trim() ? "submit" : "button"}
              onClick={() => {
                if (!draft.trim()) setRecording(true);
              }}
              aria-label={draft.trim() ? "Send message" : "Record voice message"}
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full bg-teal text-brand-foreground shadow-sm transition-all hover:brightness-110 active:scale-95",
              )}
            >
              {draft.trim() ? <Send className="size-[19px]" /> : <Mic className="size-[20px]" />}
            </button>
          </form>
        )}
      </footer>
    </section>
  );
}

export { Square };
