import { Brain, CalendarClock, Languages, TrendingUp, Package } from "lucide-react";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Brain;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-hairline px-4 py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className="size-4 text-teal" />
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

const pipeline = ["WhatsApp", "BizzBrain AI", "Records", "Memory", "Insights"];

export function MemoryPanel() {
  return (
    <aside className="scroll-slim h-full w-full overflow-y-auto border-l border-hairline bg-panel">
      <header className="flex items-center gap-2 border-b border-hairline bg-brand px-4 py-[14px]">
        <Brain className="size-[18px] text-brand-foreground" />
        <div>
          <p className="text-sm font-semibold text-brand-foreground">Business Memory</p>
          <p className="text-[11px] text-brand-foreground/70">Built from your conversations</p>
        </div>
      </header>

      <Section icon={TrendingUp} title="Today at a glance">
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Revenue", v: "₹18,500" },
            { k: "Expenses", v: "₹4,200" },
            { k: "Profit", v: "₹14,300" },
          ].map((s) => (
            <div key={s.k} className="rounded-lg bg-muted px-2.5 py-2">
              <p className="text-[10.5px] text-muted-foreground">{s.k}</p>
              <p className="mt-0.5 text-[13.5px] font-bold tabular-nums">{s.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground">63 entries logged by voice & text</p>
      </Section>

      <Section icon={CalendarClock} title="Pending payments">
        <ul className="space-y-2">
          {[
            { n: "Murugan — Supplier", a: "₹40,000", d: "Due next week · 19 Sep" },
            { n: "Milk vendor", a: "₹6,800", d: "Due Monday" },
            { n: "Shop rent", a: "₹12,000", d: "Due 1 Oct" },
          ].map((p) => (
            <li key={p.n} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-medium">{p.n}</p>
                <p className="text-[11px] text-muted-foreground">{p.d}</p>
              </div>
              <span className="text-[13px] font-bold tabular-nums">{p.a}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Package} title="Top items today">
        {[
          { n: "Tea", q: "212 cups", pct: 88 },
          { n: "Vada", q: "96 pcs", pct: 54 },
          { n: "Coffee", q: "61 cups", pct: 34 },
        ].map((i) => (
          <div key={i.n} className="mb-2.5 last:mb-0">
            <div className="flex justify-between text-[12.5px]">
              <span className="font-medium">{i.n}</span>
              <span className="text-muted-foreground tabular-nums">{i.q}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-leaf" style={{ width: `${i.pct}%` }} />
            </div>
          </div>
        ))}
      </Section>

      <Section icon={Languages} title="Understood languages">
        <div className="flex flex-wrap gap-1.5">
          {["Tamil", "Tanglish", "Hindi", "English"].map((l) => (
            <span
              key={l}
              className="rounded-full bg-accent px-2.5 py-1 text-[11.5px] font-medium text-accent-foreground"
            >
              {l}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          Switch language mid-sentence — BizzBrain keeps up.
        </p>
      </Section>

      <section className="px-4 py-4">
        <h3 className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
          How it flows
        </h3>
        <ol className="space-y-1.5">
          {pipeline.map((p, i) => (
            <li key={p} className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-teal text-[10.5px] font-bold text-brand-foreground">
                {i + 1}
              </span>
              <span className="text-[13px] font-medium">{p}</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
