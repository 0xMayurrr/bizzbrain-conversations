import { useEffect, useRef, useState } from "react";
import { Check, CheckCheck, Play, Pause, Volume2, FileText, Download, Eye, Camera, ScanLine, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./types";
import { generateSyntheticVoiceAudio } from "./voice-engine";

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

function VoicePlayer({ voice }: { voice: NonNullable<Message["voice"]> }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const src = voice.audioUrl || generateSyntheticVoiceAudio(voice.seconds);
    const audio = new Audio(src);
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [voice.audioUrl, voice.seconds]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn("Audio playback issue:", err);
      });
    }
  };

  const duration = voice.seconds || 5;
  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const activeBars = Math.floor(progressRatio * waveform.length);

  const displayCurrent = Math.floor(currentTime);
  const displaySec = displayCurrent < 10 ? `0:0${displayCurrent}` : `0:${displayCurrent}`;
  const totalSec = duration < 10 ? `0:0${duration}` : `0:${duration}`;

  return (
    <div className="flex flex-col gap-1.5 py-0.5">
      <div className="flex min-w-[240px] items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal text-brand-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
        </button>

        <div className="flex flex-1 flex-col gap-1">
          <div
            className="flex h-6 cursor-pointer items-center gap-[3px]"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              if (audioRef.current) {
                audioRef.current.currentTime = ratio * duration;
                setCurrentTime(audioRef.current.currentTime);
              }
            }}
          >
            {waveform.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}px` }}
                className={cn(
                  "w-[3px] rounded-full transition-colors",
                  i <= activeBars ? "bg-teal" : "bg-foreground/25",
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{isPlaying ? displaySec : totalSec}</span>
            <span className="flex items-center gap-1 text-[10px] text-teal">
              <Volume2 className="size-3" /> Voice Note
            </span>
          </div>
        </div>
      </div>

      {voice.nativeScript ? (
        <div className="rounded-md bg-foreground/[0.04] px-2.5 py-1.5 text-[13px] font-medium leading-snug text-foreground">
          {voice.nativeScript}
        </div>
      ) : null}

      <p className="border-t border-foreground/10 pt-1 text-[12.5px] italic text-muted-foreground">
        “{voice.transcript}”
      </p>
    </div>
  );
}

interface MessageBubbleProps {
  m: Message;
  onViewReport?: () => void;
  onDownloadReport?: () => void;
}

export function MessageBubble({ m, onViewReport, onDownloadReport }: MessageBubbleProps) {
  const mine = m.from === "user";

  return (
    <div className={cn("flex w-full animate-bubble-in", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[88%] rounded-xl px-3 py-2 text-[14.5px] leading-relaxed shadow-[0_1px_1px_rgba(0,0,0,0.08)] sm:max-w-[74%]",
          mine
            ? "rounded-tr-sm bg-bubble-out text-bubble-foreground"
            : "rounded-tl-sm bg-bubble-in text-bubble-foreground",
        )}
      >
        {!mine && !m.card && !m.document ? (
          <p className="mb-0.5 text-[11px] font-semibold text-teal">BizzBrain</p>
        ) : null}

        {m.text ? <p className="whitespace-pre-line">{m.text}</p> : null}

        {m.voice ? <VoicePlayer voice={m.voice} /> : null}

        {/* Structured Card */}
        {m.card ? (
          <div className="min-w-[240px]">
            <div className="flex items-center gap-1.5">
              <p className="text-[15px] font-semibold text-teal">{m.card.title}</p>
              {m.card.badge ? (
                <span className="text-[13px] font-semibold text-leaf-foreground/80 bg-leaf/20 px-1.5 py-0.5 rounded">
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
                      r.strong ? "text-[15px] font-bold text-foreground" : "text-[14px] font-medium",
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

        {/* PDF Document Card (Native WhatsApp document attachment style) */}
        {m.document ? (
          <div className="min-w-[260px] overflow-hidden rounded-lg border border-hairline bg-card/85 mt-1 shadow-xs transition-all hover:bg-card">
            <div
              onClick={onViewReport}
              className="flex items-center gap-3 p-3 cursor-pointer group"
              title="Click to view document"
            >
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-600 dark:text-red-400">
                <FileText className="size-6" />
                <span className="absolute -bottom-1 -right-1 rounded bg-red-600 px-1 py-[1px] text-[8px] font-extrabold uppercase tracking-wider text-white">
                  PDF
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-bold text-foreground group-hover:text-teal transition-colors">
                  {m.document.fileName}
                </p>
                <p className="text-[11.5px] text-muted-foreground mt-0.5">
                  1 page · {m.document.fileSize} · PDF document
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadReport?.();
                }}
                title="Download PDF"
                aria-label="Download PDF"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal hover:bg-teal hover:text-brand-foreground transition-all cursor-pointer"
              >
                <Download className="size-4" />
              </button>
            </div>

            {/* Document summary strip (WhatsApp caption format) */}
            <div className="border-t border-hairline/70 bg-muted/40 px-3 py-2 text-[11.5px]">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Revenue: <strong className="text-foreground">₹{m.document.summary.revenue.toLocaleString("en-IN")}</strong></span>
                <span>Expenses: <strong className="text-foreground">₹{m.document.summary.expenses.toLocaleString("en-IN")}</strong></span>
                <span>Profit: <strong className="text-teal">₹{m.document.summary.profit.toLocaleString("en-IN")}</strong></span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Photo / Menu Card OCR Preview */}
        {m.photo ? (
          <div className="min-w-[260px] overflow-hidden rounded-lg border border-hairline bg-card/80 p-3 mt-1.5 shadow-xs">
            <div className="flex items-center gap-2.5 pb-2 border-b border-hairline/60">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal/15 text-teal">
                <Camera className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">
                  {m.photo.caption || "Scanned Photo"}
                </p>
                <p className="text-[10.5px] text-muted-foreground flex items-center gap-1">
                  <ScanLine className="size-3 text-leaf" /> OCR Rate Extraction
                </p>
              </div>
            </div>

            {/* If there's an image URL */}
            {m.photo.url || m.photo.imageUrl ? (
              <div className="mt-2 overflow-hidden rounded-md border border-hairline bg-muted/40 max-h-48">
                <img
                  src={m.photo.url || m.photo.imageUrl}
                  alt={m.photo.caption || "Uploaded photo"}
                  className="w-full object-cover"
                />
              </div>
            ) : null}

            {/* Extracted items chips */}
            {m.photo.extractedItems && m.photo.extractedItems.length > 0 ? (
              <div className="mt-2.5 space-y-1.5">
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <UtensilsCrossed className="size-3 text-teal" />
                  <span>Detected Catalog Items ({m.photo.extractedItems.length})</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {m.photo.extractedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md bg-muted/70 px-2 py-1 text-xs"
                    >
                      <div className="min-w-0 flex-1 truncate pr-1 text-foreground font-medium">
                        {item.name}
                      </div>
                      <span className="shrink-0 font-bold text-teal tabular-nums">
                        ₹{item.rate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-1 flex items-center justify-end gap-1">
          {m.lang ? (
            <span className="mr-auto rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
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
