// RFP requirement → how this product answers it. This is the single source of
// truth for the /security page and docs/RFP_TRACEABILITY.md. Status is honest:
//   built     = works in this demo
//   simulated = the UX is real, the integration is stubbed
//   plan      = production commitment, not in the demo

export type Status = "built" | "simulated" | "plan";
export interface Requirement { section: string; requirement: string; status: Status; answer: string }

export const TRACEABILITY: Requirement[] = [
  // §V Programmatic (30%)
  { section: "V · Programmatic", requirement: "Youth intake, case management & planning", status: "built", answer: "Two-step intake, caseload, per-youth profile with stage-driven next step, case notes, tasks with due dates, appointment scheduling." },
  { section: "V · Programmatic", requirement: "Referrals to treatment providers, data at each intercept", status: "built", answer: "Referral → first appointment → completion/discharge, timestamped and attributed at each stage." },
  { section: "V · Programmatic", requirement: "Validated behavioral health screening tools for under 25", status: "built", answer: "CRAFFT 2.1 is live with skip logic and scoring. GAIN-SS, PHQ-A, MAYSI-2, GAD-7 and ACE-Q are in the form library." },
  { section: "V · Programmatic", requirement: "Text reminders to youth and families", status: "simulated", answer: "Separate opt-in for youth and guardian at intake. One click texts both. Template never names the provider (Part 2). Closing a case cancels reminders. Production: Twilio (US) with STOP handling." },
  { section: "V · Programmatic", requirement: "Secondary portals for families and providers without exposing protected info", status: "built", answer: "Family portal: appointments and forms only. Provider portal: their referral only; screening appears only after Part 2 consent is signed. Court details and case notes are never shown." },
  { section: "V · Programmatic", requirement: "Forms requiring secure signatures, retained in the platform", status: "built", answer: "Guardian signs Part 2 consent in the family portal (typed e-signature, timestamped, kept in the record and audit trail). Production: certified e-signature vendor with a PDF copy." },
  { section: "V · Programmatic", requirement: "Contact clients, providers, POs, judges", status: "simulated", answer: "Contacts per youth with roles. Provider portal shows the case manager's line. Production: secure messaging inside the portals." },
  // §V Operational (15%)
  { section: "V · Operational", requirement: "Dashboard: caseload, status, tasks, outcomes", status: "built", answer: "Program overview with caseload by worker, overdue tasks, stage pipeline and provider outcomes." },
  { section: "V · Operational", requirement: "Custom forms and reports without excessive coding", status: "built", answer: "'Ask a report': plain-English questions become an editable report spec, with CSV export." },
  { section: "V · Operational", requirement: "Search functionality", status: "built", answer: "Caseload search across youth name, ID, guardian and officer, including closed records." },
  { section: "V · Operational", requirement: "Quality assurance measures", status: "built", answer: "Dashboard data-quality checks: unscreened youth, stalled referrals, treatment with no appointment, referrals missing consent. Each links to the records to fix." },
  { section: "V · Administrative", requirement: "Timeline from award to completion, with County expectations at each point", status: "built", answer: "Six-week plan on this page, listing what we do and what we need from the County each step." },
  { section: "V · Administrative", requirement: "Update frequency and 2-year downtime report", status: "plan", answer: "Weekly zero-downtime releases. As a new platform there is no 2-year history to report; we commit to 99.9% monthly uptime with service credits and a public status page." },
  { section: "V · Administrative", requirement: "Scalability and fees to support growth", status: "built", answer: "Stress-tested: reports over 15,000 youth in ~60 ms. No per-seat or per-youth fees within the contract term." },
  { section: "V · Operational", requirement: "Training and next-business-day support at no extra cost", status: "plan", answer: "Included in the subscription. Named support contact, 1-business-day SLA." },
  // §V Technical / §VI (25%)
  { section: "VI · Identity", requirement: "Authenticate exclusively via County IdP (SAML/OIDC), MFA via IdP, no local accounts", status: "simulated", answer: "Demo shows a signed-in user. Production: OIDC/SAML federation to the County IdP, SCIM deprovisioning, a break-glass account only with County approval." },
  { section: "VI · Access control", requirement: "RBAC aligned to County permissions", status: "simulated", answer: "Roles: Case Manager, Supervisor, Provider, Family. Per-field visibility is shown in the family portal. Production: enforced server-side with Postgres row-level security." },
  { section: "VI · Logging", requirement: "Audit logs of user and admin actions, retained ≥1 year, exportable", status: "built", answer: "Every action writes an attributed, timestamped event. One-click audit log CSV export on this page. Production: append-only audit table, 1-year+ retention." },
  { section: "VI · Data sovereignty", requirement: "All data, backups, logs exclusively in the US", status: "plan", answer: "US-only regions for hosting, database, backups, logs and AI inference. No offshore support access." },
  { section: "VI · Data protection", requirement: "TLS 1.2+ in transit, AES-256 at rest", status: "plan", answer: "TLS 1.2+ enforced at the edge. Managed Postgres and backups encrypted with AES-256." },
  { section: "VI · Data ownership", requirement: "County owns data; return in an approved format on exit", status: "built", answer: "One-click full export (JSON) on this page, any time, no fee. Contract: return on termination, certified deletion within 30 days." },
  { section: "VI · Access control", requirement: "Session controls: no concurrent admin sessions, immediate deprovisioning", status: "plan", answer: "Single active admin session enforced server-side. SCIM deprovisioning from the County IdP revokes access on the next request." },
  { section: "VI · AI", requirement: "(Not in RFP) AI use must not expose County data or run up cost", status: "built", answer: "The model receives only the question and field catalog (stress-tested, including prompt injection). Its output is validated before use. Daily call cap; caching; works with AI switched off." },
  { section: "V · Administrative", requirement: "HIPAA compliance documentation, SOC 2 Type II", status: "plan", answer: "HIPAA-eligible infrastructure under a BAA. SOC 2 Type II via the hosting platform plus our own audit roadmap." },
];
