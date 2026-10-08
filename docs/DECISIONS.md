# Architecture Decision Records

Short records of the choices that shape this build: what we chose, why, and what we gave up.

---

## ADR-001: Build the scored workflow; show the rest as attestation

**Context.** The RFP is scored as Programmatic 30%, Technical 25%, Administrative 15%, Operational 15% and Financial 15%. The timebox is about an hour of hands-on time.
**Decision.** Build Programmatic (intake, screening, referral, outcomes, portal, reminders) and Operational (dashboard, no-code reports, search) as *working software*. Cover Technical and Administrative with an honest traceability page that marks each item *working / simulated / production commitment*.
**Why.** Evaluators can only judge the product by using it. SSO, SOC 2 and US-only hosting are procurement facts, not product discovery. Building them in a demo would spend the hour without showing judgment.
**Trade-off.** Technical claims are assertions, not demonstrations. We say so explicitly on `/security` instead of implying more than exists.

## ADR-002: Case data lives in the browser (no server database)

**Decision.** State is held in React context and persisted to `localStorage`. The seed is generated client-side. The only server route receives question text.
**Why.** (1) The demo never stores even synthetic "juvenile records" on a server, so we never have to explain away a database. (2) No database to provision, so Vercel deploys with zero configuration. (3) The store's actions (`addYouth`, `referToProvider`, `setStage`…) are deliberately shaped like the API that replaces them.
**Trade-off.** Each viewer has their own copy of the data, and there's no multi-user collaboration. "Reset demo data" restores the seed.

## ADR-003: Next.js on Vercel, no UI or chart library

**Decision.** Next.js App Router + Tailwind. Charts are plain HTML bars. The only runtime dependency beyond Next is `zod`.
**Why.** One deployable, zero-config hosting, a small bundle that loads fast on the "portable mobile devices" the RFP mentions. Single-series bar charts don't justify a charting library.
**Trade-off.** Hand-built components. That's fine at this scope; we'd revisit for trend lines and small multiples.

## ADR-004: The model translates; the engine calculates

**Context.** The RFP wants reports "without excessive coding by the end-user". That's an AI use case. But an LLM that *computes* numbers about youth outcomes can be confidently wrong, and an LLM that *sees* records is a data-sharing event.
**Decision.** The model's only job is to convert a question into a small `ReportSpec` JSON (metric, grouping, date range, filters). The spec is validated with zod and executed by a deterministic engine (`engine.ts`) in the browser. The dashboard uses the same engine.
**Why.**
- **Correctness:** "completion rate" has one definition, in code, shared by every screen.
- **Privacy:** the model receives no case data, only the question and the field catalog. This is the cleanest possible answer to RFP §VI ("No data may be transferred … to third parties").
- **Trust:** the interpretation is shown back as editable chips, so a misread is visible and one click fixes it.
- **Resilience:** if the model is down, unkeyed or returns junk, a keyword parser produces a valid spec, and the UI labels which one answered.
**Trade-off.** Users can only ask questions the spec can express. That's a feature for a government buyer, and new metrics are a code change reviewed once.

## ADR-005: Token budget on the Cerebras free tier

**Decision.** Use Cerebras `gpt-oss-120b` through its OpenAI-compatible API with:
- presets that carry their spec (0 tokens), plus browser and server caches for repeat questions;
- a terse system prompt (~250 tokens), `reasoning_effort: "low"`, `max_completion_tokens: 400`, JSON mode, `temperature: 0`;
- a 200-character question cap, 20 requests/min per instance, an 8-second timeout;
- model and base URL set by environment variables, so swapping providers is configuration, not code.

**Why.** A typical uncached question costs roughly 400–600 tokens total, so the free tier covers thousands of demo questions. Raw fetch avoids an SDK dependency for a single endpoint.
**Trade-off.** In-memory server cache and rate limit are per serverless instance, not global. That's acceptable for a demo; production would use a shared store.

## ADR-006: Privacy-by-default in outbound messages and the family portal

**Decision.** SMS templates name the youth's first name and the appointment time only. They never name the provider or the service type. The family portal shows logistics (appointments, consent to sign) and lists what it hides (screening, risk, court and clinical details).
**Why.** A text message is readable by anyone holding the phone, and naming a substance-use provider discloses Part 2-protected information. Youth may also confide things in a CRAFFT screen they haven't told parents. Getting this right is cheap at design time and very expensive after an incident.

## ADR-007: Light theme only; accessibility basics over polish

**Decision.** One light theme. Status always pairs color with a text label. Charts show `n` and offer a table view. Mobile layout is a stacked single column.
**Why.** County staff use shared desktops and print reports. One well-tested theme beats two half-tested ones. Code quality and visual polish are explicitly not scored.

## ADR-008: Synthetic data from a simulation, with a fixed seed

**Decision.** The seed generator simulates each youth through the stages using per-provider wait, engagement and completion parameters, with a fixed PRNG seed.
**Why.** The dashboard tells a coherent story: e.g. *Northgate's 27-day wait vs. ~11 days program-wide* emerges from the simulation instead of being typed in. A fixed seed makes the Loom and the live URL show the same picture. Tests assert the story holds.

## ADR-009: CRAFFT 2.1 is the one live screening tool

**Decision.** Implement CRAFFT 2.1 fully (Part A gate, Part B, ≥2 cutoff). List GAIN-SS, PHQ-A, MAYSI-2, GAD-7 and ACE-Q as configurable forms.
**Why.** The program is the *Juvenile Substance Use* Services Coordination Program. CRAFFT is the most widely recommended adolescent substance-use screen, and it's short enough to run live in a demo. One real tool with correct scoring is more convincing than six mock-ups.
**Trade-off.** Part A is simplified to yes/no (the published form asks for days of use). The production form would use the licensed wording verbatim.
