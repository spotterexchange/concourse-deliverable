# RFP traceability: Erie County #2026-052VF

_Generated from `src/lib/traceability.ts` (also rendered at `/security`). Do not edit by hand. Run `npm run docs:trace`._

| RFP section | Requirement | Status | How we meet it |
|---|---|---|---|
| V · Programmatic | Youth intake, case management & planning | ✅ Working in demo | Two-step intake, caseload, per-youth profile with stage-driven next step, case notes, tasks with due dates, appointment scheduling. |
| V · Programmatic | Referrals to treatment providers, data at each intercept | ✅ Working in demo | Referral → first appointment → completion/discharge, timestamped and attributed at each stage. |
| V · Programmatic | Validated behavioral health screening tools for under 25 | ✅ Working in demo | CRAFFT 2.1 is live with skip logic and scoring. GAIN-SS, PHQ-A, MAYSI-2, GAD-7 and ACE-Q are in the form library. |
| V · Programmatic | Text reminders to youth and families | 🟦 Simulated in demo | Separate opt-in for youth and guardian at intake. One click texts both. Template never names the provider (Part 2). Closing a case cancels reminders. Production: Twilio (US) with STOP handling. |
| V · Programmatic | Secondary portals for families and providers without exposing protected info | ✅ Working in demo | Family portal: appointments and forms only. Provider portal: their referral only; screening appears only after Part 2 consent is signed. Court details and case notes are never shown. |
| V · Programmatic | Forms requiring secure signatures, retained in the platform | ✅ Working in demo | Guardian signs Part 2 consent in the family portal (typed e-signature, timestamped, kept in the record and audit trail). Production: certified e-signature vendor with a PDF copy. |
| V · Programmatic | Contact clients, providers, POs, judges | 🟦 Simulated in demo | Contacts per youth with roles. Provider portal shows the case manager's line. Production: secure messaging inside the portals. |
| V · Operational | Dashboard: caseload, status, tasks, outcomes | ✅ Working in demo | Program overview with caseload by worker, overdue tasks, stage pipeline and provider outcomes. |
| V · Operational | Custom forms and reports without excessive coding | ✅ Working in demo | 'Ask a report': plain-English questions become an editable report spec, with CSV export. |
| V · Operational | Search functionality | ✅ Working in demo | Caseload search across youth name, ID, guardian and officer, including closed records. |
| V · Operational | Quality assurance measures | ✅ Working in demo | Dashboard data-quality checks: unscreened youth, stalled referrals, treatment with no appointment, referrals missing consent. Each links to the records to fix. |
| V · Administrative | Timeline from award to completion, with County expectations at each point | ✅ Working in demo | Six-week plan on this page, listing what we do and what we need from the County each step. |
| V · Administrative | Update frequency and 2-year downtime report | ⬜ Production commitment | Weekly zero-downtime releases. As a new platform there is no 2-year history to report; we commit to 99.9% monthly uptime with service credits and a public status page. |
| V · Administrative | Scalability and fees to support growth | ✅ Working in demo | Stress-tested: reports over 15,000 youth in ~60 ms. No per-seat or per-youth fees within the contract term. |
| V · Operational | Training and next-business-day support at no extra cost | ⬜ Production commitment | Included in the subscription. Named support contact, 1-business-day SLA. |
| VI · Identity | Authenticate exclusively via County IdP (SAML/OIDC), MFA via IdP, no local accounts | 🟦 Simulated in demo | Demo shows a signed-in user. Production: OIDC/SAML federation to the County IdP, SCIM deprovisioning, a break-glass account only with County approval. |
| VI · Access control | RBAC aligned to County permissions | 🟦 Simulated in demo | Roles: Case Manager, Supervisor, Provider, Family. Per-field visibility is shown in the family portal. Production: enforced server-side with Postgres row-level security. |
| VI · Logging | Audit logs of user and admin actions, retained ≥1 year, exportable | ✅ Working in demo | Every action writes an attributed, timestamped event. One-click audit log CSV export on this page. Production: append-only audit table, 1-year+ retention. |
| VI · Data sovereignty | All data, backups, logs exclusively in the US | ⬜ Production commitment | US-only regions for hosting, database, backups, logs and AI inference. No offshore support access. |
| VI · Data protection | TLS 1.2+ in transit, AES-256 at rest | ⬜ Production commitment | TLS 1.2+ enforced at the edge. Managed Postgres and backups encrypted with AES-256. |
| VI · Data ownership | County owns data; return in an approved format on exit | ✅ Working in demo | One-click full export (JSON) on this page, any time, no fee. Contract: return on termination, certified deletion within 30 days. |
| VI · Access control | Session controls: no concurrent admin sessions, immediate deprovisioning | ⬜ Production commitment | Single active admin session enforced server-side. SCIM deprovisioning from the County IdP revokes access on the next request. |
| VI · AI | (Not in RFP) AI use must not expose County data or run up cost | ✅ Working in demo | The model receives only the question and field catalog (stress-tested, including prompt injection). Its output is validated before use. Daily call cap; caching; works with AI switched off. |
| V · Administrative | HIPAA compliance documentation, SOC 2 Type II | ⬜ Production commitment | HIPAA-eligible infrastructure under a BAA. SOC 2 Type II via the hosting platform plus our own audit roadmap. |
