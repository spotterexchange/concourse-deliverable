# Loom script: read-aloud version with click-through

**Audience:** Erie County Department of Health evaluators. You're a vendor submitting your RFP response, so talk to them, not to Concourse.
**Length:** about 5½ minutes, roughly 750 spoken words.

**How to read this:**
- **▶ CLICK** lines are actions. Do them, don't say them.
- Quoted blocks are what you say, word for word.
- *(Pause)* means let the screen catch up before you keep talking.

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

> "Hi, I'm Mike. This is our response to Erie County's RFP for a Juvenile Justice Services Case Management Platform.
>
> You're running the Juvenile Substance Use Services Coordination Program. You need to follow every young person from referral to outcome, and you need to know which treatment providers are actually working, so you can make better decisions for the whole system. And you have seventeen thousand dollars to start.
>
> So let me show you what we'd give you. Everything you'll see is working software with made-up data."

---

## Part 2 · The supervisor's morning (≈ 60 sec)

**▶ CLICK:** Nothing. Point your cursor at the four tiles across the top.

> "This is what a program supervisor sees first thing: how many youth are active, how many tasks are overdue, how often cases end in completion, and how long it takes a young person to get from referral to their first treatment appointment."

**▶ CLICK:** Move your cursor to the **amber "Worth a look" box**.

> "And the system tells you where to look. Here, Northgate Teen Outpatient takes more than twice as long as the program average to get a youth to a first appointment, and fewer of those youth ever show up. That's exactly the kind of systems-level finding this RFP is asking for."

**▶ CLICK:** Move your cursor over the **Provider outcomes** table.

> "Every provider, side by side: referrals, engagement, wait time, completion. The definitions are right on the page, and we hide any rate built on fewer than three cases, so nobody makes a decision off one kid."

**▶ CLICK:** Scroll down to the **Data quality** card at the bottom.

> "And this is quality assurance. Who hasn't been screened, which referrals have stalled, who's in treatment with no appointment booked, who's missing a signed consent. Every number above is only as good as this list, so we put it on the same screen."

---

## Part 3 · A new referral (≈ 75 sec)

**▶ CLICK:** **New intake** in the left sidebar.

> "Now let's be a case manager. A new young person comes in through diversion."

**▶ CLICK:** Fill in:
- **First name:** `Ana`
- **Last initial:** `R`
- **Age:** `15`
- **Referral pathway:** `Diversion`
- **Parent / guardian name:** `Rosa Rivera`
- **Guardian mobile:** `(716) 555-0142`
- **Youth mobile (optional):** `(716) 555-0177`

Leave both text-reminder boxes **checked**.

> "We take a phone number for the guardian and for the youth, each with their own consent to text reminders. A bad phone number gets caught right here."

**▶ CLICK:** **Continue to screening →**

> "Next is the CRAFFT, a validated substance-use screening for ages twelve to twenty-one."

**▶ CLICK:** Part A: **Yes** on the first question (alcohol). **No** on the other two. *(Part B appears.)*
**▶ CLICK:** Part B: **Yes** on **R** (relax) and **Yes** on **F** (family/friends). **No** on the rest.

> "The scoring and skip logic are built in. A score of two or more means this young person needs a closer look, so it's flagged high risk."

