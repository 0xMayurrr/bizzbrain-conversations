import { Check, CheckCheck, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./types";

function Ticks({ status }: { status?: Message["status"] }) {
  if (!status) return null;
  if (status === "sent") return <Check className="size-3.5 text-muted-foreground" />;
  return (
    <CheckCheck
      className={cn("size-3.5", status === "read" ? "text-tick" : "text-muted-foreground")}
    />
  );
}

const waveform = [6, 11, 16, 9, 20, 14, 7, 17, 12, 22, 9, 15, 6, 13, 18, 8, 14, 10, 19, 7];

export function MessageBubble({ m }: { m: Message }) {
  const mine = m.from === "user";

  return (
    <div className={cn("flex w-full animate-bubble-in", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[78%] rounded-xl px-3 py-2 text-[14.5px] leading-relaxed shadow-[0_1px_1px_rgba(0,0,0,0.08)] sm:max-w-[68%]",
          mine
            ? "rounded-tr-sm bg-bubble-out text-bubble-foreground"
            : "rounded-tl-sm bg-bubble-in text-bubble-foreground",
        )}
      >
        {!mine && !m.card ? (
          <p className="mb-0.5 text-[11px] font-semibold text-teal">BizzBrain</p>
        ) : null}

        {m.text ? <p className="whitespace-pre-line">{m.text}</p> : null}

        {m.voice ? (
          <div className="flex min-w-[220px] items-center gap-3 py-0.5">
            <button
              type="button"
              aria-label="Play voice message"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal text-brand-foreground"
            >
              <Play className="size-4 fill-current" />
            </button>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex h-6 items-center gap-[3px]">
                {waveform.map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className={cn(
                      "w-[3px] rounded-full",
                      i < 8 ? "bg-teal" : "bg-foreground/25",
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">0:0{m.voice.seconds}</span>
            </div>
          </div>
        ) : null}

        {m.voice ? (
          <p className="mt-1 border-t border-foreground/10 pt-1.5 text-[13px] italic text-muted-foreground">
            “{m.voice.transcript}”
          </p>
        ) : null}

        {m.card ? (
          <div className="min-w-[230px]">
            <div className="flex items-center gap-1.5">
              <p className="text-[15px] font-semibold text-teal">{m.card.title}</p>
              {m.card.badge ? (
                <span className="text-[15px] font-semibold text-leaf-foreground/80">
                  {m.card.badge}
                </span>
              ) : null}
            </div>
            <dl className="mt-1.5 space-y-1">
              {m.card.rows.map((r) => (
                <div
                  key={r.label}
                  className={cn(
                    "flex items-baseline justify-between gap-6",
                    r.strong && "mt-1.5 border-t border-foreground/10 pt-1.5",
                  )}
                >
                  <dt className="text-[13px] text-muted-foreground">{r.label}</dt>
                  <dd
                    className={cn(
                      "tabular-nums",
                      r.strong ? "text-[15px] font-bold" : "text-[14px] font-medium",
                    )}
                  >
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
            {m.card.footnote ? (
              <p className="mt-2 text-[11.5px] text-muted-foreground">{m.card.footnote}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-1 flex items-center justify-end gap-1">
          {m.lang ? (
            <span className="mr-auto rounded-full bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {m.lang}
            </span>
          ) : null}
          <span className="text-[10.5px] text-muted-foreground">{m.time}</span>
          <Ticks status={m.status} />
        </div>
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex animate-bubble-in justify-start">
      <div className="flex items-center gap-1.5 rounded-xl rounded-tl-sm bg-bubble-in px-4 py-3 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.16}s` }}
            className="size-1.5 animate-blink rounded-full bg-teal"
          />
        ))}
      </div>
    </div>
  );
}
