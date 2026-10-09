# Loom outline (target 5:30, hard stop 6:00)

**Audience:** Erie County DOH evaluators. You're the vendor, so talk to the buyer, not to Concourse.
**Format:** each section has a **clock checkpoint**, the **clicks**, and **talking points**. Speak to the points in your own words.

---

## Before you record

- Open **https://concourse-deliverable-personal-c635.vercel.app** in a **private window**. Zoom 100%, about 1400px wide, notifications off.
- Do a dry run of section 3, then click **Reset demo data** (bottom of the sidebar).
- Loom: **Screen + Camera**.
- Keep handy:
  - **Youth:** Ana R. · 15 · Diversion
  - **Guardian:** Rosa Rivera · (716) 555-0142
  - **Youth phone:** (716) 555-0177
  - **Report question:** *"Do girls on probation finish treatment less often than boys?"*

---

## 1 · Opening · 0:00 → 0:20

**Screen:** Dashboard (no clicks)

- Who you are; responding to the Erie County Juvenile Justice Case Management RFP
- *Their* problem: track every youth from referral to outcome, and learn **which providers actually work**
- Budget hook: "$17,000 to start." Everything shown is working software with fake data.

## 2 · Supervisor's morning · 0:20 → 1:20

**Clicks:**
1. Hover the **4 tiles**
2. Hover the amber **"Worth a look"** box
3. Hover the **Provider outcomes** table
4. Scroll to **Data quality**

**Talking points:**
- Tiles: active youth, overdue tasks, completion rate, days to first appointment
- **Northgate takes 2× longer and engages fewer.** "That's the systems-level finding the RFP asks for."
- Providers side by side; definitions on the page; rates hidden under 3 cases
- Data quality = the RFP's quality-assurance ask: "the numbers are only as good as this list"

> ⏱ **If you're past 1:30, skip the provider table.**

## 3 · A new referral · 1:20 → 2:35

**Clicks:**
1. **New intake** → fill in Ana's details plus the guardian and youth phones → keep both text boxes checked → **Continue to screening →**
2. CRAFFT: Part A **Yes** on alcohol → Part B **Yes** on **R** and **F** → **Save intake & screening**
3. Profile:
   - **Add note** ("prefers afternoon appointments")
   - **Next appointment**: pick a date at about 3:30 PM → **Schedule**
   - **Next step**: choose **Kestrel Family Therapy** → **Send referral**
4. **Contacts** → **Send text reminder**

**Talking points:**
- Separate text consent for youth and guardian; bad numbers are caught at entry
- CRAFFT is a validated screener for ages 12–21; scoring is built in; **2 or more = high risk**
- One clear next step; every action is time-stamped and attributed in the **audit trail**
- **The text never names the provider.** Anyone can read a phone, and substance-use treatment is federally protected.

> ⏱ **If you're running long, skip the note and the appointment, and go straight to the referral.**

## 4 · Consent unlocks sharing · 2:35 → 3:25 ⭐ *the key moment, don't rush it*

**Clicks:**
1. **Provider portal** tab
2. **Family portal** tab → tick the agree box → type "Rosa Rivera" → **Sign**
3. **Provider portal** again
4. **Staff view** → **Signed documents**

**Talking points:**
- The provider sees the referral and appointment; **screening is hidden without consent**. Court details and notes are never shown.
- The family sees appointments and the consent form only
- After signing → **the provider now sees the screening**
- The signed form is kept in the record and the audit trail

## 5 · Reports without a ticket · 3:25 → 4:20

**Clicks:**
1. **Ask a report**
2. Click the suggestion *"Are diversion youth more likely…"*
3. Type your question → **Ask** (wait for "Interpreted by AI")
4. Change the **Grouped by** chip → **Download CSV**

**Talking points:**
- Leadership asks unplanned questions; there's no developer or ticket needed
- **The AI only works out what you're asking. It never sees a youth record.**
- The interpretation is visible and fixable in one click
- Same calculations as the dashboard; still works if the AI is down

## 6 · Trust · 4:20 → 5:05

**Clicks:**
1. **Security & compliance** → scroll the table slowly
2. **Your data** → **Export all County data (JSON)**

**Talking points:**
- Every Section V and VI requirement, labelled honestly: **working / simulated / production commitment**
- County SSO with MFA, US-only data, encryption, a year of audit logs
- "Your data, any time, no ticket, no fee."
- "We stress-tested this against your RFP before sending it."

## 7 · Cost + timeline · 5:05 → 5:30

**Clicks:** scroll to the **Cost** table and the **Implementation timeline**

**Talking points:**
- **$17k in year 1, then $8k a year = $49k over 5 years**
- No per-user fees, so providers and families are included; data extraction is free
- **Live in 6 weeks**; the plan shows what we need from the County at each step

## 8 · Close · 5:30 → 5:40

**Click:** **Dashboard**, then look at the camera.

- "Built in about an hour, tested against your requirements. Imagine what we'll build with your team."

---

## Time management

| If at… | You're past | Then |
|---|---|---|
| **1:30** | section 2 | Skip the provider table |
| **2:45** | section 3 | Skip the note and appointment; just refer and send the text |
| **4:30** | section 5 | Skip the chip edit and the CSV |
| **5:15** | section 6 | Say the cost line in one sentence and close |

**Never cut section 4 (consent).** It's the strongest moment.

## If something goes wrong

| What you see | What to do |
|---|---|
| **Send referral** is greyed out | Pick a provider first |
| **Sign** is greyed out | Tick the agree box *and* type a name |
| Risk shows "Moderate" | You need Part A Yes plus 2+ Part B Yes answers; fix it on camera, that's fine |
| "keyword rules · No model key" | Say "even if the AI is unavailable, reporting still works" and move on |
| Numbers differ from these notes | Expected: the demo data is dated relative to today |