**▶ CLICK:** **Save intake & screening**. *(You land on Ana's profile.)*

> "Ana now has a record, and the system gives the case manager one clear next step."

**▶ CLICK:** In **Case notes & audit trail**, type `Prefers afternoon appointments after school.` then click **Add note**.
**▶ CLICK:** In **Next appointment** (right column), pick a date a few days out at about **3:30 PM**, then click **Schedule**.
**▶ CLICK:** In the **Next step** box, open the provider dropdown, choose **Kestrel Family Therapy**, then click **Send referral**.

> "I've added a note, booked an appointment, and sent the referral to Kestrel. Every one of those actions is time-stamped with who did it, down here in the audit trail."

**▶ CLICK:** Scroll the right column to **Contacts** and click **Send text reminder**.

> "One click reminds both Ana and her mom. Notice what the text *doesn't* say: it never names the provider or the kind of treatment. Anyone can pick up a phone, and substance-use treatment is protected under federal law."

---

## Part 4 · Consent unlocks sharing (≈ 50 sec)

**▶ CLICK:** The **Provider portal** tab (top right of Ana's profile).

> "Here's what Kestrel sees in their own portal. Ana's referral and her appointment, but her screening results are hidden, because her guardian hasn't signed consent yet. Court details and case notes are never shown to providers at all."

**▶ CLICK:** The **Family portal** tab.

> "Here's what Ana's mom sees. Her appointment and a consent form. No scores, no court details."

**▶ CLICK:** Tick **"I have read and agree to this consent"**, type `Rosa Rivera` in the signature box, and click **Sign**.

> "She reads it and signs, right from her phone."

**▶ CLICK:** The **Provider portal** tab again.

> "And now Kestrel can see the screening result, because there's consent on file."

**▶ CLICK:** The **Staff view** tab, then scroll the right column to **Signed documents**.

> "The signed form is kept in Ana's record, and the signature is in the audit trail."

---

## Part 5 · Reports without a vendor ticket (≈ 55 sec)

**▶ CLICK:** **Ask a report** in the left sidebar.

> "Every program gets questions from leadership that nobody planned a report for. You shouldn't need a developer or a support ticket to answer them."

**▶ CLICK:** The suggestion **"Are diversion youth more likely to complete than probation youth?"**

> "You can click a common question…"

**▶ CLICK:** In the question box, type `Do girls on probation finish treatment less often than boys?` and click **Ask**. *(Wait 1–2 seconds; the grey line reads "Interpreted by AI".)*

> "…or just ask your own, in plain English.
>
> Here's the important part. The AI only works out *what you're asking*. It never sees a single youth's record. You can see exactly how it understood you, right here."

**▶ CLICK:** Move your cursor along the grey chips (Measure, Grouped by, filters). Then change **Grouped by** to **Entry pathway**.

> "If it read you wrong, change it with one click. The numbers come from the same calculations as the dashboard, so they always agree. And if the AI is ever unavailable, reporting still works."

**▶ CLICK:** **Download CSV**.

> "And you can take any report with you."

---

## Part 6 · Trust (≈ 45 sec)

**▶ CLICK:** **Security & compliance** in the left sidebar. Slowly scroll the requirements table.

> "Every requirement from Sections Five and Six of your RFP, and an honest label for each: working in this demo, simulated, or a commitment for production. Sign-in through the County's own system with multi-factor authentication. All data stored only in the United States. Encryption. A year of audit logs."

**▶ CLICK:** Scroll down to **Your data** and click **Export all County data (JSON)**.

> "And the data is yours. You can take a complete copy at any time: no ticket, no fee.
>
> We also stress-tested this demo against your RFP before sending it. What broke and what we fixed is all documented."

---

## Part 7 · Cost and timeline (≈ 25 sec)

**▶ CLICK:** Scroll to the **Cost** table and the **Implementation timeline** on the same page.

> "Seventeen thousand dollars in year one, including setup and training. Then eight thousand a year. That's forty-nine thousand over five years. There are no per-user fees, so providers and families are included, and getting your data out is free.
>
> We'd be live in six weeks, and this plan shows exactly what we'd need from your team at each step."

---

## Part 8 · Close (≈ 10 sec)

**▶ CLICK:** **Dashboard** in the left sidebar. Look at the camera.

> "This was built in about an hour and tested against your requirements. Imagine what we'll build together with your team. Thank you."

**▶ Stop recording.**

---

## If something goes sideways

| What you see | What to do |
|---|---|
| **Send referral** is greyed out | Pick a provider in the dropdown first |
| **Sign** is greyed out | Tick the agree box *and* type a name |
| Risk shows "Moderate", not "High" | You need a Yes in Part A plus at least **two** Yes answers in Part B. Say "let's adjust that" and fix it, it's fine |
| Ask a report says **"keyword rules · No model key configured"** | Keep going and say "if the AI is unavailable, reporting still works." Afterwards, check `CEREBRAS_API_KEY` in Vercel and redeploy |
| Numbers differ slightly from this script | Expected. The demo data is dated relative to today. The Northgate story stays the same |
| You stumble | Keep going. One natural take beats a polished one; Concourse cares about judgment, not polish |
