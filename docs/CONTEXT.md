# Project context: everything you need to own this take-home

> **Who this is for:** you, Mike. Claude did the research and the build, so this file gives you the full picture in one read (about 15 minutes). After it you should be able to record the Loom, answer interview questions, and defend every decision.
>
> **Live demo:** https://concourse-deliverable-personal-c635.vercel.app
> **Repo:** https://github.com/spotterexchange/concourse-deliverable (branch `main`)

---

## 1. TL;DR

- **The ask:** Concourse (Forward Deployed PM role) wants you to pick a live government RFP, build a product that answers it using Claude Code, and record a Loom pitching it **to the government buyer**.
- **The RFP:** Erie County, NY Department of Health, **RFP #2026-052VF: Juvenile Justice Services Case Management Platform**. Proposals are due **Oct 15, 2026**. The budget is tiny: **$17k in year 1, then $8k a year**.
- **What was built:** **"Intercept"**, a working web app for the County's Juvenile Substance Use Services Coordination Program. It covers intake → validated screening (CRAFFT 2.1) → referral to a treatment provider → outcomes. It includes:
  - a supervisor dashboard that compares providers;
  - family and provider portals, with information sharing gated by consent;
  - text reminders;
  - an AI report builder ("ask a question in plain English");
  - a compliance page.
- **The one-line pitch:** *"A case-management platform your staff can use on day one, that tells you which treatment providers actually work, at $49k over five years, with AI that never sees a youth's record."*
- **What's left for you:**
  1. Read this file.
  2. Click through the live demo once.
  3. Record the Loom (§7).
  4. Send the email (§8).

---

## 2. The assignment (from Concourse)

**About Concourse:** an AI-native company building software for the public sector, partnered with 100+ federal, state and local agencies. Their belief is that AI collapses the divide between product and engineering, so the people closest to a problem can ship the solution themselves.

**The exercise (from the PDF):**
1. Find a specific, **open** government RFP that **doesn't name a brand or vendor**.
2. Using Claude Code, build a product (demo or production-grade) that meets its requirements. Deploying it (e.g. to Vercel) is a **bonus**.
3. Record a **short Loom** describing the product, framed as if you're **submitting it to the government buyer** as part of your RFP response.

**What they say they're evaluating:**
- How you **scope** an open-ended, real-world requirement down to something buildable.
- How effectively you **direct AI tools** rather than doing the work by hand.
- Your **judgment on where to invest effort and where to stop**.
- How clearly you **communicate a technical output to a non-technical buyer**.

**What they explicitly don't score:** code quality or visual polish.

**Guidelines:** about 1 hour of hands-on work ("knowing when to stop is part of what we're evaluating"). The deadline is 1 week from receipt, but there's no advantage to waiting. A working demo is a complete submission.

**Submit to:** **sara@concoursetech.com**. Include the product link and the Loom link. Questions go to the same address.

**The recruiter (Maya)** says it's about **product sense** more than Claude Code skill. The hiring manager you spoke with is **Rob**.

---

## 3. The RFP, in plain English

**Buyer:** Erie County Department of Health (Buffalo, NY). Commissioner Gale R. Burstein, MD.

**What they want:** a **customizable case-management platform** for **at-risk and justice-involved youth with behavioral health needs, including substance use disorder**. It supports the **Juvenile Substance Use Services Coordination Program** through its pilot and into implementation. Two things matter most to them:
1. Tracking each youth's case, referrals to treatment providers, and **outcomes captured "at various intercepts"** (points in the justice and treatment process).
2. Tracking **each treatment provider's outcomes and practices** "to inform systems-level improvements". In other words: *which providers actually work?*

**Money and timeline:**

| Item | Value |
|---|---|
| Year 1 (software development + training) | up to **$17,000** |
| Years 2–3 | max **$8,000/year** |
| Contract | 2 years, extendable; start by end of 2026 |
| Proposals due | **Oct 15, 2026, 4:00 pm** (PDF by email to health@erie.gov) |
| Proposal length | 15 pages max, plus required schedules |

**How proposals are scored (Schedule D),** each on a 0–4 scale:

