import { Search, MessageSquarePlus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { threads } from "./data";

const accentClass: Record<string, string> = {
  brand: "bg-brand text-brand-foreground",
  teal: "bg-teal text-brand-foreground",
  leaf: "bg-leaf text-leaf-foreground",
};

export function ChatList({
  activeId,
  onSelect,
  onNewChat,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat?: () => void;
}) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-hairline bg-panel">
      <header className="flex items-center justify-between gap-3 border-b border-hairline bg-brand px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-leaf text-sm font-bold text-leaf-foreground">
            BB
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-brand-foreground">BizzBrain</p>
            <p className="text-[11px] text-brand-foreground/70">Your Business. In Your Conversation.</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-brand-foreground/80">
          <button
            type="button"
            onClick={onNewChat}
            title="Start New Chat (Fresh Demo)"
            aria-label="New chat"
            className="rounded-full p-2 transition-colors hover:bg-brand-foreground/10 cursor-pointer"
          >
            <MessageSquarePlus className="size-[18px]" />
          </button>
        </div>
      </header>

      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-muted px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search chats or ask BizzBrain"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          aria-label="Filter"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
        >
          <Filter className="size-4" />
        </button>
      </div>

      <nav className="scroll-slim flex-1 overflow-y-auto pb-3">
        {threads.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
                active ? "bg-accent" : "hover:bg-muted",
              )}
            >
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  accentClass[t.accent ?? "brand"],
                )}
              >
                {t.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <span
                    className={cn(
                      "shrink-0 text-[11px]",
                      t.unread ? "font-semibold text-primary" : "text-muted-foreground",
                    )}
                  >
                    {t.time}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] text-muted-foreground">{t.preview}</p>
                  {t.unread ? (
                    <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-leaf px-1.5 text-[11px] font-bold text-leaf-foreground">
                      {t.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <footer className="border-t border-hairline px-4 py-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Connected to <span className="font-semibold text-foreground">WhatsApp Business</span> ·
          demo workspace
        </p>
      </footer>
    </aside>
  );
}
