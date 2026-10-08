import type { RiskLevel } from "./types";

// CRAFFT 2.1 (Center for Adolescent Behavioral Health Research, Boston
// Children's Hospital). Validated for ages 12–21. Part A asks about use in the
// past 12 months; if all Part A answers are "no", only the CAR question is
// asked. Score = number of "yes" answers in Part B. A score ≥ 2 is the
// published cutoff for further assessment.
//
// Part A is simplified to yes/no here; the published form asks for days of
// use. The production form would follow the licensed wording exactly.

export const CRAFFT_PART_A = [
  { id: "a1", text: "In the past 12 months, did you drink any alcohol (more than a few sips)?" },
  { id: "a2", text: "In the past 12 months, did you use any marijuana (cannabis, weed, oil, wax, or hash by smoking, vaping, dabbing, or in edibles)?" },
  { id: "a3", text: "In the past 12 months, did you use anything else to get high (other illegal drugs, prescription or over-the-counter medications, or things you sniff, huff, vape, or inject)?" },
] as const;

export const CRAFFT_PART_B = [
  { id: "c", letter: "C", text: "Have you ever ridden in a CAR driven by someone (including yourself) who was \"high\" or had been using alcohol or drugs?" },
  { id: "r", letter: "R", text: "Do you ever use alcohol or drugs to RELAX, feel better about yourself, or fit in?" },
  { id: "a", letter: "A", text: "Do you ever use alcohol or drugs while you are by yourself, or ALONE?" },
  { id: "f1", letter: "F", text: "Do you ever FORGET things you did while using alcohol or drugs?" },
  { id: "f2", letter: "F", text: "Do your FAMILY or FRIENDS ever tell you that you should cut down on your drinking or drug use?" },
  { id: "t", letter: "T", text: "Have you ever gotten into TROUBLE while you were using alcohol or drugs?" },
] as const;

/** Only CAR is asked when there is no reported use in Part A. */
export function partBQuestions(answers: Record<string, boolean>) {
  const anyUse = CRAFFT_PART_A.some((q) => answers[q.id]);
  return anyUse ? CRAFFT_PART_B : CRAFFT_PART_B.filter((q) => q.id === "c");
}

export function scoreCrafft(answers: Record<string, boolean>): { score: number; risk: RiskLevel } {
  const asked = partBQuestions(answers);
  const score = asked.filter((q) => answers[q.id]).length;
  // Risk banding: 0 → Low, 1 → Moderate (brief advice), ≥2 → High (assess further).
  const risk: RiskLevel = score >= 2 ? "High" : score === 1 ? "Moderate" : "Low";
  return { score, risk };
}

/** Other validated tools offered at configuration time (RFP §V asks for a list). */
export const SCREENING_LIBRARY = [
  { name: "CRAFFT 2.1", ages: "12–21", purpose: "Substance use risk", status: "Built in (live in demo)" },
  { name: "GAIN-SS", ages: "12+", purpose: "Internalizing, externalizing, substance, crime/violence", status: "Configurable form" },
  { name: "PHQ-A", ages: "11–17", purpose: "Adolescent depression", status: "Configurable form" },
  { name: "MAYSI-2", ages: "12–17", purpose: "Justice-system mental health triage", status: "Configurable form (licensed)" },
  { name: "GAD-7", ages: "12+", purpose: "Anxiety", status: "Configurable form" },
  { name: "ACE-Q Teen", ages: "13–19", purpose: "Adverse childhood experiences", status: "Configurable form" },
];
