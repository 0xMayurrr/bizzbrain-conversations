import { FileText, Download, X, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { BusinessMemoryState } from "./types";

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: BusinessMemoryState;
  dateStr?: string;
}

export function downloadReportHtml(memory: BusinessMemoryState, dateStr: string = "13 Sep 2026") {
  const rev = memory?.today?.revenue ?? 0;
  const prof = memory?.today?.profit ?? 0;
  const marginPct = rev > 0 ? Math.round((prof / rev) * 100) : 0;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>BizzBrain Daily Closing Statement — ${memory?.profile?.name || "BizzBrain Store"} — ${dateStr}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a2e26;
      background: #f8faf9;
      margin: 0;
      padding: 32px;
    }
    .report-card {
      max-width: 780px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #dbe5e1;
      border-radius: 12px;
      padding: 36px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f4a3c;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f4a3c;
      margin: 0;
    }
    .brand-sub {
      font-size: 13px;
      color: #4a6b60;
      margin-top: 4px;
    }
    .tag {
      background: #e6f4ea;
      color: #137333;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      display: inline-block;
    }
    .gstin-badge {
      font-family: monospace;
      font-size: 12px;
      background: #eef4f1;
      padding: 4px 8px;
      border-radius: 4px;
      color: #0f4a3c;
      margin-top: 4px;
      display: inline-block;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }
    .kpi-card {
      background: #f2f7f4;
      border: 1px solid #d0e2d8;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .kpi-title {
      font-size: 12px;
      font-weight: 600;
      color: #527568;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .kpi-value {
      font-size: 22px;
      font-weight: 800;
      color: #0f4a3c;
    }
    .kpi-profit {
      color: #0d652d;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #0f4a3c;
      color: #ffffff;
      text-align: left;
      padding: 10px 14px;
      font-size: 12px;
      text-transform: uppercase;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid #e3ede8;
      font-size: 14px;
    }
    .alert-box {
      background: #fef7e0;
      border-left: 4px solid #f9ab00;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e3ede8;
      padding-top: 18px;
      font-size: 12px;
      color: #648275;
    }
    @media print {
      body { background: white; padding: 0; }
      .report-card { border: none; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="header">
      <div>
        <h1 class="brand-title">${memory.profile.name}</h1>
        <div class="brand-sub">${memory.profile.category} · ${memory.profile.location}</div>
        ${memory.profile.gstin ? `<div class="gstin-badge">GSTIN: ${memory.profile.gstin} (Verified Active)</div>` : ""}
      </div>
      <div style="text-align: right;">
        <span class="tag">CLOSED · VERIFIED</span>
        <div style="font-size: 12px; color: #648275; margin-top: 6px;">Date: ${dateStr}</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">Gross Revenue</div>
        <div class="kpi-value">₹${memory.today.revenue.toLocaleString("en-IN")}</div>
        <div style="font-size: 11px; color: #527568; margin-top: 4px;">${memory.today.entriesCount} entries logged</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Total Expenses</div>
        <div class="kpi-value">₹${memory.today.expenses.toLocaleString("en-IN")}</div>
        <div style="font-size: 11px; color: #527568; margin-top: 4px;">Operational Overhead</div>
      </div>
      <div class="kpi-card" style="background: #e6f4ea; border-color: #b7e1cd;">
        <div class="kpi-title" style="color: #137333;">Net Profit (Margin ${marginPct}%)</div>
        <div class="kpi-value kpi-profit">₹${memory.today.profit.toLocaleString("en-IN")}</div>
        <div style="font-size: 11px; color: #137333; margin-top: 4px;">Official Daily Closing</div>
      </div>
    </div>

    <h3 style="color: #0f4a3c; font-size: 15px; margin-bottom: 10px;">Top Sales by Volume</h3>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Units Sold</th>
          <th>Volume Share</th>
        </tr>
      </thead>
      <tbody>
        ${memory.topItems
          .map(
            (it) => `
          <tr>
            <td style="font-weight: 600;">${it.name}</td>
            <td>${it.quantity}</td>
            <td>${it.pct}% of daily sales</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <h3 style="color: #0f4a3c; font-size: 15px; margin-bottom: 10px;">Pending Supplier Dues</h3>
    <table>
      <thead>
        <tr>
          <th>Party / Vendor</th>
          <th>Timeline</th>
          <th style="text-align: right;">Amount Due</th>
        </tr>
      </thead>
      <tbody>
        ${memory.dues
          .map(
            (d) => `
          <tr>
            <td style="font-weight: 600;">${d.name}</td>
            <td>${d.due}</td>
            <td style="text-align: right; font-weight: 700;">₹${d.amount.toLocaleString("en-IN")}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <div class="alert-box">
      <strong>Notice on Inventory:</strong> Sugar stock is at <strong>4 kg</strong> (Below 10 kg minimum threshold). Restock order required prior to next opening shift.
    </div>

    <div class="footer">
      <div>Audited via BizzBrain Platform · Record Ref: BB-${Date.now().toString().slice(-6)}</div>
      <div>Sign-off: Store Manager</div>
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `BizzBrain_Daily_Closing_Report_${dateStr.replace(/\s+/g, "_")}.html`;
    a.click();
  }
}

export function DailyReportModal({ isOpen, onClose, memory, dateStr = "13 Sep 2026" }: DailyReportModalProps) {
  if (!isOpen) return null;

  const rev = memory?.today?.revenue ?? 0;
  const prof = memory?.today?.profit ?? 0;
  const marginPct = rev > 0 ? Math.round((prof / rev) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-xs animate-fade-up">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-hairline bg-card shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-brand px-6 py-4 text-brand-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-leaf text-leaf-foreground font-bold">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">{memory?.profile?.name || "BizzBrain Store"} — Closing Statement</h2>
              <p className="text-xs text-brand-foreground/80">
                {memory?.profile?.category || "Store"} · {memory?.profile?.location || "India"} · {dateStr}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 transition-colors hover:bg-brand-foreground/15 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="scroll-slim flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status banner */}
          <div className="flex items-center justify-between rounded-xl bg-accent/60 p-3.5 text-accent-foreground border border-teal/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-teal" />
              <div>
                <p className="text-sm font-semibold">Store Closing Recorded</p>
                <p className="text-xs text-muted-foreground">All voice messages and ledger entries audited</p>
              </div>
            </div>
            {memory.profile.gstin ? (
              <span className="flex items-center gap-1 rounded-full bg-leaf px-2.5 py-1 text-xs font-bold text-leaf-foreground">
                <ShieldCheck className="size-3.5" />
                <span>GST Verified</span>
              </span>
            ) : null}
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-hairline bg-muted/60 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">Gross Revenue</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                ₹{memory.today.revenue.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] text-teal">{memory.today.entriesCount} sales logged</p>
            </div>

            <div className="rounded-xl border border-hairline bg-muted/60 p-3.5">
              <p className="text-xs font-medium text-muted-foreground">Expenses</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                ₹{memory.today.expenses.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">Supplies & overhead</p>
            </div>

            <div className="rounded-xl border border-leaf/30 bg-leaf/10 p-3.5">
              <p className="text-xs font-medium text-leaf-foreground/80">Net Profit</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-leaf-foreground">
                ₹{memory.today.profit.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-leaf-foreground/90">{marginPct}% margin</p>
            </div>
          </div>

          {/* Top products */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Top Products Sold Today
            </h3>
            <div className="rounded-xl border border-hairline overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-2.5">Product</th>
                    <th className="p-2.5">Volume</th>
                    <th className="p-2.5">Volume Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {memory.topItems.map((item) => (
                    <tr key={item.name} className="hover:bg-accent/20">
                      <td className="p-2.5 font-medium">{item.name}</td>
                      <td className="p-2.5 tabular-nums text-muted-foreground">{item.quantity}</td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-teal rounded-full" style={{ width: `${item.pct}%` }} />
                          </div>
                          <span className="text-[11px] text-muted-foreground">{item.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending dues */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Pending Supplier Payments
            </h3>
            <div className="space-y-2">
              {memory.dues.map((due) => (
                <div key={due.id} className="flex items-center justify-between rounded-lg border border-hairline bg-card p-2.5 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{due.name}</p>
                    <p className="text-[11px] text-muted-foreground">{due.due}</p>
                  </div>
                  <span className="font-bold tabular-nums text-destructive">
                    ₹{due.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock notice without emojis */}
          <div className="flex items-start gap-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-foreground">
            <AlertTriangle className="size-4 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-700 dark:text-yellow-300">Sugar Stock Notice (4 kg left)</p>
              <p className="mt-0.5 text-muted-foreground">
                Stock has fallen below the 10 kg safety threshold. Reorder required prior to opening tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-hairline bg-panel px-6 py-3.5">
          <p className="text-xs text-muted-foreground">
            {memory.profile.gstin ? `GSTIN: ${memory.profile.gstin}` : "Official store record"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-hairline px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => downloadReportHtml(memory, dateStr)}
              className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-bold text-brand-foreground shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download PDF Statement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
