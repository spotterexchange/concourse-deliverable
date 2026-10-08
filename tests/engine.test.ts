import { test } from "node:test";
import assert from "node:assert/strict";
import { generateDataset } from "../src/lib/seed";
import { runReport } from "../src/lib/query/engine";
import { parseWithRules } from "../src/lib/query/rules";
import { ReportSpecSchema } from "../src/lib/query/spec";
import { scoreCrafft } from "../src/lib/crafft";

const NOW = Date.parse("2026-10-08T12:00:00Z");
const ds = generateDataset(NOW);
const names = ds.providers.map((p) => p.name);

test("seed is deterministic", () => {
  assert.deepEqual(generateDataset(NOW).youth.map((y) => y.stage), ds.youth.map((y) => y.stage));
});

test("CRAFFT: CAR only when no Part A use; >=2 is high risk", () => {
  assert.deepEqual(scoreCrafft({ a1: false, a2: false, a3: false, c: true, r: true }), { score: 1, risk: "Moderate" });
  assert.deepEqual(scoreCrafft({ a1: true, c: true, r: true }), { score: 2, risk: "High" });
  assert.deepEqual(scoreCrafft({ a1: true }), { score: 0, risk: "Low" });
});

test("completion rate only counts closed cases", () => {
  const r = runReport({ title: "", metric: "completion_rate", group_by: "none", date_range: "all", filters: {} }, ds, NOW);
  const closed = ds.youth.filter((y) => y.stage === "Completed" || y.stage === "Discharged").length;
  assert.equal(r.totalN, closed);
});

test("slow provider shows a longer wait than the fast one (demo story holds)", () => {
  const r = runReport({ title: "", metric: "avg_days_to_treatment", group_by: "provider", date_range: "all", filters: {} }, ds, NOW);
  const get = (n: string) => r.rows.find((x) => x.label.startsWith(n))?.value ?? 0;
  assert.ok(get("Northgate") > get("Kestrel"), JSON.stringify(r.rows));
});

test("rules parser produces valid specs for common phrasings", () => {
  const cases: [string, string, string][] = [
    ["completion rate by provider for diversion cases", "completion_rate", "provider"],
    ["how long do high-risk youth wait for treatment by provider", "avg_days_to_treatment", "provider"],
    ["how many youth are in each stage", "youth_count", "stage"],
    ["referrals per month this year", "youth_count", "referral_month"],
  ];
  for (const [q, metric, group] of cases) {
    const spec = parseWithRules(q, names);
    assert.ok(ReportSpecSchema.safeParse(spec).success, q);
    assert.equal(spec.metric, metric, q);
    assert.equal(spec.group_by, group, q);
  }
});
