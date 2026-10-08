import type { RiskLevel, Stage } from "@/lib/types";

export function Card({ title, action, children, className = "" }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-card border border-line rounded-lg ${className}`}>
      {title && (
        <header className="flex items-center justify-between px-4 pt-3.5 pb-2">
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {action}
        </header>
      )}
      <div className={title ? "px-4 pb-4" : "p-4"}>{children}</div>
    </section>
  );
}

export function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card border border-line rounded-lg px-4 py-3">
      <div className="text-xs text-ink-2">{label}</div>
      <div className="text-2xl font-semibold tabular-nums mt-0.5">{value}</div>
      {sub && <div className="text-xs text-ink-3 mt-0.5">{sub}</div>}
    </div>
  );
}

// Status colors always ship with a text label, never color alone.
const RISK_STYLE: Record<RiskLevel, string> = {
  High: "bg-red-50 text-red-800 ring-red-200",
  Moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  Low: "bg-green-50 text-green-800 ring-green-200",
};

export function RiskBadge({ risk }: { risk?: RiskLevel }) {
  if (!risk) return <span className="text-xs text-ink-3">Not screened</span>;
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${RISK_STYLE[risk]}`}>{risk} risk</span>;
}

export function StageBadge({ stage }: { stage: Stage }) {
  const style =
    stage === "Completed" ? "bg-green-50 text-green-800 ring-green-200"
    : stage === "Discharged" ? "bg-gray-100 text-gray-700 ring-gray-200"
    : "bg-blue-50 text-blue-800 ring-blue-200";
  return <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>{stage}</span>;
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="text-sm text-ink-2 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Loading() {
  return <div className="text-sm text-ink-3">Loading…</div>;
}

export const btn = "inline-flex items-center justify-center rounded-md bg-brand text-white text-sm font-medium px-3 py-2 hover:bg-brand/90 disabled:opacity-50";
export const btnSecondary = "inline-flex items-center justify-center rounded-md border border-line bg-card text-sm font-medium px-3 py-2 hover:bg-surface disabled:opacity-50";
export const input = "w-full rounded-md border border-line bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-series-1/40";
