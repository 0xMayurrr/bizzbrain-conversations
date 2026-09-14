import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Send,
  Paperclip,
  Camera,
  Search,
  MoreVertical,
  Phone,
  Brain,
  UploadCloud,
  Sparkles,
  X,
  ShieldCheck,
  Plus,
  RotateCcw,
  MessageSquarePlus,
  FileText,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageBubble, TypingBubble } from "./MessageBubble";
import { seedMessages, initialBusinessMemory, cleanBusinessMemory, cleanSeedMessages } from "./data";
import type { BusinessMemoryState, Message, SupportedLanguage } from "./types";
import {
  processVoiceTransaction,
  voicePresets,
  type VoicePreset,
} from "./voice-engine";
import { DailyReportModal, downloadReportHtml } from "./DailyReportModal";

function nowLabel() {
  return new Date()
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();
}

const suggestions = [
  "Hi, I want to onboard my new business",
  "My store name is Grand Kerala Bakery, Kochi",
  "Uploaded menu card photo. Extract items and prices.",
  "Register shop GSTIN 32BBBBB1111B2Z6",
  "Sugar stock kitna bacha hai?",
  "Close shop for today and send the daily PDF report.",
  "Innu 60 chaya vittu, onninu 15 roopa.",
];

interface ChatWindowProps {
  memory: BusinessMemoryState;
  onUpdateMemory: (updater: (prev: BusinessMemoryState) => BusinessMemoryState) => void;
  onToggleMemory: () => void;
  onNewChat?: () => void;
}

