import { scoreCrafft, CRAFFT_PART_A, CRAFFT_PART_B } from "./crafft";
import type {
  CaseManager,
  Dataset,
  Gender,
  Pathway,
  Provider,
  Referral,
  RiskLevel,
  Screening,
  Stage,
  Task,
  TimelineEvent,
  Youth,
} from "./types";

// Synthetic data generator. Everything here is fictional: no real youth,
// providers or staff. The generator *simulates* each case forward in time
// (intake → screening → referral → engagement → completion) using per-provider
// parameters, so the dashboard numbers come out of a process instead of being
// typed in. That makes the demo's "provider X engages youth faster than Y"
// story internally consistent.

const SEED = 20261015; // RFP due date: fixed seed means a reproducible demo.

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PROVIDERS: (Provider & { waitDays: [number, number]; engage: number; complete: number })[] = [
  { id: "p1", name: "Riverbend Youth Recovery", modality: "Outpatient", waitDays: [5, 12], engage: 0.85, complete: 0.7 },
  { id: "p2", name: "Kestrel Family Therapy", modality: "Family Therapy (MST/FFT)", waitDays: [3, 8], engage: 0.92, complete: 0.82 },
  { id: "p3", name: "Northgate Teen Outpatient", modality: "Outpatient", waitDays: [14, 35], engage: 0.6, complete: 0.5 },
  { id: "p4", name: "Larkspur Adolescent IOP", modality: "Intensive Outpatient", waitDays: [6, 15], engage: 0.8, complete: 0.62 },
  { id: "p5", name: "Cedar Hollow Residential", modality: "Residential", waitDays: [10, 28], engage: 0.88, complete: 0.66 },
];

export const CASE_MANAGERS: CaseManager[] = [
  { id: "cm1", name: "Dana Whitfield" },
  { id: "cm2", name: "Marcus Ortega" },
  { id: "cm3", name: "Priya Raman" },
  { id: "cm4", name: "Jordan Kowalski" },
];

const FIRST = ["Aiden", "Maya", "Jalen", "Sofia", "Tyrese", "Emma", "Luis", "Aaliyah", "Noah", "Zoe", "Elijah", "Ava", "Mateo", "Nia", "Liam", "Isabella", "Darius", "Chloe", "Kai", "Layla", "Ethan", "Amara", "Caleb", "Jasmine", "Owen", "Riley", "Xavier", "Leah", "Andre", "Grace"];
const LAST_INITIALS = "ABCDEFGHJKLMNOPRSTVWY";
const GUARDIAN_FIRST = ["Angela", "Robert", "Tanya", "Michael", "Lisa", "Carlos", "Denise", "James", "Monique", "Kevin"];
const JUDGES = ["Hon. R. Castellano", "Hon. T. Brennan", "Hon. L. Okafor"];
const POS = ["PO S. Lindqvist", "PO D. Marsh", "PO K. Abernathy", "PO J. Treadwell"];

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString();
const isoDate = (t: number) => iso(t).slice(0, 10);
/** Appointment on the half hour between 1:00 and 4:30 pm local time. */
const appointmentAt = (day: number, slot: number) => {
  const d = new Date(day);
  d.setHours(13 + Math.floor(slot / 2), (slot % 2) * 30, 0, 0);
  return d.toISOString();
};

