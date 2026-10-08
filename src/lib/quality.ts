import { hasPart2Consent } from "./consent";
import type { Dataset, Youth } from "./types";

// Data-quality checks (RFP Proposal Content §6: "quality assurance measures").
// Each check names records that are stuck or incomplete, so a supervisor can fix
// the data before it skews a report. Pure function, unit-tested in stress S6.

export interface QualityCheck { id: string; label: string; why: string; youth: Youth[] }

const DAY = 86_400_000;

export function qualityChecks(ds: Dataset, now = Date.now()): QualityCheck[] {
  const age = (iso: string) => (now - Date.parse(iso)) / DAY;
  const open = ds.youth.filter((y) => y.stage !== "Completed" && y.stage !== "Discharged");
  return [
    {
      id: "unscreened", label: "Not screened 7+ days after referral",
      why: "Screening drives risk level and referral; unscreened youth are missing from risk reports.",
      youth: open.filter((y) => (y.stage === "Referred" || y.stage === "Intake") && age(y.referralDate) > 7),
    },
    {
      id: "stalled_referral", label: "Treatment referral with no first appointment after 21 days",
      why: "Likely a lost referral. Engagement and wait-time numbers are only as good as these updates.",
      youth: open.filter((y) => y.stage === "Referred to Treatment" && y.referrals.at(-1) && age(y.referrals.at(-1)!.date) > 21),
    },
    {
      id: "no_appointment", label: "In treatment with no upcoming appointment",
      why: "No appointment means no reminder can go out.",
      youth: open.filter((y) => y.stage === "In Treatment" && (!y.nextAppointment || Date.parse(y.nextAppointment) < now)),
    },
    {
      id: "no_consent", label: "Referred without Part 2 consent",
      why: "The provider can't receive screening results until the guardian signs.",
      youth: open.filter((y) => (y.stage === "Referred to Treatment" || y.stage === "In Treatment") && !hasPart2Consent(y)),
    },
  ];
}
