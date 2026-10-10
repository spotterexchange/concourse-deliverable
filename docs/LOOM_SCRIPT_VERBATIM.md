# Loom script: run-through copy (talking points as bullets)

> For practice runs. The recording outline is `docs/LOOM_SCRIPT.md`; both use the same click path and inputs.

**Audience:** Erie County Department of Health evaluators. You're a vendor submitting your RFP response, so talk to them, not to Concourse.
**Length:** about 5 minutes.

**How to read this:**
- **▶ CLICK** lines are actions. Do them, don't say them.
- Bullets are what to say. Each one is a single point; skip any to save time.

---

## Setup checklist (before you hit record)

- [ ] Open **https://concourse-deliverable-personal-c635.vercel.app** in a **new private/incognito window**, so you get clean demo data.
- [ ] Browser zoom at **100%**, window about 1400px wide. Close other tabs and silence notifications.
- [ ] Do one dry run of Part 3 off-camera, then click **Reset demo data** (bottom of the left sidebar) and confirm.
- [ ] Loom: **Screen + Camera**, recording this browser window.
- [ ] Have these ready to paste or type:
  - Youth: **Ana** · Last initial **R** · Age **15** · Pathway **Diversion**
  - Guardian: **Rosa Rivera** · Guardian mobile **(716) 555-0142** · Youth mobile **(716) 555-0177**
  - Report question: **Do girls on probation finish treatment less often than boys?**

---

## Part 1 · Opening (≈ 20 sec)

**▶ CLICK:** Start on the **Dashboard** (the default page). Don't scroll yet.

- Hi, I'm Mike. This is our response to Erie County's RFP for a Juvenile Justice Services Case Management Platform.
- Goal: follow every youth from referral to outcome, and see which treatment providers actually work.
- Everything here is working software with made-up data.

---

## Part 2 · The supervisor's morning (≈ 60 sec)

**▶ CLICK:** Nothing. Point your cursor at the four tiles across the top.

- What a supervisor sees first: active youth, overdue tasks, completion rate, days from referral to first appointment.

**▶ CLICK:** Move your cursor to the **amber "Worth a look" box**.

- The system flags where to look: Northgate takes more than twice the average time to a first appointment, and fewer youth show up.
- That's the systems-level finding the RFP asks for.

**▶ CLICK:** Move your cursor over the **Provider outcomes** table.

- Every provider side by side: referrals, engagement, wait time, completion.
- Rates based on fewer than three cases are hidden.

**▶ CLICK:** Scroll down to the **Data quality** card at the bottom.

- Quality assurance: unscreened youth, stalled referrals, treatment with no appointment, missing consent.

---

## Part 3 · A new referral (≈ 75 sec)

**▶ CLICK:** **New intake** in the left sidebar.

- Now as a case manager: a new youth referred through diversion.

**▶ CLICK:** Enter exactly these values.

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

- Separate phone and text consent for the guardian and the youth.
- Invalid phone numbers are rejected.

**▶ CLICK:** **Continue to screening →**

- CRAFFT: validated substance-use screening, ages 12 to 21.

**▶ CLICK:** Answer each question exactly as below, top to bottom.

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

- Scoring and skip logic built in. Score of 2 or more = high risk.