export function generateDataset(now = Date.now()): Dataset {
  const rand = mulberry32(SEED);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
  const between = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
  const chance = (p: number) => rand() < p;
  let seq = 0;
  const id = (prefix: string) => `${prefix}-${(++seq).toString(36)}`;

  const youth: Youth[] = [];
  for (let i = 0; i < 96; i++) {
    const caseManager = CASE_MANAGERS[i % CASE_MANAGERS.length];
    const pathway: Pathway = pick(["Diversion", "Diversion", "Probation", "Probation", "Family Court"] as const);
    const gender: Gender = chance(0.03) ? "Nonbinary" : chance(0.55) ? "Male" : "Female";
    // Skew toward recent referrals so the active caseload looks like a live program,
    // while older cases supply closed outcomes for the provider comparison.
    const referredAt = now - (chance(0.55) ? between(0, 110) : between(111, 330)) * DAY;
    const timeline: TimelineEvent[] = [];
    const log = (t: number, kind: TimelineEvent["kind"], text: string, actor = caseManager.name) =>
      timeline.push({ id: id("e"), date: iso(t), kind, text, actor });

    let stage: Stage = "Referred";
    log(referredAt, "stage", `Referred to program via ${pathway}`, pathway === "Family Court" ? pick(JUDGES) : pathway === "Probation" ? pick(POS) : "Diversion intake desk");

    const screenings: Screening[] = [];
    const referrals: Referral[] = [];
    let riskLevel: RiskLevel | undefined;

    // Simulate forward; stop as soon as the next event would be in the future.
    let t = referredAt + between(1, 7) * DAY;
    simulate: {
      if (t > now) break simulate;
      stage = "Intake";
      log(t, "stage", "Intake completed");

      t += between(0, 5) * DAY;
      if (t > now) break simulate;
      const answers: Record<string, boolean> = {};
      const useProfile = rand();
      for (const q of CRAFFT_PART_A) answers[q.id] = rand() < 0.35 + useProfile * 0.5;
      for (const q of CRAFFT_PART_B) answers[q.id] = rand() < useProfile * 0.75;
      const { score, risk } = scoreCrafft(answers);
      riskLevel = risk;
      screenings.push({ id: id("s"), tool: "CRAFFT 2.1", date: isoDate(t), answers, score, risk });
      stage = "Screened";
      log(t, "screening", `CRAFFT 2.1 administered: score ${score} (${risk} risk)`);

      // Low-risk youth often finish with brief intervention, no treatment referral.
      if (risk === "Low" && chance(0.6)) {
        t += between(14, 30) * DAY;
        if (t > now) break simulate;
        stage = "Completed";
        log(t, "stage", "Completed brief intervention, no treatment referral needed");
        break simulate;
      }

      t += between(1, 7) * DAY;
      if (t > now) break simulate;
      // High risk → more intensive care; outpatient providers still take a share.
      const eligible = PROVIDERS.filter((p) => (risk === "High" ? p.modality !== "Outpatient" || chance(0.5) : p.modality !== "Residential"));
      const provider = pick(eligible.length ? eligible : PROVIDERS);
      const referral: Referral = { id: id("r"), providerId: provider.id, date: isoDate(t), status: "Pending" };
      referrals.push(referral);
      stage = "Referred to Treatment";
      log(t, "referral", `Referred to ${provider.name} (${provider.modality})`);

      if (!chance(provider.engage)) {
        t += between(30, 45) * DAY;
        if (t > now) break simulate;
        referral.status = "Dropped";
        referral.closedDate = isoDate(t);
        stage = "Discharged";
        log(t, "stage", `Discharged: did not engage with ${provider.name}`);
        break simulate;
      }

      t += between(...provider.waitDays) * DAY;
      if (t > now) break simulate;
      referral.firstAppointment = isoDate(t);
      referral.status = "Engaged";
      stage = "In Treatment";
      log(t, "referral", `First appointment attended at ${provider.name}`, provider.name);

      const completes = chance(provider.complete);
      t += (completes ? between(60, 120) : between(20, 60)) * DAY;
      if (t > now) break simulate;
      referral.status = completes ? "Completed" : "Dropped";
      referral.closedDate = isoDate(t);
      stage = completes ? "Completed" : "Discharged";
      log(t, "stage", completes ? `Completed treatment at ${provider.name}` : `Discharged: left treatment at ${provider.name} early`, provider.name);
    }

    const open = stage !== "Completed" && stage !== "Discharged";
    const tasks: Task[] = [];
    if (open) {
      const templates: Record<Stage, string[]> = {
        Referred: ["Schedule intake appointment", "Obtain signed consent (42 CFR Part 2)"],
        Intake: ["Administer CRAFFT screening", "Collect school records release"],
        Screened: ["Select treatment provider", "Review screening with guardian"],
        "Referred to Treatment": ["Confirm provider received referral", "Follow up on first appointment"],
        "In Treatment": ["Monthly progress check with provider", "Update probation officer"],
        Completed: [],
        Discharged: [],
      };
      for (const title of templates[stage]) {
        // Mostly upcoming, some slipping: a realistic, not alarming, overdue count.
        tasks.push({ id: id("t"), title, due: isoDate(now + (chance(0.25) ? between(-8, -1) : between(0, 21)) * DAY), done: false });
      }
    }

    const guardianLast = pick(LAST_INITIALS.split(""));
    const contacts: Youth["contacts"] = [
      { role: "Guardian", name: `${pick(GUARDIAN_FIRST)} ${guardianLast}.`, phone: `(716) 555-01${between(10, 99)}`, smsOptIn: chance(0.8) },
    ];
    const age = between(13, 19);
    // Older youth often have their own phone; the RFP asks for reminders to youth *and* families.
    if (age >= 15 && chance(0.6)) contacts.unshift({ role: "Youth", name: "Self", phone: `(716) 555-03${between(10, 99)}`, smsOptIn: chance(0.7) });
    if (pathway === "Probation") contacts.push({ role: "Probation Officer", name: pick(POS), phone: `(716) 555-02${between(10, 99)}` });
    if (pathway === "Family Court") contacts.push({ role: "Judge", name: pick(JUDGES) });

    youth.push({
      id: `Y-${1001 + i}`,
      firstName: pick(FIRST),
      lastInitial: pick(LAST_INITIALS.split("")),
      age,
      gender,
      pathway,
      stage,
      caseManagerId: caseManager.id,
      referralDate: isoDate(referredAt),
      riskLevel,
      contacts,
      screenings,
      referrals,
      tasks,
      timeline: timeline.reverse(), // newest first
      // Youth who reached treatment signed Part 2 consent at referral (sharing with the provider requires it).
      documents: referrals.length && chance(0.85)
        ? [{ id: id("d"), title: "Consent to share SUD information (42 CFR Part 2)", kind: "part2_consent" as const, signedBy: contacts.find((c) => c.role === "Guardian")!.name, signedAt: iso(Date.parse(referrals[0].date) - DAY), method: "Typed e-signature" as const }]
        : [],
      nextAppointment: stage === "In Treatment" ? appointmentAt(now + between(1, 10) * DAY, between(0, 7)) : undefined,
    });
  }

  return {
    generatedAt: iso(now),
    youth,
    providers: PROVIDERS.map(({ id, name, modality }) => ({ id, name, modality })),
    caseManagers: CASE_MANAGERS,
  };
}
