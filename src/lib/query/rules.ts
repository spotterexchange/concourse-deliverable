import type { ReportSpec } from "./spec";

// Keyword fallback parser: zero tokens. Used when no model key is configured,
// the daily model budget is spent, the model fails, or its output doesn't
// validate. Tuned against the evaluator question corpus in
// tests/stress.test.ts (S1), so the demo degrades gracefully. See ADR-004.

const SHARE_WORDS = ["share", "percent", "%", "proportion", "rate", "fraction"];

export function parseWithRules(question: string, providerNames: string[]): ReportSpec {
  const q = question.toLowerCase();
  // Match at word starts so "stage" doesn't trigger "age".
  const has = (...words: string[]) =>
    words.some((w) => new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(q));

  const counting = has("how many", "number of", "count", "total", "most", "fewest", "breakdown", "referrals", "funnel", "pipeline") && !has("how long");
  const highRisk = has("high risk", "high-risk");

  const metric: ReportSpec["metric"] =
    highRisk && has(...SHARE_WORDS) && !has("engag", "complet", "show up", "wait") ? "high_risk_rate"
    : counting ? "youth_count"
    : has("how long", "wait", "days to", "time to", "slower", "faster", "slow", "to see", "first appointment") ? "avg_days_to_treatment"
    : has("engag", "show up", "no-show", "no show", "attend") ? "engagement_rate"
    : has("complet", "success", "finish", "graduat", "outcome", "doing") ? "completion_rate"
    : has("crafft", "score") ? "avg_crafft_score"
    : "youth_count";

  const both = (a: string[], b: string[]) => has(...a) && has(...b);
  const comparing = has("compared", " vs", "versus", "than other", "than diversion", "than probation");

  const group_by: ReportSpec["group_by"] =
    has("providers", "by provider", "each provider", "per provider", "other provider", "by program") ? "provider"
    : has("pathway") || both(["diversion"], ["probation"]) || both(["court"], ["diversion", "probation"]) ? "pathway"
    : has("case manager", "caseload", "worker", "staff") ? "case_manager"
    : has("gender", "by sex") || both(["boys", "male"], ["girls", "female"]) ? "gender"
    : has("age group", "age band", "by age", "each age") ? "age_band"
    : has("by stage", "each stage", "per stage", "funnel", "pipeline") ? "stage"
    : has("risk level", "by risk", "risk breakdown") ? "risk_level"
    : has("month", "trend", "over time") ? "referral_month"
    : "none";

  const date_range: ReportSpec["date_range"] =
    has("30 days", "this month", "last month") ? "last_30_days"
    : has("90 days", "quarter") ? "last_90_days"
    : has("this year", "ytd", "year to date") ? "this_year"
    : "all";

  const filters: ReportSpec["filters"] = {};
  if (group_by !== "pathway") {
    if (has("diversion")) filters.pathway = "Diversion";
    else if (has("probation")) filters.pathway = "Probation";
    else if (has("family court", "court-ordered", "court ordered")) filters.pathway = "Family Court";
  }
  if (metric !== "high_risk_rate" && highRisk) filters.risk_level = "High";
  if (group_by !== "gender") {
    if (has("girls", "female")) filters.gender = "Female";
    else if (has("boys", "male")) filters.gender = "Male";
  }
  // Stage filters only make sense when counting people in a stage.
  if (metric === "youth_count") {
    if (has("in treatment")) filters.stage = "In Treatment";
    else if (has("discharged", "dropped out", "drop out")) filters.stage = "Discharged";
    else if (has("finished", "completed", "graduated")) filters.stage = "Completed";
    else if (has("waiting", "awaiting", "first appointment")) filters.stage = "Referred to Treatment";
  }
  if (has("active", "open", "current", "still")) filters.open_only = true;
  if (group_by !== "provider" && !comparing) {
    const provider = providerNames.find((n) => has(n.toLowerCase().split(" ")[0]));
    if (provider) filters.provider = provider;
  }

  return { title: question.trim().slice(0, 120), metric, group_by, date_range, filters };
}
