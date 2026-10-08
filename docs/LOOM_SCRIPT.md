# Loom script (~5½ min) for Erie County Department of Health evaluators

**Before recording:**
- Open https://concourse-deliverable-personal-c635.vercel.app in a fresh private window, or click **Reset demo data** in the sidebar.
- Have one typed question ready for "Ask a report". Presets don't call the model; a typed question shows the AI interpreting it.
- The beats follow the County's own scoring weights: Programmatic 30%, Technical 25%, Operational / Administrative / Financial 15% each.

---

**0:00 · The problem, in your words (20s)**
> "You're piloting the Juvenile Substance Use Services Coordination Program. You need every youth tracked from referral to outcome, and you need to know which treatment providers are actually working, so the County can make systems-level decisions. You have $17,000 to start. Here's what we'd give you."

**0:20 · The supervisor's morning (60s) · Dashboard** *(Operational)*
- Tiles: active youth, overdue tasks, completion rate, days to first appointment.
- **Point at the amber callout.** "Northgate takes more than twice as long as the program average to get a youth to a first appointment, and engages far fewer of them. That's the systems-level finding this RFP exists to produce."
- Provider outcomes table: "Definitions are on the page. Small samples are hidden so nobody acts on one case."
- **Scroll to Data quality.** "These are your quality-assurance checks. Who hasn't been screened, which referrals have stalled, who's in treatment with no appointment, who's missing consent. Every number above is only as good as this list."

**1:20 · A new referral (75s) · New intake → CRAFFT → profile** *(Programmatic)*
- Intake: Diversion pathway, guardian mobile, **youth mobile**, both opted in to texts. "Bad phone numbers are caught at the door."
- Run CRAFFT 2.1 live. "Validated for ages 12 to 21. Skip logic and scoring are built in, and a score of 2 or more flags for referral. Answers to questions that weren't asked are never saved."
- On the profile: add a **case note**, **schedule an appointment**, **refer to Kestrel**. Point out the warning: *"Part 2 consent isn't signed yet."*
- **Send text reminder.** "It goes to the youth *and* the guardian, and it never names the provider. A text can be read by anyone holding the phone."

**2:35 · Consent unlocks sharing (50s) · Portals** *(Programmatic: portals and signatures)*
- Click **Provider portal**. "This is what Kestrel sees: their referral and the appointment. Screening is hidden because there's no Part 2 consent. Court details and case notes are never shown."
- Click **Family portal**. "The guardian sees logistics and the consent form. No scores, no court details." Sign with a typed name.
- Back to **Provider portal**. "Now the screening result appears." Back to **Staff view**: "The signed form is retained in the record and the audit trail."

**3:25 · Reports without a vendor ticket (55s) · Ask a report** *(Operational)*
- Click the preset *"Are diversion youth more likely to complete than probation youth?"*
- Type your prepared question, e.g. *"Do girls on probation finish treatment less often than boys?"*
- "The AI only turns your question into a report definition. You can see exactly how it read you, and change any part. The numbers come from the same engine as the dashboard, and **the AI never sees a youth record**. If the AI is unavailable, it still works."
- Change one chip, then **Download CSV**.

**4:20 · Trust (45s) · Security & compliance** *(Technical / Administrative)*
- "Every requirement from Sections V and VI, marked honestly: working in this demo, simulated, or a production commitment."
- "County IdP for sign-in with MFA, US-only hosting, AES-256, one-year audit logs."
- Click **Export all County data**. "Your data, any time, no ticket, no fee."
- "We stress-tested this against your RFP before sending it. That's on the record too: what broke and what we fixed."

**5:05 · Cost and timeline (25s)** *(Financial / Administrative)*
- "$17,000 in year one including setup and training, then $8,000 a year. $49,000 over five years. No per-seat fees, so providers and families are included, and data extraction is free."
- "Live in six weeks. The plan on screen shows what we need from your team at each step."

**5:30 · Close**
> "Built in about an hour, and tested against your requirements. Imagine what we build with your team."
