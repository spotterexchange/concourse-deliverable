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
- **AI report builder:** a server route calls the Claude API. The model returns a structured query spec (filter/group/metric), and the app computes results over seed data. The model never sees raw records. That's also the production privacy story: in production, inference runs in a US region under a BAA.
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

## Loom outline (~4–5 min, addressed to Erie County DOH evaluators)

1. **(20s) The problem in their words.** "You're piloting a coordination program and need to know which interventions work and for whom."
2. **(90s) A day as a case manager.** Run a new referral → CRAFFT screening flags high risk → referral to provider → appointment reminder.
3. **(60s) A day as the program supervisor.** Walk the dashboard, then ask the report builder a question live. "No code, no vendor ticket."
4. **(45s) Trust.** Show the compliance matrix: County owns the data, US-only, County IdP, audit logs, Part 2-aware family portal.
5. **(30s) Cost + timeline.** Within the $17k / $8k envelope, $49k over 5 years. Live in 30 days, iterate with staff during the pilot.
6. **(15s) What's next.** List what's deliberately not built yet.

## Open questions for Mike
- Do you have a Claude API key for the deployed report builder, or should we fall back to a canned/rules-based parser for the demo?
- Deploy to Vercel (bonus), or keep it local + Loom?
