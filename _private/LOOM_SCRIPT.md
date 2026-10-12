# Loom outline (target 5:30, hard stop 6:00)

**Audience:** Erie County DOH evaluators. You're the vendor, so talk to the buyer, not to Concourse.
**Format:** each section has a **clock checkpoint**, the **clicks**, and **talking points**. Speak to the points in your own words.

---

## Before you record

- Open **https://concourse-deliverable-personal-c635.vercel.app** in a **private window**. Zoom 100%, about 1400px wide, notifications off.
- Do a dry run of section 3, then click **Reset demo data** (bottom of the sidebar).
- Loom: **Screen + Camera**.
- Every input you'll type is listed verbatim in sections 3–5. Do the dry run with this file open.

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

**Click:** **New intake** in the left sidebar. *(Header reads "Step 1 of 2 · Youth & referral details".)*

**Step 1: enter exactly these values**

| Field (as labelled on screen) | Enter / select |
|---|---|
| First name | `Ana` |
| Last initial | `R` |
| Age | `15` *(already the default)* |
| Gender | `Female` *(already the default)* |
| Referral pathway | `Diversion` *(already the default; Diversion shows no officer/judge field)* |
| Parent / guardian name | `Rosa Rivera` |
| Guardian mobile | `(716) 555-0142` |
| Youth mobile (optional) | `(716) 555-0177` |
| ☑ Guardian consents to appointment text reminders | Leave **checked** |
| ☑ Youth consents to appointment text reminders | Leave **checked** *(appears once you enter the youth's number)* |

→ Click **Continue to screening →** *(not "Save intake, screen later")*

**Step 2: CRAFFT 2.1. Answer each question exactly as below, top to bottom**

*Part A · past 12 months*

| # | Question on screen | Click |
|---|---|---|
| A1 | In the past 12 months, did you drink any alcohol (more than a few sips)? | **Yes** |
| A2 | In the past 12 months, did you use any marijuana (cannabis, weed, oil, wax, or hash by smoking, vaping, dabbing, or in edibles)? | **No** |
| A3 | In the past 12 months, did you use anything else to get high (other illegal drugs, prescription or over-the-counter medications, or things you sniff, huff, vape, or inject)? | **No** |

*Part B · CRAFFT questions (appears after all three Part A answers)*

| Letter | Question on screen | Click |
|---|---|---|
| C | Have you ever ridden in a CAR driven by someone (including yourself) who was "high" or had been using alcohol or drugs? | **No** |
| R | Do you ever use alcohol or drugs to RELAX, feel better about yourself, or fit in? | **Yes** |
| A | Do you ever use alcohol or drugs while you are by yourself, or ALONE? | **No** |
| F | Do you ever FORGET things you did while using alcohol or drugs? | **No** |
| F | Do your FAMILY or FRIENDS ever tell you that you should cut down on your drinking or drug use? | **Yes** |
| T | Have you ever gotten into TROUBLE while you were using alcohol or drugs? | **No** |

✅ **Check:** the bar at the bottom reads **Score 2 / 6 · High risk**.
→ Click **Save intake & screening**. *(You land on "Ana R." with Stage **Screened**.)*

**Step 3: on Ana's profile, in this order**

| Where | Enter / click |
|---|---|
| **Case notes & audit trail** → box "Add a case note…" | Type `Prefers afternoon appointments after school.` → click **Add note** |
| **Next appointment** (right column) → date/time box | Pick a date **3 days from today**, time **3:30 PM** → click **Schedule** |
| **Next step · Refer to a treatment provider** → "Choose provider…" dropdown | Select **Kestrel Family Therapy (Family Therapy (MST/FFT)) · suggested for risk level** → click **Send referral** |
| Point at the amber warning under the dropdown *(it shows before you send)* | "Part 2 consent isn't signed yet…" |
| **Contacts** (right column, scroll down) | Click **Send text reminder** → button changes to "Sent ✓ … (simulated)" |

**Talking points:**
- Separate text consent for youth and guardian; bad numbers are caught at entry
- CRAFFT is a validated screener for ages 12–21; scoring is built in; **2 or more = high risk**
- One clear next step; every action is time-stamped and attributed in the **audit trail**
- **The text never names the provider.** Anyone can read a phone, and substance-use treatment is federally protected.

> ⏱ **If you're running long, skip the note and the appointment, and go straight to the referral.**

## 4 · Consent unlocks sharing · 2:35 → 3:25 ⭐ *the key moment, don't rush it*

**Clicks (tabs are top-right of Ana's profile):**
1. **Provider portal**: the Screening card reads *"Hidden: Part 2 consent has not been signed."*
2. **Family portal**: in the card "Consent to share SUD information (42 CFR Part 2)":
   - Tick ☑ **I have read and agree to this consent.**
   - In the box "Type your full name to sign", type `Rosa Rivera`
   - Click **Sign** *(card changes to "Signed by Rosa Rivera on …")*
3. **Provider portal** again: Screening now shows *"CRAFFT 2.1 on [today]: score 2 · High risk"*
4. **Staff view** → scroll the right column to **Signed documents** → *"Typed e-signature by Rosa Rivera"*

**Talking points:**
- The provider sees the referral and appointment; **screening is hidden without consent**. Court details and notes are never shown.
- The family sees appointments and the consent form only
- After signing → **the provider now sees the screening**
- The signed form is kept in the record and the audit trail

## 5 · Reports without a ticket · 3:25 → 4:20

**Clicks:**
1. **Ask a report** in the left sidebar
2. Click the grey suggestion pill **Are diversion youth more likely to complete than probation youth?**
3. Click into the question box, select and clear any text, type exactly:
   `Do girls on probation finish treatment less often than boys?`
   → click **Ask** → wait 1–2 sec for the grey line **"Interpreted by AI · gpt-oss-120b"**
4. In the chips row, change **Grouped by:** to **Entry pathway**
5. Click **Download CSV**

**Talking points:**
- Leadership asks unplanned questions; there's no developer or ticket needed
- **The AI only works out what you're asking. It never sees a youth record.**
- The interpretation is visible and fixable in one click
- Same calculations as the dashboard; still works if the AI is down

## 6 · Trust · 4:20 → 5:05

**Clicks:**
1. **Security & compliance** in the left sidebar → scroll the requirements table slowly
2. Scroll to the **Your data** card (bottom right) → click **Export all County data (JSON)**

**Talking points:**
- Every Section V and VI requirement, labelled honestly: **working / simulated / production commitment**
- County SSO with MFA, US-only data, encryption, a year of audit logs
- "Your data, any time, no ticket, no fee."
- "We stress-tested this against your RFP before sending it."

## 7 · Cost + timeline · 5:05 → 5:30

**Clicks:** on the same page, scroll back up slightly to **Cost within the County's budget**, then down to **Implementation timeline: award to go-live in 6 weeks**

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
| Risk shows "Moderate" | Check **R** and the **FAMILY or FRIENDS** "F" (the second F) are both Yes; fix it on camera, that's fine |
| "keyword rules · No model key" | Say "even if the AI is unavailable, reporting still works" and move on |
| Numbers differ from these notes | Expected: the demo data is dated relative to today |
