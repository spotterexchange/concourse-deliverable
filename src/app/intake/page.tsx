"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CrafftForm } from "@/components/CrafftForm";
import { Card, PageHeader, btn, btnSecondary, input } from "@/components/ui";
import { CURRENT_USER, useStore } from "@/lib/store";
import { GENDERS, PATHWAYS, type Gender, type Pathway, type Screening } from "@/lib/types";

// Two-step intake: who + how they were referred, then the CRAFFT screen. Intake can
// be saved without screening because a screen sometimes happens at a later visit.

export default function Intake() {
  const { addYouth } = useStore();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [f, setF] = useState({ firstName: "", lastInitial: "", age: "15", gender: "Female" as Gender, pathway: "Diversion" as Pathway, guardian: "", phone: "", smsOptIn: true, officer: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const valid = f.firstName.trim() && f.lastInitial.trim() && f.guardian.trim();

  const save = (screening?: Omit<Screening, "id">) => {
    const contacts: Parameters<typeof addYouth>[0]["contacts"] = [{ role: "Guardian", name: f.guardian, phone: f.phone || undefined, smsOptIn: f.smsOptIn && !!f.phone }];
    if (f.officer) contacts.push({ role: f.pathway === "Family Court" ? "Judge" : "Probation Officer", name: f.officer });
    const id = addYouth({
      firstName: f.firstName.trim(), lastInitial: f.lastInitial.trim().charAt(0).toUpperCase(), age: Number(f.age), gender: f.gender, pathway: f.pathway,
      caseManagerId: CURRENT_USER.caseManagerId, referralDate: new Date().toISOString().slice(0, 10), contacts,
    }, screening);
    router.push(`/youth/${id}`);
  };

  const field = (label: string, el: React.ReactNode) => <label className="block"><span className="text-xs text-ink-2">{label}</span><div className="mt-1">{el}</div></label>;

  return (
    <>
      <PageHeader title="New intake" sub={`Step ${step} of 2 · ${step === 1 ? "Youth & referral details" : "CRAFFT 2.1 screening"}`} />
      {step === 1 ? (
        <Card>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {field("First name", <input className={input} value={f.firstName} onChange={set("firstName")} />)}
            {field("Last initial", <input className={input} maxLength={1} value={f.lastInitial} onChange={set("lastInitial")} />)}
            {field("Age", <select className={input} value={f.age} onChange={set("age")}>{Array.from({ length: 12 }, (_, i) => i + 12).map((a) => <option key={a}>{a}</option>)}</select>)}
            {field("Gender", <select className={input} value={f.gender} onChange={set("gender")}>{GENDERS.map((g) => <option key={g}>{g}</option>)}</select>)}
            {field("Referral pathway", <select className={input} value={f.pathway} onChange={set("pathway")}>{PATHWAYS.map((p) => <option key={p}>{p}</option>)}</select>)}
            {f.pathway !== "Diversion" && field(f.pathway === "Family Court" ? "Judge" : "Probation officer", <input className={input} value={f.officer} onChange={set("officer")} />)}
            {field("Parent / guardian name", <input className={input} value={f.guardian} onChange={set("guardian")} />)}
            {field("Guardian mobile", <input className={input} placeholder="(716) 555-0123" value={f.phone} onChange={set("phone")} />)}
            <label className="sm:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={f.smsOptIn} onChange={set("smsOptIn")} /> Guardian consents to appointment text reminders
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button className={btn} disabled={!valid} onClick={() => setStep(2)}>Continue to screening →</button>
            <button className={btnSecondary} disabled={!valid} onClick={() => save()}>Save intake, screen later</button>
          </div>
        </Card>
      ) : (
        <Card title={`CRAFFT 2.1 for ${f.firstName} ${f.lastInitial}. (age ${f.age})`} action={<button className="text-sm text-ink-2 hover:underline" onClick={() => setStep(1)}>← Back</button>}>
          <p className="text-xs text-ink-2 mb-3">Ask the youth directly and privately. Answers are confidential and are not shown in the family portal.</p>
          <CrafftForm onSubmit={save} submitLabel="Save intake & screening" />
        </Card>
      )}
    </>
  );
}
