"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CrafftForm } from "@/components/CrafftForm";
import { Card, Loading, PageHeader, RiskBadge, StageBadge, btn, btnSecondary, input } from "@/components/ui";
import { CRAFFT_PART_A, CRAFFT_PART_B } from "@/lib/crafft";
import { hasPart2Consent, isOverdue, useStore, youthName } from "@/lib/store";
import { CLOSED_STAGES, type Youth } from "@/lib/types";

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const VIEWS = { staff: "Staff view", family: "Family portal", provider: "Provider portal" } as const;
type View = keyof typeof VIEWS;

const PART2_TITLE = "Consent to share SUD information (42 CFR Part 2)";

export default function YouthProfile() {
  const { id } = useParams<{ id: string }>();
  const { data } = useStore();
  const [view, setView] = useState<View>("staff");
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
            {(Object.keys(VIEWS) as View[]).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded ${view === v ? "bg-brand text-white" : "text-ink-2"}`}>
                {VIEWS[v]}
              </button>
            ))}
          </div>
        }
      />
      {view !== "staff" && (
        <p className="mb-3 text-xs text-ink-2">Preview of what a {view === "family" ? "parent or guardian" : "treatment provider"} sees when signed in to their portal. Fields are hidden by role, server-side in production.</p>
      )}
      {view === "staff" ? <StaffView y={y} /> : view === "family" ? <FamilyView y={y} /> : <ProviderView y={y} />}
    </>
  );
}

function StaffView({ y }: { y: Youth }) {
  const { data } = useStore();
  const provider = data!.providers.find((p) => p.id === y.referrals.at(-1)?.providerId);
  const latest = y.screenings.at(-1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title="Status">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
            <div><div className="text-xs text-ink-2">Stage</div><StageBadge stage={y.stage} /></div>
            <div><div className="text-xs text-ink-2">Risk</div><RiskBadge risk={y.riskLevel} /></div>
            <div><div className="text-xs text-ink-2">Provider</div>{provider ? provider.name : "—"}</div>
            <div><div className="text-xs text-ink-2">Referred to program</div>{y.referralDate}</div>
            <div><div className="text-xs text-ink-2">Part 2 consent</div>{hasPart2Consent(y) ? "Signed" : <span className="text-amber-800">Not signed</span>}</div>
          </div>
          <NextStep y={y} />
        </Card>

        {latest && (
          <Card title={`Latest screening: ${latest.tool} on ${latest.date}`}>
            <div className="text-sm mb-2">Score <strong>{latest.score}</strong> · <RiskBadge risk={latest.risk} /></div>
            <ul className="text-xs text-ink-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {[...CRAFFT_PART_A, ...CRAFFT_PART_B].filter((q) => q.id in latest.answers).map((q) => (
                <li key={q.id} className="flex gap-2"><span className={`w-7 shrink-0 font-medium ${latest.answers[q.id] ? "text-ink" : "text-ink-3"}`}>{latest.answers[q.id] ? "Yes" : "No"}</span><span className="truncate min-w-0" title={q.text}>{q.text}</span></li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Case notes & audit trail">
          <NoteComposer y={y} />
          <ol className="space-y-3 mt-4">
            {y.timeline.map((e) => (
              <li key={e.id} className="flex gap-3 text-sm">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${e.kind === "note" ? "bg-amber-500" : "bg-series-1"}`} />
                <div className="min-w-0">
                  <div className="break-words">{e.kind === "note" && <span className="text-xs font-semibold text-amber-800 mr-1">NOTE</span>}{e.text}</div>
                  <div className="text-xs text-ink-3">{fmtDateTime(e.date)} · {e.actor}</div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="space-y-4">
        <Appointment y={y} />
        <Tasks y={y} />
        <Contacts y={y} />
        <Documents y={y} />
      </div>
    </div>
  );
}

function NoteComposer({ y }: { y: Youth }) {
  const { addNote } = useStore();
  const [text, setText] = useState("");
  return (
    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { addNote(y.id, text); setText(""); } }}>
      <input className={input} value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} placeholder="Add a case note…" aria-label="Case note" />
      <button className={btnSecondary} disabled={!text.trim()}>Add note</button>
    </form>
  );
}

function Appointment({ y }: { y: Youth }) {
  const { scheduleAppointment } = useStore();
  const [when, setWhen] = useState("");
  const closed = CLOSED_STAGES.includes(y.stage);
  return (
    <Card title="Next appointment">
      <p className="text-sm mb-3">{y.nextAppointment ? fmtDateTime(y.nextAppointment) : closed ? "Case closed." : "None scheduled."}</p>
      {!closed && (
        <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (when) { scheduleAppointment(y.id, when); setWhen(""); } }}>
          <input type="datetime-local" className={`${input} flex-1 min-w-0 basis-48`} value={when} min={new Date().toISOString().slice(0, 16)} onChange={(e) => setWhen(e.target.value)} aria-label="Appointment date and time" />
          <button className={btnSecondary} disabled={!when}>{y.nextAppointment ? "Reschedule" : "Schedule"}</button>
        </form>
      )}
    </Card>
  );
}

