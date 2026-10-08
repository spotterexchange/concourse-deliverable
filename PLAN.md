# Concourse FDPM Take-Home — Plan

**RFP:** Erie County (NY) Dept. of Health, RFP #2026-052VF — Juvenile Justice Services Case Management Platform
**Issued** Sep 15, 2026 · **Due** Oct 15, 2026, 4:00 pm · No brand named · Budget ≤ $17k yr 1, ≤ $8k/yr after
**Time box:** ~1 hour hands-on (per Concourse's guidelines). Stopping on time is part of the grade.

## Why this RFP

- **Live and no vendor named**, so it meets Concourse's Step 1 criteria. The due date lines up with our own one-week window.
- **A real product problem, not a website refresh.** The workflow runs intake → screening → referral → outcomes, and it has an end user (case managers) and a buyer goal ("inform systems-level improvements").
- **The budget is the story.** $17k + 4 × $8k is a **$49k 5-year TCO**. Legacy case-management vendors can't serve a pilot program at that price, but an AI-native team can. This is the core of the Concourse pitch.
- **The scoring rubric is published** (Schedule D), so we can build against the points:

| Section | Weight | What we do with it |
|---|---|---|
| Programmatic | **30%** | **Build it.** Intake, screening, referral, outcomes |
| Technical | 25% | **Show, don't build.** Compliance matrix page + architecture notes |
| Administrative | 15% | One slide/section in the Loom (timeline, data ownership) |
| Operational | 15% | **Build it.** Dashboard (the RFP asks for one by name) + no-code reports |
| Financial | 15% | One-line 5-yr TCO in the app + Loom |

## The product: "Intercept" (working name)

A case-management demo for the **Juvenile Substance Use Services Coordination Program**. It uses synthetic data only.

### Must-have (the demo path, ~40 min of prompting)
1. **Supervisor dashboard** (landing page). It shows caseload by worker, open tasks/overdue items, youth by intercept stage, and **outcomes by treatment provider**. Provider outcomes are the "systems-level improvement" ask and the line a buyer will remember.
2. **Youth profile.** Demographics, probation officer / judge / family contacts, timeline of events, and the youth's current **intercept** (Sequential Intercept Model: referral → intake → screening → treatment referral → engaged → completed / discharged).
3. **Intake + validated screening.** Implement **CRAFFT 2.1** (validated for ages 12–21, scored as ≥2 = high risk) as a real scored form that sets risk level. Also list other included tools (GAIN-SS, PHQ-A, MAYSI-2) to answer the "list of validated tools" requirement.
4. **Referral to provider.** Pick a provider, track status, and record outcome at each intercept. This feeds the dashboard numbers.
5. **AI report builder (the differentiator).** The supervisor types "completion rate by provider for diversion cases this quarter" and gets a table/chart. This maps directly to *"does not require excessive coding by the end-user to create forms and reports"*. It's the AI-native angle Concourse wants to see, used to solve a stated requirement rather than bolted on.

### Nice-to-have (only if under time)
- **Text reminder** button with a mocked SMS log ("Reminder sent to guardian: appointment Tue 3pm").
- **Family/provider portal view** (role toggle) that shows appointments and status but **hides screening results and substance-use details**. This calls out **42 CFR Part 2** consent, a domain detail most bidders will miss.
- **Compliance matrix** page that maps RFP §V–VI requirements → how the production version meets them: County IdP via SAML/OIDC, US-only regions, AES-256 at rest, TLS 1.2+, audit log, 1-yr log retention, data returned on termination.

### Explicitly out of scope (say so in the Loom)
Real SSO/MFA, real SMS, e-signatures, HIPAA hosting/BAAs, and SOC 2. These are procurement and infrastructure work, not product discovery. Naming them shows we know they exist and where they fit.

## Build approach

- **Stack:** Next.js (App Router) + Tailwind, seeded JSON (~40 synthetic youth, 5 providers, 4 case managers), client state, deploy to **Vercel** (bonus).
- **AI report builder:** a server route calls an LLM (Cerebras `gpt-oss-120b`, free tier; see docs/DECISIONS.md ADR-005). The model returns a structured query spec (filter/group/metric), and the app computes results over seed data. The model never sees raw records. That's also the production privacy story: in production, inference runs in a US region under a BAA.
- **How we direct Claude Code:** we provide one spec prompt (this file + the data model), then iterate by screen. We don't hand-write code. We keep a short `PROCESS.md` log of the prompts and judgment calls, which serves as evidence for "how you direct AI tools."

## Timeline (~60 min)

| Min | Step |
|---|---|
| 0–5 | Scaffold Next.js, seed data model + generator |
| 5–20 | Dashboard + youth list/profile |
| 20–30 | CRAFFT intake form + referral flow wired to dashboard |
| 30–42 | AI report builder |
| 42–50 | Polish pass, compliance matrix, deploy to Vercel |
| 50–60 | Record Loom |

**Stop rule:** at 50 minutes we record, regardless of what's left. Unfinished items go in the Loom as "next."

## Loom outline (~5½ min, addressed to Erie County DOH evaluators)

The full script, ordered by the County's scoring weights, is in [`docs/LOOM_SCRIPT.md`](docs/LOOM_SCRIPT.md).

1. **(20s) The problem in their words.** Track every youth from referral to outcome; learn which providers work.
2. **(60s) The supervisor's morning.** Dashboard, the Northgate finding, provider outcomes, the data-quality checks.
3. **(75s) A new referral.** Intake with youth and guardian phones → CRAFFT → note, appointment, referral → a reminder that never names the provider.
4. **(50s) Consent unlocks sharing.** The provider portal hides screening → the guardian signs Part 2 consent → the provider sees it; the signed form is retained.
5. **(55s) Reports without a vendor ticket.** Preset plus one typed question; the AI reads the question, never the records; edit a chip; export CSV.
6. **(45s) Trust.** Requirement matrix, one-click County data export, "we stress-tested this against your RFP."
7. **(25s) Cost + timeline.** $49k over 5 years, no per-seat fees, free data extraction; live in 6 weeks.

## Open questions for Mike (resolved)
- Model provider: Cerebras `gpt-oss-120b` (free tier), with a keyword-rules fallback and a daily call cap.
- Deployment: Vercel, https://concourse-deliverable-personal-c635.vercel.app