| Section | Weight | What it covers |
|---|---|---|
| **Programmatic** | **30%** | Outcome tracking, intake, case management, referrals, diversion, family engagement, screening tools, document management, e-signatures, data sharing / portals, text reminders |
| **Technical** | **25%** | Cloud hosting, encryption, MFA, HIPAA, data ownership, mobile, disaster recovery, records retention, audit logs (Section VI security rules) |
| Administrative | 15% | Experience, team, references, timeline, update frequency and uptime history |
| Operational | 15% | Workflow config, tasks, **dashboards**, custom forms and **reports without coding**, notifications, roles, search, QA |
| Financial | 15% | Complete cost breakdown and 5-year cost of ownership |

**Notable hard requirements in Section VI (security):**
- **US-only data**: all data, backups and logs.
- **County owns all data.**
- Sign-in **only through the County's identity provider (SSO)**, with MFA. No local accounts.
- Role-based access control.
- Audit logs retained for 1+ year and exportable.
- TLS 1.2+ in transit and AES-256 at rest.
- 24-hour incident notification.
- Data returned and certified deleted on exit.

**Why this RFP was a good pick:**
- It's live, names no vendor, and is a real workflow with a real user (case managers) and a clear buyer goal.
- **The scoring rubric is published**, so the build could target the points.
- **The budget is the pitch.** Legacy case-management vendors can't serve a $17k pilot. An AI-native team can, which is literally Concourse's thesis.

---

## 4. Domain primer (terms you'll hear yourself say)