function Tasks({ y }: { y: Youth }) {
  const { toggleTask, addTask } = useStore();
  const [title, setTitle] = useState("");
  const [due, setDue] = useState(() => new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10));
  return (
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
      <form className="mt-3 pt-3 border-t border-line space-y-2" onSubmit={(e) => { e.preventDefault(); if (title.trim() && due) { addTask(y.id, title, due); setTitle(""); } }}>
        <input className={input} value={title} maxLength={140} onChange={(e) => setTitle(e.target.value)} placeholder="New task…" aria-label="New task" />
        <div className="flex gap-2">
          <input type="date" className={`${input} min-w-0`} value={due} onChange={(e) => setDue(e.target.value)} aria-label="Task due date" />
          <button className={btnSecondary} disabled={!title.trim() || !due}>Add</button>
        </div>
      </form>
    </Card>
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
        <>
          <div className="flex flex-wrap gap-2 items-center">
            <select className={`${input} w-auto flex-1 min-w-56`} value={providerId} onChange={(e) => setProviderId(e.target.value)} aria-label="Treatment provider">
              <option value="">Choose provider…</option>
              {providers.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.modality}){suggested.includes(p.modality) ? " · suggested for risk level" : ""}</option>)}
            </select>
            <button className={btn} disabled={!providerId} onClick={() => referToProvider(y.id, providerId)}>Send referral</button>
            <button className={btnSecondary} onClick={() => setStage(y.id, "Completed", "Completed brief intervention, no treatment referral needed")}>Close: brief intervention only</button>
          </div>
          {!hasPart2Consent(y) && <p className="text-xs text-amber-800 mt-2">Part 2 consent isn&apos;t signed yet. The provider will receive the referral without screening results until the guardian signs in the family portal.</p>}
        </>
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
  const recipients = y.contacts.filter((c) => (c.role === "Guardian" || c.role === "Youth") && c.smsOptIn && c.phone);
  // Reminder text deliberately names no provider or service type: an SMS can be read
  // by anyone holding the phone, and naming a substance-use provider would disclose
  // Part 2-protected information (ADR-006).
  const when = y.nextAppointment ? fmtDateTime(y.nextAppointment) : null;
  const message = when
    ? `Erie County Youth Services: reminder that ${y.firstName} has an appointment ${when}. Questions? Call your case manager at (716) 555-0100. Reply STOP to opt out.`
    : `Erie County Youth Services: please call your case manager at (716) 555-0100 to schedule ${y.firstName}'s next appointment. Reply STOP to opt out.`;
  const closed = CLOSED_STAGES.includes(y.stage);

  return (
    <Card title="Contacts">
      <ul className="space-y-2 text-sm">
        {y.contacts.map((c) => (
          <li key={c.role + c.name}>
            <div className="font-medium">{c.role === "Youth" ? `${y.firstName} (youth)` : c.name}</div>
            <div className="text-xs text-ink-2">{c.role}{c.phone ? ` · ${c.phone}` : ""}{c.smsOptIn ? " · SMS opted in" : ""}</div>
          </li>
        ))}
      </ul>
      {recipients.length > 0 && !closed && (
        <div className="mt-3 border-t border-line pt-3">
          <div className="text-xs text-ink-2 mb-1">Text reminder to {recipients.map((r) => (r.role === "Youth" ? "youth" : "guardian")).join(" and ")}</div>
          <p className="text-xs bg-surface rounded p-2 mb-2">{message}</p>
          <button
            className={`${btnSecondary} w-full`}
            onClick={() => {
              for (const r of recipients) logEvent(y.id, "sms", `SMS reminder sent to ${r.role === "Youth" ? `${y.firstName} (youth)` : r.name} (${r.phone})`);
              setSent(new Date().toLocaleTimeString());
            }}
          >
            {sent ? `Sent ✓ ${sent} (simulated)` : "Send text reminder"}
          </button>
        </div>
      )}
    </Card>
  );
}

