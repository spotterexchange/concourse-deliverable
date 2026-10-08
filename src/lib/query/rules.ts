import type { ReportSpec } from "./spec";

// Keyword fallback parser. It is used when no model key is configured, the
// model call fails, or the model's output doesn't validate. It covers the
// common phrasings, so the demo never shows a dead end. See ADR-004.

export function parseWithRules(question: string, providerNames: string[]): ReportSpec {
  const q = question.toLowerCase();
  // Match at word starts so "stage" doesn't trigger "age".
  const has = (...words: string[]) =>
    words.some((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(q));

  const metric: ReportSpec["metric"] =
    has("complet", "success", "graduat") ? "completion_rate"
    : has("engag", "show up", "attend", "no-show", "no show") ? "engagement_rate"
    : has("wait", "days to", "time to", "how long", "how fast", "faster", "slow") ? "avg_days_to_treatment"
    : has("high risk", "high-risk") ? "high_risk_rate"
    : has("crafft", "score") ? "avg_crafft_score"
    : "youth_count";

  const group_by: ReportSpec["group_by"] =
    has("by provider", "per provider", "each provider", "providers", "by program") ? "provider"
    : has("pathway", "diversion vs", "by referral source", "by source") ? "pathway"
    : has("by stage", "per stage", "each stage", "pipeline", "funnel") ? "stage"
    : has("case manager", "caseload", "worker", "staff") ? "case_manager"
    : has("by risk", "risk level") ? "risk_level"
    : has("gender", "boys", "girls", "sex") ? "gender"
    : has("age") ? "age_band"
    : has("month", "trend", "over time") ? "referral_month"
    : metric === "youth_count" ? "stage" : "provider";

  const date_range: ReportSpec["date_range"] =
    has("30 days", "this month", "last month") ? "last_30_days"
    : has("90 days", "quarter") ? "last_90_days"
    : has("this year", "ytd", "year to date") ? "this_year"
    : "all";

  const filters: ReportSpec["filters"] = {};
  if (has("diversion")) filters.pathway = "Diversion";
  else if (has("probation")) filters.pathway = "Probation";
  else if (has("family court", "court-ordered", "court ordered")) filters.pathway = "Family Court";
  if (metric !== "high_risk_rate" && has("high risk", "high-risk")) filters.risk_level = "High";
  if (has("open", "active", "current")) filters.open_only = true;
  if (has("girls", "female")) filters.gender = "Female";
  else if (has("boys", "male")) filters.gender = "Male";
  const provider = providerNames.find((n) => q.includes(n.toLowerCase().split(" ")[0]));
  if (provider) filters.provider = provider;
  if (filters.pathway && group_by === "pathway") delete filters.pathway;

  return { title: question.trim().slice(0, 120), metric, group_by, date_range, filters };
}
