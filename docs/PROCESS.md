# Process: how this was built

The exercise grades *how* a real requirement gets scoped and how AI tools are directed, so this is the log.

## 1. Pick the RFP (human judgment)

Criteria: open now, no vendor named, a real workflow with a real end user, buildable in an hour. Erie County #2026-052VF fit all four. It also has two features that make it a strong choice:
- **A published scoring rubric** (Schedule D) to build against.
- **A tiny budget** ($17k year one, $8k/yr after, about $49k over 5 years). That budget is the AI-native pitch: legacy case-management vendors can't serve a pilot this small.

## 2. Scope against the rubric (human judgment, AI-drafted)

Claude read the full 18-page RFP and drafted `PLAN.md`. I made the cuts:
- **Build** Programmatic (30%) + Operational (15%).
- **Attest** Technical / Administrative. SSO, SOC 2 and data residency are procurement facts, so they're shown on a traceability page with honest statuses.
- **Explicitly out:** real SSO, real SMS, e-signature, HIPAA hosting.

## 3. Direct the build (AI did the typing)

Claude Code wrote the code from the plan, in this order:
1. **Domain model first** (`types.ts`): stages modeled on the Sequential Intercept idea the RFP references.
2. **Synthetic data as a simulation** (`seed.ts`), not hand-typed numbers. Provider differences produce the dashboard story.
3. **Metric definitions in one engine** (`engine.ts`) before any UI. Dashboard and report builder share it.
4. **Screens** in demo order: dashboard → caseload → profile → intake/CRAFFT → reports → security.
5. **Verification:** type-check, lint, unit tests (`npm test`: CRAFFT scoring, metric denominators, parser, "the demo story holds"), and a headless-browser run of every flow, with screenshots reviewed.

## 4. Judgment calls made along the way

| Moment | Call |
|---|---|
| No Claude API key; Cerebras free credits | The model only translates question → spec; presets and caches cost 0 tokens (ADR-004/005) |
| First seed: 38 overdue tasks, a provider showing "0% completion" from one case | Re-tuned the simulation; hid rates with n < 3. A demo that reads as "this program is failing" or shows misleading small-n numbers would undercut the buyer conversation |
| Test caught "stage" matching "age" in the rules parser | Word-boundary matching. This is why there are tests even in a demo |
| SMS template | Never names the provider (Part 2). A domain detail evaluators will notice |
| Scaffolding copied create-next-app's own `.git` over the repo's | Caught before pushing; restored from a fresh clone instead of hand-editing git config. Lesson: scaffold in place or exclude `.git` |
| Where to stop | No auth, no DB, no form builder. Each is real work with no new product insight. Listed as "production path" instead |

## 5. Where we stopped

Done: every flow in `PLAN.md`'s must-have list plus the family portal, SMS reminder and compliance page.

Next, if this were real:
1. A discovery call with DOH program staff to confirm the stage model and outcome definitions.
2. A form builder (GAIN-SS / PHQ-A as configuration).
3. County IdP federation.
4. Postgres with row-level security.
5. A provider-facing view.
