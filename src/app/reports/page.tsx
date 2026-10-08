"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { BarChart } from "@/components/BarChart";
import { Card, Loading, PageHeader, btn, btnSecondary, input } from "@/components/ui";
import { formatValue, runReport } from "@/lib/query/engine";
import { DATE_RANGES, GROUP_BYS, METRICS, type ReportSpec } from "@/lib/query/spec";
import { useStore } from "@/lib/store";

// "Ask a report": the RFP's "does not require excessive coding by the end-user to
// create … reports". Flow: question → /api/report (model or rules) → ReportSpec →
// runReport() here in the browser. The interpretation is shown back to the
// user as editable chips, so a misread question is visible and fixable,
// not silently wrong (ADR-004).

type Source = "model" | "rules" | "cache" | "preset" | "edited";

// Presets carry their spec, so clicking one costs zero model tokens (ADR-005).
const PRESETS: { q: string; spec: ReportSpec }[] = [
  { q: "Completion rate by provider", spec: { title: "Completion rate by provider", metric: "completion_rate", group_by: "provider", date_range: "all", filters: {} } },
  { q: "Average days to first appointment by provider", spec: { title: "Average days from referral to first appointment, by provider", metric: "avg_days_to_treatment", group_by: "provider", date_range: "all", filters: {} } },
  { q: "Are diversion youth more likely to complete than probation youth?", spec: { title: "Completion rate by entry pathway", metric: "completion_rate", group_by: "pathway", date_range: "all", filters: {} } },
  { q: "High-risk share of screened youth by age band", spec: { title: "% high risk on CRAFFT, by age band", metric: "high_risk_rate", group_by: "age_band", date_range: "all", filters: {} } },
  { q: "New referrals per month", spec: { title: "Youth referred per month", metric: "youth_count", group_by: "referral_month", date_range: "all", filters: {} } },
];

const CLIENT_CACHE = "intercept.reportCache.v1";

