import type { Dataset, Youth } from "../types";
import { CLOSED_STAGES } from "../types";
import type { ReportSpec } from "./spec";

// Deterministic report engine. The metric definitions live here, in code, so
// "completion rate" means the same thing in the dashboard, the report builder,
// and an exported CSV. The model chooses *which* report; it never computes one.

export interface ReportRow {
  label: string;
  value: number | null; // null = not enough data in this group
  n: number; // denominator, shown so small groups can't mislead
}

export interface ReportResult {
  rows: ReportRow[];
  unit: "count" | "percent" | "days" | "score";
  totalN: number;
}

const DAY = 86_400_000;
const latestReferral = (y: Youth) => y.referrals[y.referrals.length - 1];

function inRange(y: Youth, range: ReportSpec["date_range"], now: number) {
  const t = Date.parse(y.referralDate);
  switch (range) {
    case "last_30_days": return now - t <= 30 * DAY;
    case "last_90_days": return now - t <= 90 * DAY;
    case "this_year": return new Date(t).getFullYear() === new Date(now).getFullYear();
    default: return true;
  }
}

function groupKey(y: Youth, spec: ReportSpec, names: Map<string, string>): string[] {
  switch (spec.group_by) {
    case "provider": {
      const r = latestReferral(y);
      // Youth never referred to treatment have no provider; leave them out of provider comparisons.
      return r ? [names.get(r.providerId) ?? "Unknown"] : [];
    }
    case "pathway": return [y.pathway];
    case "stage": return [y.stage];
    case "case_manager": return [names.get(y.caseManagerId) ?? "Unassigned"];
    case "risk_level": return [y.riskLevel ?? "Not yet screened"];
    case "gender": return [y.gender];
    case "age_band": return [y.age <= 15 ? "13–15" : y.age <= 17 ? "16–17" : "18–19"];
    case "referral_month": return [y.referralDate.slice(0, 7)];
    default: return ["All youth"];
  }
}

/** Each metric: which youth it applies to, and how to aggregate them. */
const METRIC_IMPL: Record<ReportSpec["metric"], { unit: ReportResult["unit"]; eligible: (y: Youth) => boolean; value: (ys: Youth[]) => number | null }> = {
  youth_count: { unit: "count", eligible: () => true, value: (ys) => ys.length },
  completion_rate: {
    unit: "percent",
    eligible: (y) => CLOSED_STAGES.includes(y.stage),
    value: (ys) => (ys.length ? (100 * ys.filter((y) => y.stage === "Completed").length) / ys.length : null),
  },
  engagement_rate: {
    unit: "percent",
    // Only referrals whose outcome is known: engaged, or closed without engaging.
    eligible: (y) => { const r = latestReferral(y); return !!r && (!!r.firstAppointment || r.status === "Dropped"); },
    value: (ys) => (ys.length ? (100 * ys.filter((y) => !!latestReferral(y)?.firstAppointment).length) / ys.length : null),
  },
  avg_days_to_treatment: {
    unit: "days",
    eligible: (y) => !!latestReferral(y)?.firstAppointment,
    value: (ys) => {
      if (!ys.length) return null;
      const d = ys.map((y) => { const r = latestReferral(y)!; return (Date.parse(r.firstAppointment!) - Date.parse(r.date)) / DAY; });
      return d.reduce((a, b) => a + b, 0) / d.length;
    },
  },
  high_risk_rate: {
    unit: "percent",
    eligible: (y) => y.screenings.length > 0,
    value: (ys) => (ys.length ? (100 * ys.filter((y) => y.riskLevel === "High").length) / ys.length : null),
  },
  avg_crafft_score: {
    unit: "score",
    eligible: (y) => y.screenings.length > 0,
    value: (ys) => (ys.length ? ys.reduce((a, y) => a + y.screenings[y.screenings.length - 1].score, 0) / ys.length : null),
  },
};

export function runReport(spec: ReportSpec, ds: Dataset, now = Date.now()): ReportResult {
  const f = spec.filters ?? {};
  const providerId = f.provider
    ? ds.providers.find((p) => p.name.toLowerCase().includes(f.provider!.toLowerCase()))?.id
    : undefined;
  const impl = METRIC_IMPL[spec.metric];
  // A provider the user named but we can't find means "no rows", never "no filter".
  if (f.provider && !providerId) return { rows: [], unit: impl.unit, totalN: 0 };

  const population = ds.youth.filter(
    (y) =>
      inRange(y, spec.date_range, now) &&
      (!f.pathway || y.pathway === f.pathway) &&
      (!f.risk_level || y.riskLevel === f.risk_level) &&
      (!f.stage || y.stage === f.stage) &&
      (!f.gender || y.gender === f.gender) &&
      (!f.provider || latestReferral(y)?.providerId === providerId) &&
      (!f.open_only || !CLOSED_STAGES.includes(y.stage)) &&
      impl.eligible(y),
  );

  const names = new Map([...ds.providers, ...ds.caseManagers].map((x) => [x.id, x.name]));
  const groups = new Map<string, Youth[]>();
  for (const y of population) {
    for (const k of groupKey(y, spec, names)) {
      const g = groups.get(k);
      if (g) g.push(y); else groups.set(k, [y]);
    }
  }

  let rows: ReportRow[] = [...groups.entries()].map(([label, ys]) => ({ label, value: impl.value(ys), n: ys.length }));
  rows = spec.group_by === "referral_month"
    ? rows.sort((a, b) => a.label.localeCompare(b.label))
    : rows.sort((a, b) => (b.value ?? -1) - (a.value ?? -1));

  return { rows, unit: impl.unit, totalN: population.length };
}

export function formatValue(v: number | null, unit: ReportResult["unit"]) {
  if (v === null) return "—";
  switch (unit) {
    case "percent": return `${Math.round(v)}%`;
    case "days": return `${v.toFixed(1)} days`;
    case "score": return v.toFixed(1);
    default: return v.toLocaleString();
  }
}
