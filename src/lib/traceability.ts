// RFP requirement → how this product answers it. This is the single source of
// truth for the /security page and docs/RFP_TRACEABILITY.md. Status is honest:
//   built     = works in this demo
//   simulated = the UX is real, the integration is stubbed
//   plan      = production commitment, not in the demo

export type Status = "built" | "simulated" | "plan";
export interface Requirement { section: string; requirement: string; status: Status; answer: string }

export const TRACEABILITY: Requirement[] = [
  // §V Programmatic (30%)
  { section: "V · Programmatic", requirement: "Youth intake, case management & planning", status: "built", answer: "Two-step intake, caseload, per-youth profile with stage-driven next step and tasks." },
  { section: "V · Programmatic", requirement: "Referrals to treatment providers, data at each intercept", status: "built", answer: "Referral → first appointment → completion/discharge, timestamped and attributed at each stage." },
  { section: "V · Programmatic", requirement: "Validated behavioral health screening tools for under 25", status: "built", answer: "CRAFFT 2.1 is live with skip logic and scoring. GAIN-SS, PHQ-A, MAYSI-2, GAD-7 and ACE-Q are in the form library." },
  { section: "V · Programmatic", requirement: "Text reminders to youth and families", status: "simulated", answer: "Opt-in captured at intake. Message template avoids naming the provider (Part 2). Production: Twilio, US region, with STOP handling." },
  { section: "V · Programmatic", requirement: "Secondary portal for families/providers without exposing protected info", status: "built", answer: "Family portal preview shows logistics only. Screening, court and clinical fields are hidden by role." },
  { section: "V · Programmatic", requirement: "Contact clients, providers, POs, judges; secure signatures retained", status: "simulated", answer: "Contacts per youth. 'Review & sign' consent stub. Production: embedded e-signature with the PDF retained in the record." },
  // §V Operational (15%)
  { section: "V · Operational", requirement: "Dashboard: caseload, status, tasks, outcomes", status: "built", answer: "Program overview with caseload by worker, overdue tasks, stage pipeline and provider outcomes." },
  { section: "V · Operational", requirement: "Custom forms and reports without excessive coding", status: "built", answer: "'Ask a report': plain-English questions become an editable report spec, with CSV export." },
  { section: "V · Operational", requirement: "Search functionality", status: "built", answer: "Caseload search across youth name, ID, guardian and officer." },
  { section: "V · Operational", requirement: "Training and next-business-day support at no extra cost", status: "plan", answer: "Included in the subscription. Named support contact, 1-business-day SLA." },
  // §V Technical / §VI (25%)
  { section: "VI · Identity", requirement: "Authenticate exclusively via County IdP (SAML/OIDC), MFA via IdP, no local accounts", status: "simulated", answer: "Demo shows a signed-in user. Production: OIDC/SAML federation to the County IdP, SCIM deprovisioning, a break-glass account only with County approval." },
  { section: "VI · Access control", requirement: "RBAC aligned to County permissions", status: "simulated", answer: "Roles: Case Manager, Supervisor, Provider, Family. Per-field visibility is shown in the family portal. Production: enforced server-side with Postgres row-level security." },
  { section: "VI · Logging", requirement: "Audit logs of user and admin actions, retained ≥1 year, exportable", status: "built", answer: "Every action writes an attributed, timestamped event (see the activity trail). Production: append-only audit table, 1-year+ retention, export on request." },
  { section: "VI · Data sovereignty", requirement: "All data, backups, logs exclusively in the US", status: "plan", answer: "US-only regions for hosting, database, backups, logs and AI inference. No offshore support access." },
  { section: "VI · Data protection", requirement: "TLS 1.2+ in transit, AES-256 at rest", status: "plan", answer: "TLS 1.2+ enforced at the edge. Managed Postgres and backups encrypted with AES-256." },
  { section: "VI · Data ownership", requirement: "County owns data; no third-party sharing; return and certified deletion on exit", status: "plan", answer: "Contractual. Full export (CSV/JSON) at any time, return on termination, certified deletion within 30 days." },
  { section: "VI · AI", requirement: "(Not in RFP) AI use must not expose County data", status: "built", answer: "The report model receives only the question text and the field catalog. Case records never leave the browser in the demo, or the County tenant in production." },
  { section: "V · Administrative", requirement: "HIPAA compliance documentation, SOC 2 Type II", status: "plan", answer: "HIPAA-eligible infrastructure under a BAA. SOC 2 Type II via the hosting platform plus our own audit roadmap." },
];