function ReportBuilder() {
  const { data } = useStore();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<ReportSpec | null>(null);
  const [source, setSource] = useState<{ kind: Source; note?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [asTable, setAsTable] = useState(false);

  const ask = useCallback(async (question: string) => {
    const preset = PRESETS.find((p) => p.q.toLowerCase() === question.trim().toLowerCase());
    setQ(question);
    if (preset) { setSpec(preset.spec); setSource({ kind: "preset" }); return; }
    const key = question.trim().toLowerCase();
    try {
      const cached = JSON.parse(localStorage.getItem(CLIENT_CACHE) ?? "{}")[key];
      if (cached) { setSpec(cached); setSource({ kind: "cache" }); return; }
    } catch { /* ignore */ }
    setBusy(true);
    try {
      const res = await fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSpec(json.spec);
      setSource({ kind: json.source, note: json.reason ?? (json.model ? `${json.model}${json.usage ? ` · ${json.usage} tokens` : ""}` : undefined) });
      if (json.source === "model") {
        try {
          const all = JSON.parse(localStorage.getItem(CLIENT_CACHE) ?? "{}");
          localStorage.setItem(CLIENT_CACHE, JSON.stringify({ ...all, [key]: json.spec }));
        } catch { /* ignore */ }
      }
    } catch (e) {
      setSource({ kind: "rules", note: String(e) });
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { const initial = params.get("q"); if (initial) ask(initial); }, [params, ask]);

  const result = useMemo(() => (spec && data ? runReport(spec, data) : null), [spec, data]);
  if (!data) return <Loading />;

  const edit = (patch: Partial<ReportSpec>) => { setSpec((s) => (s ? { ...s, ...patch } : s)); setSource({ kind: "edited" }); };
  const downloadCsv = () => {
    if (!result || !spec) return;
    const csv = ["group,value,n", ...result.rows.map((r) => `"${r.label}",${r.value ?? ""},${r.n}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${spec.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`;
    a.click();
  };
  const sourceLabel: Record<Source, string> = {
    model: "Interpreted by AI", rules: "Interpreted by keyword rules", cache: "Interpreted earlier (cached)", preset: "Saved report", edited: "Edited by you",
  };

  return (
    <>
      <PageHeader title="Ask a report" sub="Ask about outcomes in plain English. No query language, no vendor ticket." />
      <form className="flex gap-2 mb-3" onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q); }}>
        <input className={input} value={q} maxLength={200} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Which providers have the best completion rate for high-risk youth?" aria-label="Question" />
        <button className={btn} disabled={busy || !q.trim()}>{busy ? "Thinking…" : "Ask"}</button>
      </form>
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => (
          <button key={p.q} onClick={() => ask(p.q)} className="text-xs rounded-full border border-line bg-card px-3 py-1 hover:bg-surface">{p.q}</button>
        ))}
      </div>

      {spec && result && (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h2 className="font-semibold">{spec.title}</h2>
            <div className="flex gap-2">
              <button className={btnSecondary} onClick={() => setAsTable((t) => !t)}>{asTable ? "Chart" : "Table"}</button>
              <button className={btnSecondary} onClick={downloadCsv}>Download CSV</button>
            </div>
          </div>
          {source && <p className="text-xs text-ink-3 mb-3">{sourceLabel[source.kind]}{source.note ? ` · ${source.note}` : ""} · computed in your browser from {result.totalN} matching youth</p>}

          {/* The interpretation, editable: makes a misread visible and fixable. */}
          <div className="flex flex-wrap gap-2 mb-5 text-xs">
            <Chip label="Measure" value={spec.metric} options={METRICS} onChange={(v) => edit({ metric: v as ReportSpec["metric"] })} />
            <Chip label="Grouped by" value={spec.group_by} options={GROUP_BYS} onChange={(v) => edit({ group_by: v as ReportSpec["group_by"] })} />
            <Chip label="Time" value={spec.date_range} options={DATE_RANGES} onChange={(v) => edit({ date_range: v as ReportSpec["date_range"] })} />
            {Object.entries(spec.filters ?? {}).filter(([, v]) => v !== undefined && v !== false).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-md bg-surface border border-line px-2 py-1">
                {k.replace("_", " ")}: <strong>{String(v)}</strong>
                <button aria-label={`Remove ${k} filter`} className="text-ink-3 hover:text-ink ml-1" onClick={() => edit({ filters: { ...spec.filters, [k]: undefined } })}>×</button>
              </span>
            ))}
          </div>

          {asTable ? (
            <table className="w-full text-sm tabular-nums">
              <thead className="text-xs text-ink-2 text-left"><tr className="border-b border-line"><th className="py-1.5 font-medium">{GROUP_BYS[spec.group_by]}</th><th className="py-1.5 font-medium text-right">Value</th><th className="py-1.5 font-medium text-right">n</th></tr></thead>
              <tbody>{result.rows.map((r) => <tr key={r.label} className="border-b border-line last:border-0"><td className="py-1.5">{r.label}</td><td className="text-right">{formatValue(r.value, result.unit)}</td><td className="text-right text-ink-2">{r.n}</td></tr>)}</tbody>
            </table>
          ) : (
            <BarChart result={result} maxRows={24} />
          )}
          <p className="text-xs text-ink-3 mt-4">{METRICS[spec.metric]}. Groups with fewer than 5 youth should be read with caution.</p>
        </Card>
      )}
    </>
  );
}

function Chip({ label, value, options, onChange }: { label: string; value: string; options: Record<string, string>; onChange: (v: string) => void }) {
  return (
    <label className="inline-flex items-center gap-1 rounded-md bg-surface border border-line pl-2">
      {label}:
      <select className="bg-transparent font-semibold py-1 pr-1 focus:outline-none" value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </label>
  );
}

export default function ReportsPage() {
  return <Suspense fallback={<Loading />}><ReportBuilder /></Suspense>;
}