| Term | Meaning |
|---|---|
| **Sequential Intercept Model** | A framework for the points where someone touches the justice system (arrest, court, probation…). The RFP's "intercepts" language. In the app it becomes **stages**: Referred → Intake → Screened → Referred to Treatment → In Treatment → Completed / Discharged |
| **Pathway** | How the youth entered the program: **Diversion** (kept out of court), **Probation**, or **Family Court** |
| **CRAFFT 2.1** | The most widely recommended adolescent substance-use screener, validated for ages 12–21. Part A asks about use in the past 12 months. If there's no use, only the "Car" question is asked. Part B is 6 yes/no questions (Car, Relax, Alone, Forget, Family/Friends, Trouble). **Score ≥ 2 = high risk**, meaning refer for assessment |
| **42 CFR Part 2** | A federal rule that makes substance-use treatment records *more* protected than ordinary health records (HIPAA). Sharing generally needs **written consent**. This drives two design choices: text messages never name the provider, and the provider can't see screening results until a guardian signs consent |
| **Engagement rate** | Of referrals with a known outcome, the % that attended a first appointment |
| **Completion rate** | Of **closed** cases, the % that completed (open cases are excluded so recent referrals don't drag the number down) |
| **Days to first appointment** | Referral date → first attended appointment. The earliest signal of access problems |
| **IdP / SSO / SCIM** | The County's login system (identity provider). Single sign-on. Automatic account removal when someone leaves |

---

## 5. What was built: a guided tour of "Intercept"

All data is **synthetic** (fake youth, fictional providers like "Northgate Teen Outpatient" and "Kestrel Family Therapy"). The demo user is **Dana Whitfield, Case Manager**. Everything you do is saved in **your browser only**; **Reset demo data** in the sidebar restores the original data.

| Screen | What it shows | RFP hook |
|---|---|---|
| **Dashboard** (`/`) | Tiles (active youth, overdue tasks, completion rate, days to first appointment). An **amber "Worth a look" callout**: Northgate takes 2×+ longer than average to get kids to a first appointment and engages far fewer. A **provider outcomes table**. Active youth by stage. Caseload per case manager. Overdue tasks. Upcoming appointments. **Data-quality checks** | "Dashboard of case load, status, tasks, outcomes"; "provider outcomes… systems-level improvements"; "quality assurance measures" |
| **Caseload** (`/youth`) | Searchable, filterable list of youth | Search, case management |
| **Youth profile** (`/youth/[id]`) | One "next step" action for the case's stage. Case notes. Tasks. Appointment scheduling. Contacts with **text reminders** (to youth *and* guardian). Signed documents. Full **audit trail** of who did what and when. Three tabs: **Staff / Family portal / Provider portal** | Intake/case management, referrals, portals, signatures, text reminders, audit logs |
| **New intake** (`/intake`) | Two steps: details (with phone validation and separate SMS opt-ins), then a **live CRAFFT 2.1 screen** with real scoring | Intake, validated screening tools |
| **Ask a report** (`/reports`) | Type a question in plain English → the AI turns it into a report → a chart or table. The interpretation shows as **editable chips**. CSV download | "Reports without excessive coding by the end user" |
| **Security & compliance** (`/security`) | Every RFP requirement marked **Working in demo / Simulated / Production commitment**. Screening-tool library. **Cost table ($49k / 5 yrs)**. **6-week implementation timeline** with County responsibilities. **One-click export** of all data and the audit log | Technical, Administrative, Financial |

**The consent story (the strongest demo moment):**
1. In the **Provider portal**, the provider can see the referral and appointment but **screening is hidden**: "Part 2 consent has not been signed."
2. In the **Family portal**, the guardian reads the consent and signs by typing their name.
3. Back in the **Provider portal**, the screening result now appears. The signed form is retained in the record and the audit trail.

**Honest labels.** These are **simulated**, not real: SSO/MFA, actual text messages, certified e-signatures, HIPAA hosting, SOC 2, and a real database. The Security page says so explicitly. Being upfront about this is part of the pitch.

---

## 6. How it works (enough to answer "walk me through the architecture")

**Stack:** Next.js (React) + Tailwind, hosted on **Vercel** (US East). The only extra library is `zod` for validation.

**Three design choices to know cold:**

1. **Case data lives only in the browser** (localStorage). There's no server database.
   - *Why:* the demo never stores even fake juvenile records on a server, and it deploys with zero setup.
   - *Production:* a US-region Postgres with row-level security, behind the County's SSO.

2. **"The AI translates; the engine calculates."** For a typed question, the model (Cerebras `gpt-oss-120b`) receives **only the question text and the list of allowed fields**, never a record. It returns a small JSON "report spec" (metric, grouping, date range, filters). The app validates the spec and computes the numbers **in the browser** with the same engine the dashboard uses.
   - *Why:* correctness (one definition of "completion rate"), privacy (the AI never sees youth data), trust (the editable chips show exactly how it read you), and resilience (if the AI is down, a keyword parser takes over and the UI says so).

3. **Data generated by simulation.** The fake data isn't typed in. Each youth is simulated through the stages using per-provider wait, engagement and completion rates. That's why the "Northgate is slow" story is internally consistent everywhere. Dates are relative to today, so exact numbers drift slightly day to day.

**Token spend (you're on Cerebras free credits):**
- Preset questions cost **0 tokens**, and repeat questions are cached.
- A new question costs about **450 tokens**.
- There's a **daily cap of 200 model calls** per server instance.
- All automated tests replace the model with a stand-in, so they cost 0.

**Environment variables (Vercel → Settings → Environment Variables):** `CEREBRAS_API_KEY` is required for AI. `CEREBRAS_MODEL`, `REPORT_DAILY_MODEL_CALLS` and `REPORT_MODEL_CALLS_PER_MIN` are optional.

---

## 7. How the work was done (the process story for the interview)

1. **Picked the RFP.** Criteria: open, no vendor named, a real workflow, buildable in about an hour. Chose Erie County for the published rubric and the tiny budget.
2. **Scoped against the rubric.** *Build* Programmatic (30%) and Operational (15%) as working software. *Show* Technical and Administrative honestly on a traceability page. Explicitly *don't build* SSO, a database or HIPAA hosting: that's procurement work, not product insight.
3. **Directed Claude Code** in order: domain model → data simulation → one shared metrics engine → screens in demo order → tests → browser screenshots reviewed.
4. **Deployed to Vercel.** Fixed two real deployment issues: Vercel's sign-in protection blocked public access, and the project was imported before the code existed, so the framework wasn't detected.
5. **Stress-tested against the RFP** (second pass, zero tokens). A clause-by-clause audit, 42 evaluator-style report questions, abuse tests, and a 36-check browser run at phone and desktop sizes. The baseline **failed 7 of 14 checks and left 9 RFP clauses unanswered**; everything was fixed. Notable catches:
   - a report bug that could show a **plausible but wrong number**;
   - stale screening answers being saved;
   - a mobile layout overflow;
   - reminders still possible on closed cases.
6. **The honest finding.** The keyword fallback scores 100% on the questions it was tuned on, but only **58% on held-out questions**. That number was kept, not hidden. It's the evidence for why typed questions go to the AI, and why the UI shows its interpretation for correction.

**Judgment calls worth mentioning:**
- Hid provider rates with fewer than 3 cases, so nobody acts on one data point.
- Re-tuned the fake data so the dashboard didn't read as "this program is failing".
- Text messages never name the provider (Part 2).
- Stopped before building auth, a database or a form builder, and listed them as the "production path" instead.

The full logs are in `docs/PROCESS.md`, `docs/DECISIONS.md` (11 decision records) and `docs/STRESS_TEST.md`.

---

## 8. Recording the Loom

### Before you record (about 10 minutes)
1. Open https://concourse-deliverable-personal-c635.vercel.app in a **fresh private/incognito window**. That guarantees clean demo data; otherwise click **Reset demo data** in the sidebar.
2. Click through once off-camera: dashboard, one youth profile and its 3 tabs, New intake, Ask a report, Security.
3. Prepare **one typed question** for Ask a report, e.g. *"Do girls on probation finish treatment less often than boys?"* Presets don't call the AI. A typed question shows **"Interpreted by AI · gpt-oss-120b"**, which is the moment that proves the AI is real.
4. Browser at **100% zoom**, about 1400px wide. Close other tabs and turn off notifications.
5. In Loom, choose **Screen + Camera** (a small camera bubble builds trust with a buyer) and record the browser tab or window.
6. Keep `docs/LOOM_SCRIPT.md` open on a second screen or printed.

### Framing
**You are talking to Erie County's evaluation committee, not to Concourse.** Speak their language: youth, case managers, providers, outcomes, consent. Avoid React, APIs and tokens. Follow their scoring weights.

### Script (about 5½ min; full wording in `docs/LOOM_SCRIPT.md`)

| Time | Beat | What to click | Key line |
|---|---|---|---|
| 0:00 | The problem | Dashboard visible | "You need every youth tracked from referral to outcome, and to know which providers actually work. You have $17,000 to start." |
| 0:20 | Supervisor's morning | Tiles → **amber callout** → provider table → scroll to **Data quality** | "Northgate takes more than twice as long… that's the systems-level finding this RFP exists to produce." |
| 1:20 | New referral | **New intake**: guardian + youth phones → CRAFFT (answer yes to a few) → profile: add note, schedule appointment, refer to Kestrel → **Send text reminder** | "It goes to the youth *and* the guardian, and never names the provider." |
| 2:35 | Consent unlocks sharing | **Provider portal** (screening hidden) → **Family portal**: tick the box, type a name, Sign → **Provider portal** (screening visible) → Staff view (signed doc) | "The provider sees screening only after the guardian consents. The signature is kept in the record." |
| 3:25 | Reports, no ticket | **Ask a report**: click a preset → type your question → change one chip → Download CSV | "The AI reads your question, never your records. You can see exactly how it understood you." |
| 4:20 | Trust | **Security & compliance**: scroll the matrix → click **Export all County data** | "Marked honestly: working, simulated, or committed. Your data, any time, no fee. We stress-tested this against your RFP." |
| 5:05 | Cost + timeline | Cost table and 6-week timeline on the same page | "$49,000 over five years, no per-seat fees. Live in six weeks." |
| 5:30 | Close | — | "Built in about an hour and tested against your requirements. Imagine what we build with your team." |

### Gotchas
- **CRAFFT:** to get "High risk", answer **Yes** to at least one Part A question, then Yes to 2+ Part B questions.
- **Provider portal before referral** says "No treatment referral yet". Refer first, *then* show the portals.
- **Sign button** stays disabled until you **tick the agree box and type a name**.
- If Ask a report says **"Interpreted by keyword rules · No model key configured"**, the Cerebras key isn't set in Vercel. Add it and redeploy (§6).
- **Text reminders are simulated**: the button logs "Sent ✓ (simulated)". Say so if asked.
- **One take is fine.** Concourse values judgment over polish. Aim for under 6 minutes.

---

## 9. Submitting

Send to **sara@concoursetech.com**:

> **Subject:** FDPM take-home: Erie County Juvenile Justice Case Management (Mike)
>
> Hi Sara,
>
> Here's my take-home submission.
>
> - **Live product:** https://concourse-deliverable-personal-c635.vercel.app
> - **Loom (framed as the RFP response to Erie County DOH):** <your Loom link>
> - **Repo, including plan, decisions and stress test:** https://github.com/spotterexchange/concourse-deliverable
>
> I chose Erie County RFP #2026-052VF (Juvenile Justice Services Case Management Platform, due Oct 15). It has a published scoring rubric and a $17k first-year budget, which felt like exactly the kind of buyer an AI-native team can serve and a legacy vendor can't. I built the parts the County scores most heavily (case workflow, screening, provider outcomes, portals, no-code reporting), was explicit about what's simulated, and stress-tested the result against the RFP before sending.
>
> Thanks, and happy to walk through any of it with Rob.
>
> Mike

**Check the repo is public, or give Concourse access,** before linking it.

---

## 10. Likely interview questions, with short answers

| Question | Answer |
|---|---|
| Why this RFP? | Live, no vendor named, a real workflow, a **published rubric** to build against, and a **budget legacy vendors can't serve**. That's Concourse's thesis in miniature. |
| How did you scope it? | Mapped features to the scoring weights. Built the 45% that's Programmatic + Operational. Showed Technical and Administrative honestly instead of faking them. Named what I didn't build. |
| Where's the AI, and why there? | In report building, where the RFP asks for "no excessive coding". The AI translates the question; deterministic code calculates. It never sees records, it shows its interpretation, and it has a fallback. I deliberately kept the AI away from anything that must be exactly right. |
| Why not let the AI compute the numbers? | A confidently wrong completion rate about juveniles is worse than no answer. One definition, in code, shared by every screen. |
| How did you know when to stop? | Auth, a database and a form builder are real work with no new product insight, so they're listed as the production path. The stress test was the one place I went deeper, because it found real wrong-number bugs. |
| What would you do in week 1 of the real contract? | A discovery workshop with DOH staff: confirm the stage model and outcome definitions (what counts as "completed"?), the provider list, and which screening tools. Then connect the County's SSO. |
| Biggest risk? | Data quality. Provider outcomes are only as good as case managers' updates. That's why there's a data-quality card and a "Worth a look" insight: they make missing data visible. |
| What's the 58% about? | The keyword fallback on unseen questions. I kept it untuned because it's the honest number. It's why typed questions go to the AI and the UI makes misreads fixable. |
| How did you keep AI costs down? | Presets and caches (0 tokens), about 450 tokens per new question, a daily cap, and tests that never call the model. |
| Is it HIPAA compliant? | The demo holds no real data. The production path is US-only hosting under a BAA, the County's SSO, encryption, audit logs and Part 2-aware sharing, all listed on the Security page as commitments. |

---

## 11. File map

| Path | What it is |
|---|---|
| `PLAN.md` | The original plan: RFP choice, scope, timebox |
| `docs/CONTEXT.md` | **This file** |
| `docs/LOOM_SCRIPT.md` | Word-for-word Loom script |
| `docs/ARCHITECTURE.md` | System design, data model, who-sees-what matrix, production path |
| `docs/DECISIONS.md` | 11 decision records (the "why") |
| `docs/STRESS_TEST.md` | Stress-test method, before/after results, defects found |
| `docs/RFP_TRACEABILITY.md` | Every requirement → status → how it's met (generated) |
| `docs/PROCESS.md` | How Claude was directed, and the judgment calls |
| `src/app/*` | The pages (dashboard, youth, intake, reports, security, API route) |
| `src/lib/*` | Data model, CRAFFT, simulation seed, report engine, quality checks, exports |
| `tests/`, `scripts/e2e.mjs` | Automated stress tests and browser tests |

**Accounts involved:**
- **GitHub** `spotterexchange/concourse-deliverable`.
- **Vercel** project `concourse-deliverable` (team `personal-c635`). Deployment Protection is **off**; the Cerebras key is set.
- **Cerebras** (free credits).
