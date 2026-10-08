// Report-builder question corpus for the stress test (tests/stress.test.ts) and
// the opt-in model eval (scripts/eval-model.ts). Kept free of test() calls so
// the eval script can import it without running the suite.
import type { ReportSpec } from "../src/lib/query/spec";

// ── S1. Evaluator question corpus ────────────────────────────────────────────
// Phrased the way DOH program staff and evaluators talk (RFP §I, §V, Proposal
// Content §5–6). Expected fields are the minimum a correct reading must get.
export type Expect = Partial<Pick<ReportSpec, "metric" | "group_by" | "date_range">> & { filters?: ReportSpec["filters"] };
export const CORPUS: [string, Expect][] = [
  ["Which treatment providers have the best completion rates?", { metric: "completion_rate", group_by: "provider" }],
  ["How long do kids wait between referral and their first appointment at each provider?", { metric: "avg_days_to_treatment", group_by: "provider" }],
  ["What percent of referred youth actually show up to treatment, by provider?", { metric: "engagement_rate", group_by: "provider" }],
  ["How many youth are on each case manager's caseload?", { metric: "youth_count", group_by: "case_manager" }],
  ["How many active cases do we have by stage?", { metric: "youth_count", group_by: "stage", filters: { open_only: true } }],
  ["Completion rate for diversion youth by provider", { metric: "completion_rate", group_by: "provider", filters: { pathway: "Diversion" } }],
  ["Do probation youth complete treatment at a lower rate than diversion youth?", { metric: "completion_rate", group_by: "pathway" }],
  ["What share of screened youth are high risk on the CRAFFT?", { metric: "high_risk_rate" }],
  ["Average CRAFFT score by age group", { metric: "avg_crafft_score", group_by: "age_band" }],
  ["How many new referrals did we get each month?", { metric: "youth_count", group_by: "referral_month" }],
  ["Referrals in the last 30 days by pathway", { metric: "youth_count", group_by: "pathway", date_range: "last_30_days" }],
  ["Completion rate this quarter", { metric: "completion_rate", date_range: "last_90_days" }],
  ["How many girls are currently in treatment?", { metric: "youth_count", filters: { gender: "Female", stage: "In Treatment" } }],
  ["How many youth were referred from family court this year?", { metric: "youth_count", date_range: "this_year", filters: { pathway: "Family Court" } }],
  ["Engagement rate for high-risk youth by provider", { metric: "engagement_rate", group_by: "provider", filters: { risk_level: "High" } }],
  ["Is Northgate slower than other providers to see kids?", { metric: "avg_days_to_treatment", group_by: "provider" }],
  ["Completion rate at Kestrel Family Therapy", { metric: "completion_rate", filters: { provider: "Kestrel Family Therapy" } }],
  ["How many youth dropped out or were discharged?", { metric: "youth_count", filters: { stage: "Discharged" } }],
  ["How many youth have finished the program successfully?", { metric: "youth_count", filters: { stage: "Completed" } }],
  ["Outcomes by gender", { metric: "completion_rate", group_by: "gender" }],
  ["Breakdown of risk levels for youth on probation", { metric: "youth_count", group_by: "risk_level", filters: { pathway: "Probation" } }],
  ["How many youth are still waiting for a first appointment?", { metric: "youth_count", filters: { stage: "Referred to Treatment" } }],
  ["Which case managers have the most high-risk youth?", { metric: "youth_count", group_by: "case_manager", filters: { risk_level: "High" } }],
  ["no-show rate by provider", { metric: "engagement_rate", group_by: "provider" }],
  ["average days to treatment for 16 and 17 year olds", { metric: "avg_days_to_treatment" }],
  ["How are boys doing compared to girls on completion?", { metric: "completion_rate", group_by: "gender" }],
  ["Completion rate by month", { metric: "completion_rate", group_by: "referral_month" }],
  ["Total youth served", { metric: "youth_count", group_by: "none" }],
  ["Show me the intake funnel", { metric: "youth_count", group_by: "stage" }],
  ["What is our overall success rate?", { metric: "completion_rate", group_by: "none" }],
];

export function matches(spec: ReportSpec, e: Expect) {
  const misses: string[] = [];
  for (const k of ["metric", "group_by", "date_range"] as const) if (e[k] && spec[k] !== e[k]) misses.push(`${k}=${spec[k]} (want ${e[k]})`);
  for (const [k, v] of Object.entries(e.filters ?? {})) {
    if ((spec.filters as Record<string, unknown>)[k] !== v) misses.push(`filters.${k}=${(spec.filters as Record<string, unknown>)[k]} (want ${v})`);
  }
  return misses;
}

// ── S1b. Held-out questions ─────────────────────────────────────────────────
// Written after the rules were tuned on S1 and never tuned against. This is the
// honest estimate of fallback quality; the threshold is deliberately lower.
export const HELD_OUT: [string, Expect][] = [
  ["Which program gets kids into treatment fastest?", { metric: "avg_days_to_treatment" }],
  ["How many youth does Priya have?", { metric: "youth_count" }],
  ["Percentage of youth completing treatment by entry pathway", { metric: "completion_rate", group_by: "pathway" }],
  ["How many high risk youth do we have right now?", { metric: "youth_count", filters: { risk_level: "High", open_only: true } }],
  ["Which providers lose the most kids before the first visit?", { metric: "engagement_rate", group_by: "provider" }],
  ["Average screening score for girls", { metric: "avg_crafft_score", filters: { gender: "Female" } }],
  ["Monthly referral volume", { metric: "youth_count", group_by: "referral_month" }],
  ["How many youth came in through diversion in the last 90 days?", { metric: "youth_count", date_range: "last_90_days", filters: { pathway: "Diversion" } }],
  ["Completion rate for Cedar Hollow", { metric: "completion_rate", filters: { provider: "Cedar Hollow Residential" } }],
  ["Show attendance at first appointments by risk level", { metric: "engagement_rate", group_by: "risk_level" }],
  ["How many cases are open per case manager?", { metric: "youth_count", group_by: "case_manager", filters: { open_only: true } }],
  ["What portion of screened kids score high risk, by pathway?", { metric: "high_risk_rate", group_by: "pathway" }],
];

