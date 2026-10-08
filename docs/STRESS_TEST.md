# Stress test against RFP #2026-052VF

**Goal:** check the demo against what Erie County actually asked for, the way an evaluation committee would. Then fix what breaks, without spending model tokens.

**Token spend for this whole exercise: 0.**
- Automated tests stub the model.
- The browser suite asks only preset questions.
- The one optional step that spends tokens, `npm run eval:model`, is opt-in and was not run.

## Method: four layers

| Layer | What | How to run |
|---|---|---|
| **A. RFP clause audit** | Every requirement in §IV–VI and *Proposal Content* §3–7 checked against the product: working, simulated, planned, or **missing** | Manual; results below and on `/security` |
| **B. Report-builder corpus** | 30 questions written the way DOH program staff and evaluators talk (S1), plus 12 **held-out** questions written after tuning and never tuned against (S1b) | `npm test` |
| **C. Engine, screening, API & data stress** | Hostile specs, empty data, 15,000-youth scale, all 512 CRAFFT answer combinations, malformed requests, prompt injection, model failure, token budget, QA checks, export safety (S2–S7) | `npm test` |
| **D. Browser stress** | 36 checks: every page at 1360 px and 390 px (no horizontal scroll), input validation, CRAFFT skip logic, notes, tasks, appointments, referral, consent-gated portals, reminders, case closure, local report edits, exports, persistence, corrupt storage, zero console errors | `node scripts/e2e.mjs <url>` |

## Results: before → after

| | Baseline (v1) | After fixes |
|---|---|---|
| Automated stress tests (S1–S5) | **7 of 14 failed** | 22 / 22 pass (S6–S7 added) |
| Evaluator corpus (fallback parser) | 21/30 (70%) | 30/30 (tuned on these) |
| Held-out questions (fallback parser) | — | **7/12 (58%)**, not tuned against; see finding 1 |
| Reports over 15,360 youth | 281 ms (O(n²) grouping) | ~60 ms |
| Browser checks | 1 overflow on phone (profile) | 36 / 36 |
| RFP clauses **missing** from the product | 9 | 0 (each now *working*, *simulated*, or an explicit *production commitment*) |

### Defects the stress test caught

| # | Finding | Severity | Fix |
|---|---|---|---|
| 1 | A report filtered to an unknown provider counted every youth **without** a referral, so the answer was plausible but wrong | High (wrong number shown to a buyer) | Unknown provider → empty result (`engine.ts`) |
| 2 | Stale CRAFFT Part B answers saved after Part A flipped to all "no", so the record showed questions that were never asked | High (validated tool integrity) | `cleanAnswers()` on submit |
| 3 | `{ "question": 42 }` was coerced to "42" and sent to the model | Medium (wasted tokens) | Reject non-string questions before any model call |
| 4 | An over-long model title failed validation, so a paid call was thrown away | Low (wasted tokens) | Trim the title instead of rejecting |
| 5 | Only a per-minute cap; no ceiling on daily spend | Medium (free-tier credits) | `REPORT_DAILY_MODEL_CALLS` (default 200/day/instance) in `budget.ts` |
| 6 | Report grouping was O(n²): 281 ms at county scale | Medium (scalability claim) | Linear grouping with id→name maps |
| 7 | Rules parser 70% on evaluator phrasing ("finished the program", "still waiting", "overall success rate") | Medium (fallback quality) | Count/stage/superlative handling; default to no grouping |
| 8 | Youth profile overflowed a 390 px phone by ~640 px (RFP: "tested on portable mobile devices") | Medium | Constrained grid columns and truncation |
| 9 | Closing a case left the next appointment live, so a reminder could still be sent | Medium (privacy) | Closing clears the appointment; reminders hidden on closed cases |
| 10 | Corrupt or old `localStorage` data could crash the app on load | Low | Shape check; fall back to a fresh seed |

### RFP gaps closed (layer A)

| RFP clause | v1 | Now |
|---|---|---|
| §V Prog. *case management and planning* | Next-step actions only | **Case notes**, **tasks with due dates**, **appointment scheduling** |
| §V Prog. *secondary portals … families **and providers*** | Family preview only | **Provider portal**: sees only its referral; screening appears **only after Part 2 consent** |
| §V Prog. *forms requiring secure signatures … retained* | "Review & sign" stub | Guardian **signs Part 2 consent** (typed e-signature, timestamped, kept in the record and audit trail) |
| §V Prog. *text reminders to youth **and** families* | Guardian only | Separate youth and guardian opt-in; one click texts both; never names the provider |
| Proposal §6 *quality assurance measures* | None | **Data-quality card**: unscreened, stalled referrals, treatment without an appointment, referrals without consent |
| §V Admin. *timeline … expectations of the County at each point* | Loom line only | **6-week plan** with County responsibilities per step on `/security` |
| §V Admin. *frequency of updates; 2-yr downtime report* | Not addressed | Weekly zero-downtime releases; honest "no 2-year history" with a 99.9% commitment |
| §VI.5 *logs exportable on request*; §VI.11 *return data in approved format* | Promise only | **One-click full JSON export** and **audit-log CSV** (formula-injection safe) |
| Proposal §7 *data retention after discontinuation, data extraction* | Not priced | **$0** lines in the cost table |

## Finding 1: the held-out score is the argument for the model

The keyword parser scores 100% on the questions it was tuned on, but **58% on questions it has never seen**. That gap is exactly why typed questions go to the model first and the rules only catch failures.

We kept the held-out set untuned on purpose. Tuning to it would hide the real number. Two things keep a 58% fallback safe:
1. The interpretation is shown back as **editable chips**, so a misread is visible and one click fixes it.
2. The **numbers are always computed by the deterministic engine**, never by the model or the parser.

To measure the model on the same 42 questions (about 19k tokens, opt-in):
```bash
npm run eval:model -- https://concourse-deliverable-personal-c635.vercel.app
```

## Token-spend controls (what keeps Cerebras spend near zero)

| Control | Effect |
|---|---|
| Preset questions carry their spec | 0 tokens |
| Browser cache + server cache (normalized question) | Repeats cost 0 |
| Input validation before any model call | Junk costs 0 |
| ~230-token system prompt, `reasoning_effort: low`, 400-token cap, JSON mode | ~450 tokens per new question |
| Per-minute (20) and **daily (200)** call caps per instance | Worst case ≈ 90k tokens/day/instance |
| Rules fallback on cap, error or invalid output | App never breaks when the budget is spent |
| All tests stub the model | CI and stress runs cost 0 |

## Not covered (and why)

- **Real identity, MFA, row-level security, US-region hosting and SOC 2.** These are infrastructure, marked as production commitments on `/security`. A demo can't prove them.
- **Concurrency and multi-user conflicts.** Data is per-browser by design (ADR-002).
- **Load testing the Vercel function.** It only translates a question. All computation is client-side, so server load scales with questions asked, not with caseload size.
- **Accessibility audit with assistive technology.** The basics are covered: labels, text plus color status, a table view. A full WCAG 2.1 AA audit would be part of implementation.
