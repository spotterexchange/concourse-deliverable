"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CrafftForm } from "@/components/CrafftForm";
import { Card, Loading, PageHeader, RiskBadge, StageBadge, btn, btnSecondary, input } from "@/components/ui";
import { CRAFFT_PART_A, CRAFFT_PART_B } from "@/lib/crafft";
import { isOverdue, useStore, youthName } from "@/lib/store";
import type { Youth } from "@/lib/types";

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export default function YouthProfile() {
  const { id } = useParams<{ id: string }>();
  const { data } = useStore();
  const [view, setView] = useState<"staff" | "family">("staff");
  if (!data) return <Loading />;
  const y = data.youth.find((x) => x.id === id);
  if (!y) return <p>Youth not found. <Link href="/youth" className="underline">Back to caseload</Link></p>;

  return (
    <>
      <div className="text-sm mb-2"><Link href="/youth" className="text-ink-2 hover:underline">← Caseload</Link></div>
      <PageHeader
        title={youthName(y)}
        sub={`${y.id} · Age ${y.age} · ${y.gender} · ${y.pathway} · Case manager ${data.caseManagers.find((c) => c.id === y.caseManagerId)?.name}`}
        action={
          <div className="inline-flex rounded-md border border-line bg-card p-0.5 text-sm" role="tablist" aria-label="View as">
            {(["staff", "family"] as const).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded ${view === v ? "bg-brand text-white" : "text-ink-2"}`}>
                {v === "staff" ? "Staff view" : "Family portal preview"}
              </button>
            ))}
          </div>
        }
      />
      {view === "staff" ? <StaffView y={y} /> : <FamilyView y={y} />}
    </>
  );
}

function StaffView({ y }: { y: Youth }) {
  const { data, toggleTask } = useStore();
  const provider = data!.providers.find((p) => p.id === y.referrals.at(-1)?.providerId);
  const latest = y.screenings.at(-1);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title="Status">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
            <div><div className="text-xs text-ink-2">Stage</div><StageBadge stage={y.stage} /></div>
            <div><div className="text-xs text-ink-2">Risk</div><RiskBadge risk={y.riskLevel} /></div>
            <div><div className="text-xs text-ink-2">Provider</div>{provider ? `${provider.name}` : "—"}</div>
            <div><div className="text-xs text-ink-2">Referred to program</div>{y.referralDate}</div>
            {y.nextAppointment && <div><div className="text-xs text-ink-2">Next appointment</div>{fmtDateTime(y.nextAppointment)}</div>}
          </div>
          <NextStep y={y} />
        </Card>

        {latest && (
          <Card title={`Latest screening: ${latest.tool} on ${latest.date}`}>
            <div className="text-sm mb-2">Score <strong>{latest.score}</strong> · <RiskBadge risk={latest.risk} /></div>
            <ul className="text-xs text-ink-2 grid sm:grid-cols-2 gap-x-4 gap-y-1">
              {[...CRAFFT_PART_A, ...CRAFFT_PART_B].filter((q) => q.id in latest.answers).map((q) => (
                <li key={q.id} className="flex gap-2"><span className={`w-7 shrink-0 font-medium ${latest.answers[q.id] ? "text-ink" : "text-ink-3"}`}>{latest.answers[q.id] ? "Yes" : "No"}</span><span className="truncate" title={q.text}>{q.text}</span></li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Activity & audit trail">
          <ol className="space-y-3">
            {y.timeline.map((e) => (
              <li key={e.id} className="flex gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-series-1 mt-1.5 shrink-0" />
                <div>
                  <div>{e.text}</div>
                  <div className="text-xs text-ink-3">{fmtDateTime(e.date)} · {e.actor}</div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="space-y-4">
        <Card title="Tasks">
          {y.tasks.length === 0 && <p className="text-sm text-ink-3">No tasks.</p>}
          <ul className="space-y-2">
            {y.tasks.map((t) => (
              <li key={t.id}>
                <label className="flex gap-2 text-sm items-start">
                  <input type="checkbox" className="mt-0.5" checked={t.done} onChange={() => toggleTask(y.id, t.id)} />
                  <span className={t.done ? "line-through text-ink-3" : ""}>
                    {t.title}<br />
                    <span className={`text-xs ${!t.done && isOverdue(t.due) ? "text-red-700" : "text-ink-3"}`}>due {t.due}{!t.done && isOverdue(t.due) ? " · overdue" : ""}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
        <Contacts y={y} />
      </div>
    </div>
  );
}

/** The one action that moves this case forward, chosen by stage. */
function NextStep({ y }: { y: Youth }) {
  const { data, recordScreening, referToProvider, setStage } = useStore();
  const [providerId, setProviderId] = useState("");
  const providers = data!.providers;
  const provider = providers.find((p) => p.id === y.referrals.at(-1)?.providerId);

  const box = (title: string, children: React.ReactNode) => (
    <div className="rounded-md border border-series-1/30 bg-blue-50/50 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-brand mb-2">Next step · {title}</div>
      {children}
    </div>
  );

  switch (y.stage) {
    case "Referred":
    case "Intake":
      return box("Administer CRAFFT 2.1 screening", <CrafftForm onSubmit={(s) => recordScreening(y.id, s)} />);
    case "Screened": {
      const suggested = y.riskLevel === "High" ? ["Intensive Outpatient", "Family Therapy (MST/FFT)", "Residential"] : ["Outpatient", "Family Therapy (MST/FFT)"];
      return box("Refer to a treatment provider", (
        <div className="flex flex-wrap gap-2 items-center">
          <select className={`${input} w-auto flex-1 min-w-56`} value={providerId} onChange={(e) => setProviderId(e.target.value)}>
            <option value="">Choose provider…</option>
            {providers.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.modality}){suggested.includes(p.modality) ? " · suggested for risk level" : ""}</option>)}
          </select>
          <button className={btn} disabled={!providerId} onClick={() => referToProvider(y.id, providerId)}>Send referral</button>
          <button className={btnSecondary} onClick={() => setStage(y.id, "Completed", "Completed brief intervention, no treatment referral needed")}>Close: brief intervention only</button>
        </div>
      ));
    }
    case "Referred to Treatment":
      return box(`Awaiting first appointment at ${provider?.name}`, (
        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={() => setStage(y.id, "In Treatment", `First appointment attended at ${provider?.name}`)}>Mark first appointment attended</button>
          <button className={btnSecondary} onClick={() => setStage(y.id, "Discharged", `Discharged: did not engage with ${provider?.name}`)}>Discharge: did not engage</button>
        </div>
      ));
    case "In Treatment":
      return box(`In treatment at ${provider?.name}`, (
        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={() => setStage(y.id, "Completed", `Completed treatment at ${provider?.name}`)}>Record successful completion</button>
          <button className={btnSecondary} onClick={() => setStage(y.id, "Discharged", `Discharged: left treatment at ${provider?.name} early`)}>Discharge: left early</button>
        </div>
      ));
    default:
      return <p className="text-sm text-ink-2">Case closed ({y.stage}). Outcome is included in program and provider reports.</p>;
  }
}

function Contacts({ y }: { y: Youth }) {
  const { logEvent } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  const guardian = y.contacts.find((c) => c.role === "Guardian");
  // Reminder text deliberately names no provider or service type: an SMS can be read
  // by anyone holding the phone, and naming a substance-use provider would disclose
  // Part 2-protected information (ADR-006).
  const when = y.nextAppointment ? fmtDateTime(y.nextAppointment) : null;
  const message = when
    ? `Erie County Youth Services: reminder that ${y.firstName} has an appointment ${when}. Questions? Call your case manager at (716) 555-0100. Reply STOP to opt out.`
    : `Erie County Youth Services: please call your case manager at (716) 555-0100 to schedule ${y.firstName}'s next appointment. Reply STOP to opt out.`;

  return (
    <Card title="Contacts">
      <ul className="space-y-2 text-sm">
        {y.contacts.map((c) => (
          <li key={c.role + c.name}>
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-ink-2">{c.role}{c.phone ? ` · ${c.phone}` : ""}{c.smsOptIn ? " · SMS opted in" : ""}</div>
          </li>
        ))}
      </ul>
      {guardian?.smsOptIn && (
        <div className="mt-3 border-t border-line pt-3">
          <div className="text-xs text-ink-2 mb-1">Text reminder to guardian</div>
          <p className="text-xs bg-surface rounded p-2 mb-2">{message}</p>
          <button
            className={`${btnSecondary} w-full`}
            onClick={() => { logEvent(y.id, "sms", `SMS reminder sent to ${guardian.name} (${guardian.phone})`); setSent(new Date().toLocaleTimeString()); }}
          >
            {sent ? `Sent ✓ ${sent} (simulated)` : "Send text reminder"}
          </button>
        </div>
      )}
    </Card>
  );
}

/** What a guardian sees in the secondary portal: logistics only, no clinical or court detail. */
function FamilyView({ y }: { y: Youth }) {
  const guardian = y.contacts.find((c) => c.role === "Guardian");
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <p className="text-sm text-ink-2 mb-1">Welcome, {guardian?.name}</p>
          <h2 className="text-lg font-semibold mb-3">{y.firstName}&apos;s next steps</h2>
          {y.nextAppointment
            ? <p className="text-sm">Next appointment: <strong>{fmtDateTime(y.nextAppointment)}</strong></p>
            : <p className="text-sm">No appointment scheduled yet. Your case manager will reach out.</p>}
          <div className="mt-4 rounded-md border border-line p-3 text-sm flex items-center justify-between gap-3">
            <div><div className="font-medium">Consent to share information</div><div className="text-xs text-ink-2">Lets the program coordinate with {y.firstName}&apos;s treatment team</div></div>
            <button className={btnSecondary}>Review &amp; sign</button>
          </div>
        </Card>
      </div>
      <Card title="What the family portal hides">
        <ul className="text-sm text-ink-2 list-disc pl-4 space-y-1">
          <li>Screening answers, scores and risk level</li>
          <li>Treatment provider clinical notes</li>
          <li>Court, probation and attorney details</li>
          <li>Case manager notes and internal tasks</li>
        </ul>
        <p className="text-xs text-ink-3 mt-3">Visibility is set per field by role, so the County can adjust it without code. Substance-use treatment records follow 42 CFR Part 2 consent rules.</p>
      </Card>
    </div>
  );
}
