import {
  Brain,
  CalendarClock,
  Languages,
  TrendingUp,
  Package,
  Mic,
  Building2,
  ShieldCheck,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import type { BusinessMemoryState } from "./types";

function Section({
  icon: Icon,
  title,
  badge,
  children,
}: {
  icon: typeof Brain;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-hairline px-4 py-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-teal" />
          <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h3>
        </div>
        {badge ? (
          <span className="rounded-full bg-leaf/20 px-2 py-0.5 text-[10.5px] font-bold text-leaf-foreground">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const pipeline = [
  "Voice / Photo Input",
  "OCR & Language NLU",
  "Business Memory",
  "Tax & Ledger Engine",
  "Real-Time Insights & Reports",
];

export function MemoryPanel({ memory }: { memory: BusinessMemoryState }) {
  const profile = memory.profile || {
    name: "Vasantham Tea & Snacks",
    category: "Tea & Snacks",
    location: "Madurai, Tamil Nadu",
    closingTime: "10:30 PM",
    gstin: "33AAAAA0000A1Z5",
    gstFilingFrequency: "Monthly",
  };

  return (
    <aside className="scroll-slim h-full w-full overflow-y-auto border-l border-hairline bg-panel">
      <header className="flex items-center justify-between border-b border-hairline bg-brand px-4 py-[13px]">
        <div className="flex items-center gap-2">
          <Brain className="size-[18px] text-brand-foreground" />
          <div>
            <p className="text-sm font-semibold text-brand-foreground">Business Memory</p>
            <p className="text-[11px] text-brand-foreground/75">Auto-synced from conversations</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-leaf px-2 py-0.5 text-[10.5px] font-bold text-leaf-foreground">
          <Mic className="size-3" /> Live
        </span>
      </header>

      {/* Business Identity Card */}
      <Section icon={Building2} title="Store Profile" badge="Active">
        <div className="rounded-lg border border-hairline bg-card/60 p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[14px] font-bold text-foreground leading-snug">{profile.name}</p>
              <p className="text-[11px] text-muted-foreground">{profile.category} · {profile.location}</p>
            </div>
            <span className="shrink-0 rounded bg-teal/15 px-1.5 py-0.5 text-[10px] font-semibold text-teal">
              {profile.closingTime ? `Closes ${profile.closingTime}` : "Daily EOD"}
            </span>
          </div>

          {profile.gstin ? (
            <div className="flex items-center justify-between rounded-md bg-muted/60 px-2.5 py-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-leaf" />
                <span className="font-mono text-[11px] font-semibold text-foreground">
                  {profile.gstin}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-leaf">Verified GSTIN</span>
            </div>
          ) : null}
        </div>
      </Section>

      {/* GST Compliance & Filing Reminders */}
      <Section
        icon={ShieldCheck}
        title="GST & Compliance"
        badge={`${memory.gstReminders?.length || 2} Alerts`}
      >
        <div className="space-y-2">
          {memory.gstReminders && memory.gstReminders.length > 0 ? (
            memory.gstReminders.map((gst) => (
              <div
                key={gst.id}
                className="rounded-lg border border-hairline bg-card/60 p-2.5 flex items-start justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[13px] text-foreground">{gst.filingName}</span>
                    <span className="text-[10.5px] text-muted-foreground">({gst.period})</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="size-3 text-teal" /> Due: {gst.dueDate}
                  </p>
                  {gst.estimatedTax ? (
                    <p className="text-[10.5px] text-muted-foreground mt-0.5 font-medium">
                      Est. Tax: ₹{gst.estimatedTax.toLocaleString("en-IN")}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10.5px] font-bold ${
                    gst.status === "Filed"
                      ? "bg-muted text-muted-foreground"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {gst.status === "Filed" ? "Filed" : `${gst.daysRemaining} days left`}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-muted/60 p-2.5 text-center text-xs text-muted-foreground">
              No active GST filing alerts configured
            </div>
          )}
          <p className="text-[10.5px] text-muted-foreground">
            Automated alerts scheduled for GSTR-1 (11th) & GSTR-3B (20th) of every month.
          </p>
        </div>
      </Section>

      {/* Menu & Rates Catalog */}
      <Section
        icon={UtensilsCrossed}
        title="Store Catalog"
        badge={`${memory.menuCatalog?.length || 0} Items`}
      >
        <div className="space-y-1.5">
          <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-0.5 scroll-slim">
            {(memory.menuCatalog ?? []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-md bg-muted/70 px-2.5 py-1.5 text-xs"
              >
                <div className="min-w-0 flex-1 truncate text-foreground font-medium">
                  {item.name}
                  {item.category ? (
                    <span className="text-[10px] text-muted-foreground ml-1.5">({item.category})</span>
                  ) : null}
                </div>
                <span className="shrink-0 font-bold text-teal tabular-nums">
                  ₹{item.rate}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10.5px] text-muted-foreground">
            Populated from menu card photo scans or spoken sale notes.
          </p>
        </div>
      </Section>

      {/* Today at a glance */}
      <Section icon={TrendingUp} title="Today at a glance" badge={`+${memory?.today?.entriesCount ?? 0} entries`}>
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Revenue", v: `₹${(memory?.today?.revenue ?? 0).toLocaleString("en-IN")}` },
            { k: "Expenses", v: `₹${(memory?.today?.expenses ?? 0).toLocaleString("en-IN")}` },
            { k: "Profit", v: `₹${(memory?.today?.profit ?? 0).toLocaleString("en-IN")}` },
          ].map((s) => (
            <div key={s.k} className="rounded-lg bg-muted px-2 py-2">
              <p className="text-[10.5px] text-muted-foreground">{s.k}</p>
              <p className="mt-0.5 text-[13px] font-bold tabular-nums text-foreground">{s.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Updated instantly when voice messages are processed
        </p>
      </Section>

      {/* Pending payments */}
      <Section icon={CalendarClock} title="Pending payments" badge={`${(memory?.dues ?? []).length} active`}>
        <ul className="space-y-2.5">
          {(memory?.dues ?? []).map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-2 border-b border-hairline/60 pb-2 last:border-none last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.due}</p>
              </div>
              <span className="shrink-0 text-[13px] font-bold tabular-nums text-primary">
                ₹{p.amount.toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Top items today */}
      <Section icon={Package} title="Top items today">
        <div className="space-y-2.5">
          {(memory?.topItems ?? []).map((i) => (
            <div key={i.name}>
              <div className="flex justify-between text-[12.5px]">
                <span className="font-medium text-foreground">{i.name}</span>
                <span className="text-muted-foreground tabular-nums">{i.quantity}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-leaf transition-all duration-500"
                  style={{ width: `${Math.max(8, i.pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Understood languages */}
      <Section icon={Languages} title="Understood languages">
        <div className="flex flex-wrap gap-1.5">
          {[
            { name: "Malayalam", native: "മലയാളം" },
            { name: "Tamil", native: "தமிழ்" },
            { name: "Hindi", native: "हिंदी" },
            { name: "English", native: "EN" },
          ].map((l) => (
            <span
              key={l.name}
              className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11.5px] font-medium text-accent-foreground"
            >
              <span>{l.name}</span>
              <span className="text-[10px] opacity-75">({l.native})</span>
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Voice notes in Malayalam, Tamil, Hindi, or English automatically transcribe and update your business records.
        </p>
      </Section>

      {/* Pipeline */}
      <section className="px-4 py-4">
        <h3 className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
          How it flows
        </h3>
        <ol className="space-y-1.5">
          {pipeline.map((p, i) => (
            <li key={p} className="flex items-center gap-2 text-foreground">
              <span className="flex size-5 items-center justify-center rounded-full bg-teal text-[10.5px] font-bold text-brand-foreground">
                {i + 1}
              </span>
              <span className="text-[12.5px] font-medium">{p}</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