**▶ CLICK:** **Save intake & screening**. *(You land on Ana's profile.)*

**▶ CLICK:** On Ana's profile, do these in order.

| Where | Enter / click |
|---|---|
| **Case notes & audit trail** → box "Add a case note…" | Type `Prefers afternoon appointments after school.` → click **Add note** |
| **Next appointment** (right column) → date/time box | Pick a date **3 days from today**, time **3:30 PM** → click **Schedule** |
| **Next step · Refer to a treatment provider** → "Choose provider…" dropdown | Select **Kestrel Family Therapy (Family Therapy (MST/FFT)) · suggested for risk level** → click **Send referral** |
| Point at the amber warning under the dropdown *(it shows before you send)* | "Part 2 consent isn't signed yet…" |
| **Contacts** (right column, scroll down) | Click **Send text reminder** → button changes to "Sent ✓ … (simulated)" |

- Note, appointment and referral are all logged in the audit trail with who and when.

*As you click **Send text reminder**:*
- One click texts both Ana and her guardian.
- The text never names the provider or the treatment. Substance-use treatment is federally protected.

---

## Part 4 · Consent unlocks sharing (≈ 50 sec)

**▶ CLICK:** The **Provider portal** tab (top right of Ana's profile).

- Provider portal: Kestrel sees the referral and appointment.
- Screening is hidden until the guardian signs consent. Court details and case notes are never shown.

**▶ CLICK:** The **Family portal** tab.

- Family portal: appointment and consent form only. No scores, no court details.

**▶ CLICK:** In the card "Consent to share SUD information (42 CFR Part 2)":
1. Tick ☑ **I have read and agree to this consent.**
2. In the box "Type your full name to sign", type `Rosa Rivera`
3. Click **Sign** *(the card changes to "Signed by Rosa Rivera on …")*

**▶ CLICK:** The **Provider portal** tab again. *(Screening now shows "CRAFFT 2.1 on [today]: score 2 · High risk".)*

- With consent on file, Kestrel now sees the screening result.

**▶ CLICK:** The **Staff view** tab, then scroll the right column to **Signed documents**.

- The signed form is kept in the record and logged in the audit trail.

---

## Part 5 · Reports without a vendor ticket (≈ 55 sec)

**▶ CLICK:** **Ask a report** in the left sidebar.

- Leadership asks questions nobody built a report for. No developer or support ticket needed.

**▶ CLICK:** The suggestion **"Are diversion youth more likely to complete than probation youth?"**

**▶ CLICK:** Click into the question box, clear any text, and type exactly `Do girls on probation finish treatment less often than boys?`, then click **Ask**. *(Wait 1–2 seconds; the grey line reads "Interpreted by AI".)*

- Click a suggested question, or type your own in plain English.
- The AI only works out what you're asking. It never sees a youth record.
- The grey chips show exactly how it read the question.

**▶ CLICK:** Move your cursor along the grey chips (Measure, Grouped by, filters). Then change **Grouped by:** to **Entry pathway**.

- Wrong interpretation? Change it with one click.
- Same calculations as the dashboard, so the numbers always match.
- Reporting still works if the AI is down.

**▶ CLICK:** **Download CSV**.

- Any report exports to CSV.

---

## Part 6 · Trust (≈ 45 sec)

**▶ CLICK:** **Security & compliance** in the left sidebar. Slowly scroll the requirements table.

- Every requirement from Sections V and VI, labelled: working in demo, simulated, or production commitment.
- County sign-in with MFA, US-only data storage, encryption, one year of audit logs.

**▶ CLICK:** Scroll down to **Your data** and click **Export all County data (JSON)**.

- The County owns its data: full export any time, no ticket, no fee.
- This demo was stress-tested against the RFP. Fixes are documented.

---

## Part 7 · Cost and timeline (≈ 25 sec)

**▶ CLICK:** Scroll to the **Cost** table and the **Implementation timeline** on the same page.

- $17k in year 1 including setup and training, then $8k a year: $49k over five years.
- No per-user fees; providers and families included; data export free.
- Live in six weeks. The plan lists what we need from the County at each step.

---

## Part 8 · Close (≈ 10 sec)

**▶ CLICK:** **Dashboard** in the left sidebar. Look at the camera.

- Built in about an hour and tested against your requirements. Thank you.

**▶ Stop recording.**

---

## If something goes sideways

| What you see | What to do |
|---|---|
| **Send referral** is greyed out | Pick a provider in the dropdown first |
| **Sign** is greyed out | Tick the agree box *and* type a name |
| Risk shows "Moderate", not "High" | Check **R** and the **FAMILY or FRIENDS** "F" (the second F) are both Yes. Say "let's adjust that" and fix it, it's fine |
| Ask a report says **"keyword rules · No model key configured"** | Keep going and say "if the AI is unavailable, reporting still works." Afterwards, check `CEREBRAS_API_KEY` in Vercel and redeploy |
| Numbers differ slightly from this script | Expected. The demo data is dated relative to today. The Northgate story stays the same |
| You stumble | Keep going. One natural take beats a polished one; Concourse cares about judgment, not polish |
