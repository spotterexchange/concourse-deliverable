import { z } from "zod";
import { PATHWAYS, RISK_LEVELS, STAGES, GENDERS } from "../types";

// The report builder's contract. The language model only ever produces one of
// these small JSON objects. It never sees case records. The app validates the
// object and runs it locally (engine.ts) over data that never leaves the browser.
// See docs/DECISIONS.md ADR-004.

export const METRICS = {
  youth_count: "Number of youth",
  completion_rate: "Completion rate (% of closed cases that completed)",
  engagement_rate: "Engagement rate (% of treatment referrals that attended a first appointment)",
  avg_days_to_treatment: "Average days from treatment referral to first appointment",
  high_risk_rate: "% of screened youth scoring high risk on CRAFFT",
  avg_crafft_score: "Average CRAFFT score",
} as const;

export const GROUP_BYS = {
  none: "No grouping",
  provider: "Treatment provider",
  pathway: "Entry pathway",
  stage: "Current stage",
  case_manager: "Case manager",
  risk_level: "Risk level",
  gender: "Gender",
  age_band: "Age band (13–15, 16–17, 18–19)",
  referral_month: "Month referred",
} as const;

export const DATE_RANGES = {
  all: "All time",
  last_30_days: "Referred in last 30 days",
  last_90_days: "Referred in last 90 days",
  this_year: "Referred this calendar year",
} as const;

const keys = <T extends object>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

export const ReportSpecSchema = z.object({
  title: z.string().max(120),
  metric: z.enum(keys(METRICS)),
  group_by: z.enum(keys(GROUP_BYS)).default("none"),
  date_range: z.enum(keys(DATE_RANGES)).default("all"),
  filters: z
    .object({
      pathway: z.enum(PATHWAYS).optional(),
      risk_level: z.enum(RISK_LEVELS).optional(),
      stage: z.enum(STAGES).optional(),
      gender: z.enum(GENDERS).optional(),
      provider: z.string().optional(), // provider name, matched loosely
      open_only: z.boolean().optional(),
    })
    .default({}),
});

export type ReportSpec = z.infer<typeof ReportSpecSchema>;

/**
 * Compact schema description for the model prompt. Kept deliberately terse.
 * Every token here is paid on every uncached request (free-tier budget).
 */
export function schemaPrompt(providerNames: string[]) {
  return [
    `metric: ${Object.keys(METRICS).join("|")}`,
    `group_by: ${Object.keys(GROUP_BYS).join("|")}`,
    `date_range: ${Object.keys(DATE_RANGES).join("|")}`,
    `filters (all optional): pathway: ${PATHWAYS.join("|")}; risk_level: ${RISK_LEVELS.join("|")}; stage: ${STAGES.join("|")}; gender: ${GENDERS.join("|")}; provider: ${providerNames.join("|")}; open_only: boolean`,
    `title: short chart title`,
  ].join("\n");
}
