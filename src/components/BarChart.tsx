import { formatValue, type ReportResult } from "@/lib/query/engine";

// Single-series horizontal bar chart in plain HTML: one hue (no legend needed;
// the title names the series), ≤24px bars with a rounded data-end, value at
// the tip in ink (never series color), n shown so small groups can't mislead.
// A native title tooltip gives exact values on hover.

export function BarChart({ result, maxRows = 12 }: { result: ReportResult; maxRows?: number }) {
  const rows = result.rows.slice(0, maxRows);
  if (!rows.length) return <p className="text-sm text-ink-3">No youth match this report yet.</p>;
  const max = result.unit === "percent" ? 100 : Math.max(...rows.map((r) => r.value ?? 0), 1);
  return (
    <div className="space-y-2" role="list">
      {rows.map((r) => {
        const pct = r.value === null ? 0 : (r.value / max) * 100;
        return (
          <div key={r.label} role="listitem" className="grid grid-cols-[minmax(0,9rem)_1fr] md:grid-cols-[minmax(0,12rem)_1fr] items-center gap-3" title={`${r.label}: ${formatValue(r.value, result.unit)} (n=${r.n})`}>
            <div className="text-sm text-ink truncate">{r.label}</div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-1 h-5 relative">
                <div className="absolute inset-y-0 left-0 right-0 border-l border-line" />
                <div className="absolute inset-y-0.5 left-0 bg-series-1 rounded-r" style={{ width: `${Math.max(pct, r.value ? 0.8 : 0)}%` }} />
              </div>
              <div className="w-32 shrink-0 whitespace-nowrap text-sm tabular-nums text-ink">
                {formatValue(r.value, result.unit)} <span className="text-xs text-ink-3">n={r.n}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
