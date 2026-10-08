# RFP traceability: Erie County #2026-052VF

_Generated from `src/lib/traceability.ts` (also rendered at `/security`). Do not edit by hand. Run `npm run docs:trace`._

| RFP section | Requirement | Status | How we meet it |
|---|---|---|---|
| V · Programmatic | Youth intake, case management & planning | ✅ Working in demo | Two-step intake, caseload, per-youth profile with stage-driven next step and tasks. |
| V · Programmatic | Referrals to treatment providers, data at each intercept | ✅ Working in demo | Referral → first appointment → completion/discharge, timestamped and attributed at each stage. |
| V · Programmatic | Validated behavioral health screening tools for under 25 | ✅ Working in demo | CRAFFT 2.1 is live with skip logic and scoring. GAIN-SS, PHQ-A, MAYSI-2, GAD-7 and ACE-Q are in the form library. |
| V · Programmatic | Text reminders to youth and families | 🟦 Simulated in demo | Opt-in captured at intake. Message template avoids naming the provider (Part 2). Production: Twilio, US region, with STOP handling. |
| V · Programmatic | Secondary portal for families/providers without exposing protected info | ✅ Working in demo | Family portal preview shows logistics only. Screening, court and clinical fields are hidden by role. |
| V · Programmatic | Contact clients, providers, POs, judges; secure signatures retained | 🟦 Simulated in demo | Contacts per youth. 'Review & sign' consent stub. Production: embedded e-signature with the PDF retained in the record. |
| V · Operational | Dashboard: caseload, status, tasks, outcomes | ✅ Working in demo | Program overview with caseload by worker, overdue tasks, stage pipeline and provider outcomes. |
| V · Operational | Custom forms and reports without excessive coding | ✅ Working in demo | 'Ask a report': plain-English questions become an editable report spec, with CSV export. |
| V · Operational | Search functionality | ✅ Working in demo | Caseload search across youth name, ID, guardian and officer. |
| V · Operational | Training and next-business-day support at no extra cost | ⬜ Production commitment | Included in the subscription. Named support contact, 1-business-day SLA. |
| VI · Identity | Authenticate exclusively via County IdP (SAML/OIDC), MFA via IdP, no local accounts | 🟦 Simulated in demo | Demo shows a signed-in user. Production: OIDC/SAML federation to the County IdP, SCIM deprovisioning, a break-glass account only with County approval. |
| VI · Access control | RBAC aligned to County permissions | 🟦 Simulated in demo | Roles: Case Manager, Supervisor, Provider, Family. Per-field visibility is shown in the family portal. Production: enforced server-side with Postgres row-level security. |
| VI · Logging | Audit logs of user and admin actions, retained ≥1 year, exportable | ✅ Working in demo | Every action writes an attributed, timestamped event (see the activity trail). Production: append-only audit table, 1-year+ retention, export on request. |
| VI · Data sovereignty | All data, backups, logs exclusively in the US | ⬜ Production commitment | US-only regions for hosting, database, backups, logs and AI inference. No offshore support access. |
| VI · Data protection | TLS 1.2+ in transit, AES-256 at rest | ⬜ Production commitment | TLS 1.2+ enforced at the edge. Managed Postgres and backups encrypted with AES-256. |
| VI · Data ownership | County owns data; no third-party sharing; return and certified deletion on exit | ⬜ Production commitment | Contractual. Full export (CSV/JSON) at any time, return on termination, certified deletion within 30 days. |
| VI · AI | (Not in RFP) AI use must not expose County data | ✅ Working in demo | The report model receives only the question text and the field catalog. Case records never leave the browser in the demo, or the County tenant in production. |
| V · Administrative | HIPAA compliance documentation, SOC 2 Type II | ⬜ Production commitment | HIPAA-eligible infrastructure under a BAA. SOC 2 Type II via the hosting platform plus our own audit roadmap. |
