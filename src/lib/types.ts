// Domain model for the Juvenile Substance Use Services Coordination Program.
// See docs/ARCHITECTURE.md § Data model for the reasoning behind each entity.

/** Sequential Intercept-style stages a youth moves through. Order matters. */
export const STAGES = [
  "Referred",
  "Intake",
  "Screened",
  "Referred to Treatment",
  "In Treatment",
  "Completed",
  "Discharged",
] as const;
export type Stage = (typeof STAGES)[number];

/** Closed stages: the youth has left the program. */
export const CLOSED_STAGES: Stage[] = ["Completed", "Discharged"];

/** How the youth entered the program (the "intercept" point). */
export const PATHWAYS = ["Diversion", "Probation", "Family Court"] as const;
export type Pathway = (typeof PATHWAYS)[number];

export const RISK_LEVELS = ["Low", "Moderate", "High"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const GENDERS = ["Female", "Male", "Nonbinary"] as const;
export type Gender = (typeof GENDERS)[number];

export type Modality =
  | "Outpatient"
  | "Intensive Outpatient"
  | "Family Therapy (MST/FFT)"
  | "Residential";

export interface Provider {
  id: string;
  name: string;
  modality: Modality;
}

export interface CaseManager {
  id: string;
  name: string;
}

export interface Contact {
  role: "Youth" | "Guardian" | "Probation Officer" | "Judge" | "Attorney";
  name: string;
  phone?: string;
  /** Guardians can opt in to SMS reminders (RFP §V Programmatic). */
  smsOptIn?: boolean;
}

export interface Screening {
  id: string;
  tool: "CRAFFT 2.1";
  date: string; // ISO date
  /** Raw answers so the score is auditable, not just the result. */
  answers: Record<string, boolean>;
  score: number;
  risk: RiskLevel;
}

export type ReferralStatus = "Pending" | "Engaged" | "Completed" | "Dropped";

export interface Referral {
  id: string;
  providerId: string;
  date: string; // ISO date referred
  firstAppointment?: string; // ISO date of first attended appointment
  status: ReferralStatus;
  closedDate?: string;
}

/** A signed form retained in the record (RFP §V: "forms requiring secure signatures that are then retained"). */
export interface SignedDocument {
  id: string;
  title: string;
  /** Part 2 consent: unlocks sharing of screening results with the treatment provider. */
  kind: "part2_consent" | "release" | "other";
  signedBy: string;
  signedAt: string; // ISO datetime
  method: "Typed e-signature";
}

export interface Task {
  id: string;
  title: string;
  due: string; // ISO date
  done: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string; // ISO datetime
  kind: "stage" | "screening" | "referral" | "note" | "sms" | "task" | "appointment" | "document" | "export";
  text: string;
  /** Who did it. Feeds the audit-log story (RFP §VI.2.3). */
  actor: string;
}

export interface Youth {
  id: string;
  firstName: string;
  lastInitial: string;
  age: number;
  gender: Gender;
  pathway: Pathway;
  stage: Stage;
  caseManagerId: string;
  referralDate: string; // ISO date entered program
  riskLevel?: RiskLevel; // from most recent screening
  contacts: Contact[];
  screenings: Screening[];
  referrals: Referral[];
  tasks: Task[];
  timeline: TimelineEvent[];
  nextAppointment?: string; // ISO datetime
  documents?: SignedDocument[];
}

export interface Dataset {
  generatedAt: string;
  youth: Youth[];
  providers: Provider[];
  caseManagers: CaseManager[];
}