export function ChatWindow({ memory, onUpdateMemory, onToggleMemory, onNewChat }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>("Malayalam");
  const [showPresetsBar, setShowPresetsBar] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  /**
   * Reset conversation and memory for a clean demo
   */
  function handleStartNewChat(mode: "clean" | "seed" = "clean") {
    setShowMoreMenu(false);
    if (mode === "clean") {
      setMessages([
        {
          id: `b-welcome-${Date.now()}`,
          from: "bot",
          time: nowLabel(),
          text: "👋 *Namaskaram!* Fresh BizzBrain demo session started.\n\nType or speak in **Malayalam, Tamil, Hindi, or English** to test live sales entry, inventory checks, menu photo OCR, or daily profit statements!",
        },
      ]);
      onUpdateMemory(() => cleanBusinessMemory);
    } else {
      setMessages(seedMessages);
      onUpdateMemory(() => initialBusinessMemory);
    }
    onNewChat?.();
  }

  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);
  const liveRecognizedTextRef = useRef<string>("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  function markRead(id: string) {
    window.setTimeout(
      () =>
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "read" as const } : m)),
        ),
      800,
    );
  }

  /**
   * Dispatches text message through transaction engine
   */
  function sendText(text?: string) {
    const body = (text ?? draft).trim();
    if (!body) return;

    const id = `u-${Date.now()}`;
    const result = processVoiceTransaction(body, memory);

    setMessages((prev) => [
      ...prev,
      {
        id,
        from: "user",
        time: nowLabel(),
        status: "sent",
        text: body,
        lang: result.detectedLang,
      },
    ]);
    setDraft("");
    markRead(id);

    // Update business memory in backend state
    onUpdateMemory(() => result.updatedMemory);

    // Trigger BizzBrain response
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          from: "bot",
          time: nowLabel(),
          ...result.botReply,
        },
      ]);
    }, 1200);
  }

  /**
   * Processes an incoming voice note (via drop, upload, record, or preset)
   */
  function handleVoiceInput(
    transcript: string,
    options?: {
      nativeScript?: string | undefined;
      audioUrl?: string | undefined;
      seconds?: number | undefined;
      forcedLang?: SupportedLanguage | undefined;
    },
  ) {
    const id = `u-${Date.now()}`;
    const result = processVoiceTransaction(transcript, memory, options);

    const voicePayload = {
      seconds: result.seconds,
      transcript: result.transcript,
      language: result.detectedLang,
      ...(result.nativeScript !== undefined ? { nativeScript: result.nativeScript } : {}),
      ...(result.audioUrl !== undefined ? { audioUrl: result.audioUrl } : {}),
    };

    // Add user voice bubble
    setMessages((prev) => [
      ...prev,
      {
        id,
        from: "user",
        time: nowLabel(),
        status: "sent",
        voice: voicePayload,
        lang: `${result.detectedLang} · voice`,
      },
    ]);
    markRead(id);

    // Sync business memory in state
    onUpdateMemory(() => result.updatedMemory);

    // Bot response with typing simulation
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          from: "bot",
          time: nowLabel(),
          ...result.botReply,
        },
      ]);
    }, 1300);
  }

  /**
   * Start live microphone recording
   */
  async function startRecording() {
    setRecSeconds(0);
    audioChunksRef.current = [];
    liveRecognizedTextRef.current = "";

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.start();
        setRecording(true);

        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRec) {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          const langMap: Record<SupportedLanguage, string> = {
            Malayalam: "ml-IN",
            Tamil: "ta-IN",
            Hindi: "hi-IN",
            English: "en-IN",
          };
          rec.lang = langMap[selectedLang] || "ml-IN";
          rec.onresult = (event: any) => {
            let fullText = "";
            for (let i = 0; i < event.results.length; ++i) {
              fullText += event.results[i][0].transcript;
            }
            if (fullText) liveRecognizedTextRef.current = fullText;
          };
          try {
            rec.start();
            speechRecognitionRef.current = rec;
          } catch {}
        }
      } else {
        setRecording(true);
      }
    } catch (err) {
      console.warn("Mic access not granted, running simulated recording:", err);
      setRecording(true);
    }
  }

  /**
   * Stop recording and send audio
   */
  function stopRecording(send_: boolean) {
    const seconds = Math.max(1, Math.min(12, recSeconds));
    setRecording(false);
    setRecSeconds(0);

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }

    if (!send_) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      return;
    }

    let recordedAudioUrl = "";
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        recordedAudioUrl = URL.createObjectURL(audioBlob);
        dispatchVoice();
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      dispatchVoice();
    }

    function dispatchVoice() {
      const defaultPreset: VoicePreset = voicePresets[0]!;
      const matched = voicePresets.find((p) => p.language === selectedLang) ?? defaultPreset;

      const liveText = liveRecognizedTextRef.current.trim();
      if (liveText) {
        handleVoiceInput(liveText, {
          seconds,
          audioUrl: recordedAudioUrl || undefined,
          forcedLang: selectedLang,
        });
      } else {
        handleVoiceInput(matched.transcript, {
          nativeScript: matched.nativeScript,
          seconds,
          audioUrl: recordedAudioUrl || undefined,
          forcedLang: selectedLang,
        });
      }
    }
  }

  /**
   * Handle uploaded or dropped photo (e.g. Menu card or GST document)
   */
  function handleImageFile(file: File) {
    const imageUrl = URL.createObjectURL(file);
    const id = `u-${Date.now()}`;
    const time = nowLabel();

    setMessages((prev) => [
      ...prev,
      {
        id,
        from: "user",
        time,
        status: "sent",
        text: "Uploaded menu card photo. Please scan and extract items and prices.",
        photo: {
          url: imageUrl,
          caption: file.name,
        },
        lang: "Menu OCR",
      },
    ]);
    markRead(id);

    const result = processVoiceTransaction(
      "Uploaded menu card photo. Please extract all food items and prices.",
      memory
    );

    onUpdateMemory(() => result.updatedMemory);

    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          from: "bot",
          time: nowLabel(),
          ...result.botReply,
        },
      ]);
    }, 1400);
  }

  /**
   * Handle dropped audio files
   */
  function handleAudioFile(file: File) {
    const audioUrl = URL.createObjectURL(file);
    const fileName = file.name.toLowerCase();

    let lang: SupportedLanguage = selectedLang;
    if (fileName.includes("malayalam") || fileName.includes("chaya")) lang = "Malayalam";
    else if (fileName.includes("tamil") || fileName.includes("tea")) lang = "Tamil";
    else if (fileName.includes("hindi") || fileName.includes("samosa") || fileName.includes("sugar")) lang = "Hindi";
    else if (fileName.includes("english")) lang = "English";

    const defaultPreset: VoicePreset = voicePresets[0]!;
    const preset = voicePresets.find((p) => p.language === lang) ?? defaultPreset;

    handleVoiceInput(preset.transcript, {
      nativeScript: preset.nativeScript,
      seconds: preset.seconds,
      audioUrl,
      forcedLang: lang,
    });
  }

  return (
    <section
      className="relative flex h-full min-w-0 flex-col"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDraggingOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(
          (f) => f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(f.name),
        );
        const audioFile = files.find(
          (f) => f.type.startsWith("audio/") || /\.(mp3|wav|m4a|ogg|webm|aac)$/i.test(f.name),
        );
        if (imageFile) {
          handleImageFile(imageFile);
        } else if (audioFile) {
          handleAudioFile(audioFile);
        }
      }}
    >
      {/* Hidden file input for audio or image attachments */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (file.type.startsWith("image/")) {
              handleImageFile(file);
            } else {
              handleAudioFile(file);
            }
          }
          e.target.value = "";
        }}
      />

      {/* Daily Report Full Modal */}
      <DailyReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        memory={memory}
      />


      {/* Drag and drop overlay */}
      {isDraggingOver ? (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand/90 backdrop-blur-sm transition-all">
          <div className="flex size-20 items-center justify-center rounded-full bg-leaf text-leaf-foreground shadow-2xl animate-bounce">
            <UploadCloud className="size-10" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-brand-foreground">Drop Voice Note or Menu Photo Here</h2>
          <p className="mt-1 text-sm text-brand-foreground/80">
            Accepts Malayalam, Tamil, Hindi, English audio, or menu card photos (.jpg, .png)
          </p>
          <div className="mt-4 flex gap-2">
            {["Audio Notes", "Menu Photos", "GST Docs"].map((l) => (
              <span key={l} className="rounded-full bg-card/20 px-3 py-1 text-xs font-semibold text-brand-foreground">
                {l}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* WhatsApp Business Header */}
      <header className="flex items-center gap-3 border-b border-hairline bg-brand px-4 py-2.5 shadow-xs">
        <div className="relative flex size-10 items-center justify-center rounded-full bg-leaf text-sm font-bold text-leaf-foreground shadow-xs">
          BB
          <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-brand p-0.5">
            <ShieldCheck className="size-3 text-leaf" />
          </span>
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[15px] font-semibold text-brand-foreground">BizzBrain</p>
            <span className="rounded bg-leaf/20 px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-wider text-leaf-foreground">
              Official Business
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-[11.5px] text-brand-foreground/80 mt-0.5">
            <span className="inline-block size-1.5 rounded-full bg-leaf animate-pulse" />
            online · Malayalam, Tamil, Hindi, English
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-brand-foreground/85">
          <button
            type="button"
            onClick={() => handleStartNewChat("clean")}
            title="Start New Chat (Fresh Demo)"
            className="flex items-center gap-1.5 rounded-full bg-leaf px-3 py-1.5 text-xs font-semibold text-leaf-foreground transition-all hover:bg-leaf/90 active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>New Chat</span>
          </button>

          <button
            type="button"
            onClick={onToggleMemory}
            title="View Live Business Memory"
            aria-label="Toggle business memory"
            className="flex items-center gap-1 rounded-full p-2 transition-colors hover:bg-brand-foreground/15 xl:hidden cursor-pointer"
          >
            <Brain className="size-[18px]" />
          </button>
          <button
            type="button"
            title="Audio Call"
            aria-label="Audio call"
            className="rounded-full p-2 transition-colors hover:bg-brand-foreground/15 cursor-pointer"
          >
            <Phone className="size-[18px]" />
          </button>
          <button
            type="button"
            title="Search Chat"
            aria-label="Search chat"
            className="rounded-full p-2 transition-colors hover:bg-brand-foreground/15 cursor-pointer"
          >
            <Search className="size-[18px]" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu((v) => !v)}
              title="More Options"
              aria-label="More options"
              className="rounded-full p-2 transition-colors hover:bg-brand-foreground/15 cursor-pointer"
            >
              <MoreVertical className="size-[18px]" />
            </button>

            {showMoreMenu ? (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-hairline bg-popover p-1.5 shadow-2xl animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => handleStartNewChat("clean")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
                  >
                    <Plus className="size-4 text-leaf" />
                    <span>New Chat (Fresh Clean Slate)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartNewChat("seed")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
                  >
                    <RotateCcw className="size-4 text-teal" />
                    <span>Reload Sample Seed Demo</span>
                  </button>
                  <div className="my-1 border-t border-hairline" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setReportModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
                  >
                    <FileText className="size-4 text-amber-500" />
                    <span>View Daily Report Statement</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onToggleMemory();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-accent cursor-pointer"
                  >
                    <Brain className="size-4 text-primary" />
                    <span>Toggle Business Memory</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Messages canvas */}
      <div className="chat-canvas scroll-slim flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="mx-auto mb-2 rounded-md bg-bubble-in/90 px-3 py-1 text-[11.5px] font-medium text-muted-foreground shadow-sm">
            Today
          </div>
          <div className="mx-auto mb-3 max-w-md rounded-lg bg-bubble-in/85 border border-hairline/60 px-3.5 py-2 text-center text-[11.5px] leading-relaxed text-muted-foreground shadow-xs">
            <span className="font-semibold text-foreground">Official WhatsApp Business Account:</span> This chat uses BizzBrain AI to automate your sales ledger, stock queries, catalog extraction, and statutory GST reminders.
          </div>

          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              m={m}
              onViewReport={() => setReportModalOpen(true)}
              onDownloadReport={() => downloadReportHtml(memory)}
            />
          ))}
          {typing ? <TypingBubble /> : null}
          <div ref={endRef} />
        </div>
      </div>

      {/* Quick Voice Demo Presets Toolbar */}
      {showPresetsBar ? (
        <div className="border-t border-hairline/80 bg-muted/60 px-3 py-2">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground">
              <Sparkles className="size-3.5 text-teal" />
              <span>Quick Test Presets:</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPresetsBar(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close presets bar"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="scroll-slim mx-auto mt-1.5 flex max-w-3xl gap-2 overflow-x-auto pb-1">
            {voicePresets.map((p: VoicePreset) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedLang(p.language);
                  handleVoiceInput(p.transcript, {
                    nativeScript: p.nativeScript,
                    seconds: p.seconds,
                    forcedLang: p.language,
                  });
                }}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 text-[12px] font-medium text-foreground shadow-xs transition-all hover:border-teal hover:bg-accent/40 active:scale-95 cursor-pointer"
              >
                <span className="rounded bg-teal/15 px-1.5 py-0.5 text-[10px] font-bold text-teal">
                  {p.flag}
                </span>
                <span className="font-semibold text-teal">{p.language}:</span>
                <span className="max-w-[210px] truncate text-muted-foreground group-hover:text-foreground">
                  {p.transcript}
                </span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  0:0{p.seconds}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* WhatsApp Quick Replies / Suggested Prompts */}
      <div className="scroll-slim flex items-center gap-2 overflow-x-auto border-t border-hairline bg-panel px-3 py-2">
        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
          Suggested:
        </span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => sendText(s)}
            className="shrink-0 rounded-full border border-hairline bg-card px-3 py-1 text-[12px] font-medium text-foreground shadow-xs transition-colors hover:border-teal hover:bg-accent hover:text-accent-foreground cursor-pointer"
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
            <span className="text-[13px] font-medium tabular-nums text-foreground">
              Recording ({selectedLang}) 0:{recSeconds.toString().padStart(2, "0")}
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
              className="rounded-full px-2 py-1 text-[12.5px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => stopRecording(true)}
              aria-label="Send voice message"
              className="flex size-10 items-center justify-center rounded-full bg-teal text-brand-foreground transition-transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <Send className="size-[18px]" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendText();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex flex-1 items-end gap-2 rounded-3xl bg-muted px-3 py-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload photo"
                title="Upload menu card photo or tax document"
                className="p-1 text-muted-foreground transition-colors hover:text-teal cursor-pointer"
              >
                <Camera className="size-[19px]" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
                title="Attach audio note or document"
                className="p-1 text-muted-foreground transition-colors hover:text-teal cursor-pointer"
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
                    sendText();
                  }
                }}
                placeholder="Type a message or send voice note..."
                className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-[14.5px] outline-none placeholder:text-muted-foreground"
              />
            </div>

            <button
              type={draft.trim() ? "submit" : "button"}
              onClick={() => {
                if (!draft.trim()) startRecording();
              }}
              aria-label={draft.trim() ? "Send message" : "Record voice message"}
              title={draft.trim() ? "Send" : "Hold or click to record voice note"}
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full bg-teal text-brand-foreground shadow-sm transition-all hover:brightness-110 active:scale-95 cursor-pointer",
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