function Documents({ y }: { y: Youth }) {
  const docs = y.documents ?? [];
  return (
    <Card title="Signed documents">
      {docs.length === 0 ? <p className="text-sm text-ink-3">None yet. Families sign from their portal.</p> : (
        <ul className="space-y-2 text-sm">
          {docs.map((d) => (
            <li key={d.id}>
              <div className="font-medium">{d.title}</div>
              <div className="text-xs text-ink-2">{d.method} by {d.signedBy} · {fmtDateTime(d.signedAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** What a guardian sees in the secondary portal: logistics and forms only. */
function FamilyView({ y }: { y: Youth }) {
  const { signDocument } = useStore();
  const guardian = y.contacts.find((c) => c.role === "Guardian");
  const [signature, setSignature] = useState("");
  const [agree, setAgree] = useState(false);
  const signed = (y.documents ?? []).find((d) => d.kind === "part2_consent");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <p className="text-sm text-ink-2 mb-1">Welcome, {guardian?.name}</p>
          <h2 className="text-lg font-semibold mb-3">{y.firstName}&apos;s next steps</h2>
          {y.nextAppointment
            ? <p className="text-sm">Next appointment: <strong>{fmtDateTime(y.nextAppointment)}</strong></p>
            : <p className="text-sm">No appointment scheduled yet. Your case manager will reach out.</p>}
        </Card>
        <Card title={PART2_TITLE}>
          {signed ? (
            <p className="text-sm">Signed by <strong>{signed.signedBy}</strong> on {fmtDateTime(signed.signedAt)}. A copy is kept in {y.firstName}&apos;s record. You can withdraw consent at any time by contacting your case manager.</p>
          ) : (
            <form className="space-y-3 text-sm" onSubmit={(e) => { e.preventDefault(); if (agree && signature.trim()) signDocument(y.id, { title: PART2_TITLE, kind: "part2_consent", signedBy: signature.trim() }); }}>
              <p className="text-ink-2">I allow the Erie County Juvenile Substance Use Services Coordination Program to share {y.firstName}&apos;s screening results and treatment attendance with the treatment provider they are referred to, for the purpose of coordinating care. This consent expires one year from today or when {y.firstName} leaves the program.</p>
              <label className="flex gap-2 items-start"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" /> I have read and agree to this consent.</label>
              <div className="flex flex-wrap gap-2">
                <input className={`${input} flex-1 min-w-48`} value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type your full name to sign" aria-label="Typed signature" />
                <button className={btn} disabled={!agree || !signature.trim()}>Sign</button>
              </div>
            </form>
          )}
        </Card>
      </div>
      <Card title="What the family portal hides">
        <ul className="text-sm text-ink-2 list-disc pl-4 space-y-1">
          <li>Screening answers, scores and risk level</li>
          <li>Treatment provider clinical notes</li>
          <li>Court, probation and attorney details</li>
          <li>Case notes and internal tasks</li>
        </ul>
        <p className="text-xs text-ink-3 mt-3">Visibility is set per field by role, so the County can adjust it without code.</p>
      </Card>
    </div>
  );
}

/** What the treatment provider sees: the referral, plus screening only if Part 2 consent is signed. */
function ProviderView({ y }: { y: Youth }) {
  const { data } = useStore();
  const referral = y.referrals.at(-1);
  const provider = data!.providers.find((p) => p.id === referral?.providerId);
  if (!referral || !provider) {
    return <Card><p className="text-sm text-ink-2">No treatment referral yet. Providers only see youth referred to them.</p></Card>;
  }
  const consent = hasPart2Consent(y);
  const latest = y.screenings.at(-1);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card title={`${provider.name}: referral`}>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-ink-2">Youth</dt><dd>{youthName(y)}, age {y.age}</dd>
            <dt className="text-ink-2">Referred</dt><dd>{referral.date}</dd>
            <dt className="text-ink-2">Status</dt><dd>{referral.status}</dd>
            <dt className="text-ink-2">Next appointment</dt><dd>{y.nextAppointment ? fmtDateTime(y.nextAppointment) : "Not scheduled"}</dd>
            <dt className="text-ink-2">Case manager</dt><dd>{data!.caseManagers.find((c) => c.id === y.caseManagerId)?.name} · (716) 555-0100</dd>
          </dl>
        </Card>
        <Card title="Screening">
          {!consent ? (
            <p className="text-sm text-amber-800">Hidden: Part 2 consent has not been signed. Screening results will appear here once the guardian signs.</p>
          ) : latest ? (
            <p className="text-sm">{latest.tool} on {latest.date}: score <strong>{latest.score}</strong> · <RiskBadge risk={latest.risk} /></p>
          ) : <p className="text-sm text-ink-3">No screening recorded.</p>}
        </Card>
      </div>
      <Card title="What the provider portal hides">
        <ul className="text-sm text-ink-2 list-disc pl-4 space-y-1">
          <li>Court, probation and attorney details</li>
          <li>Case notes and internal tasks</li>
          <li>Guardian contact details</li>
          <li>Screening, unless Part 2 consent is signed</li>
          <li>Youth referred to other providers</li>
        </ul>
      </Card>
    </div>
  );
}
