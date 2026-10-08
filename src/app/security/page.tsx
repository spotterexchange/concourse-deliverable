import { Card, PageHeader } from "@/components/ui";
import { SCREENING_LIBRARY } from "@/lib/crafft";
import { TRACEABILITY, type Status } from "@/lib/traceability";
import { DataExport } from "@/components/DataExport";

const TIMELINE = [
  { when: "Weeks 1–2", what: "Kickoff, County IdP (SSO/MFA) connection, confirm stages, outcome definitions and roles", county: "Name a project lead; IT provides IdP metadata; program staff join two 1-hour workshops" },
  { when: "Weeks 3–4", what: "Configure forms (CRAFFT + chosen tools), provider list, reports; load any existing records", county: "Approve form and report drafts; share existing data extract if any" },
  { when: "Week 5", what: "Training (2 × 90-min sessions + recordings) and a test week with real workflows", county: "Case managers and supervisors attend; report issues in the shared tracker" },
  { when: "Week 6", what: "Go live. Daily check-ins for 2 weeks, then a weekly 30-minute review through the pilot", county: "Sign off go-live; keep a weekly slot for feedback" },
];

const STATUS: Record<Status, { label: string; cls: string }> = {
  built: { label: "Working in demo", cls: "bg-green-50 text-green-800 ring-green-200" },
  simulated: { label: "Simulated in demo", cls: "bg-blue-50 text-blue-800 ring-blue-200" },
  plan: { label: "Production commitment", cls: "bg-gray-100 text-gray-700 ring-gray-200" },
};

export default function Security() {
  const counts = TRACEABILITY.reduce((m, r) => ({ ...m, [r.status]: (m[r.status] ?? 0) + 1 }), {} as Record<Status, number>);
  return (
    <>
      <PageHeader title="Security & compliance" sub="Each RFP requirement, and whether this demo shows it working, simulates it, or commits to it for production." />
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        {(Object.keys(STATUS) as Status[]).map((s) => (
          <span key={s} className={`rounded px-2 py-1 ring-1 ring-inset ${STATUS[s].cls}`}>{STATUS[s].label}: {counts[s] ?? 0}</span>
        ))}
      </div>

      <Card className="mb-4">
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-2 text-left"><tr className="border-b border-line"><th className="py-2 pr-3 font-medium">RFP section</th><th className="py-2 pr-3 font-medium">Requirement</th><th className="py-2 pr-3 font-medium">Status</th><th className="py-2 font-medium">How we meet it</th></tr></thead>
            <tbody>
              {TRACEABILITY.map((r) => (
                <tr key={r.requirement} className="border-b border-line last:border-0 align-top">
                  <td className="py-2 pr-3 text-xs text-ink-2 whitespace-nowrap">{r.section}</td>
                  <td className="py-2 pr-3 font-medium">{r.requirement}</td>
                  <td className="py-2 pr-3"><span className={`whitespace-nowrap rounded px-1.5 py-0.5 text-xs ring-1 ring-inset ${STATUS[r.status].cls}`}>{STATUS[r.status].label}</span></td>
                  <td className="py-2 text-ink-2">{r.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Validated screening tools (youth & young adults under 25)">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-2 text-left"><tr className="border-b border-line"><th className="py-1.5 font-medium">Tool</th><th className="py-1.5 font-medium">Ages</th><th className="py-1.5 font-medium">Purpose</th></tr></thead>
            <tbody>{SCREENING_LIBRARY.map((t) => <tr key={t.name} className="border-b border-line last:border-0"><td className="py-1.5 font-medium">{t.name}<div className="text-xs text-ink-3 font-normal">{t.status}</div></td><td className="whitespace-nowrap pr-2">{t.ages}</td><td className="text-ink-2">{t.purpose}</td></tr>)}</tbody>
          </table>
        </Card>
        <Card title="Cost within the County's budget">
          <table className="w-full text-sm tabular-nums">
            <tbody>
              {[["Year 1: setup, configuration, training, hosting", "$17,000"], ["Year 2: hosting, support, iteration", "$8,000"], ["Year 3", "$8,000"], ["Years 4–5 (if extended)", "$16,000"]].map(([k, v]) => (
                <tr key={k} className="border-b border-line"><td className="py-1.5">{k}</td><td className="text-right">{v}</td></tr>
              ))}
              <tr className="border-b border-line"><td className="py-1.5">Data extraction (any time) and full return on exit</td><td className="text-right">$0</td></tr>
              <tr className="border-b border-line"><td className="py-1.5">Read-only retention for 90 days after discontinuation, then certified deletion</td><td className="text-right">$0</td></tr>
              <tr><td className="py-1.5 font-semibold">5-year total cost of ownership</td><td className="text-right font-semibold">$49,000</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-ink-3 mt-2">No per-seat fees, so provider and family portal users are included. Growth (more youth, staff or programs) doesn&apos;t change the price within the contract term.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card title="Implementation timeline: award to go-live in 6 weeks" className="lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="text-xs text-ink-2 text-left"><tr className="border-b border-line"><th className="py-1.5 pr-3 font-medium">When</th><th className="py-1.5 pr-3 font-medium">We do</th><th className="py-1.5 font-medium">We need from the County</th></tr></thead>
            <tbody>{TIMELINE.map((t) => <tr key={t.when} className="border-b border-line last:border-0 align-top"><td className="py-1.5 pr-3 whitespace-nowrap font-medium">{t.when}</td><td className="py-1.5 pr-3">{t.what}</td><td className="py-1.5 text-ink-2">{t.county}</td></tr>)}</tbody>
          </table>
          <p className="text-xs text-ink-3 mt-2">Releases ship weekly with no downtime windows; status and uptime history are published on a public status page. Support requests are answered within one business day.</p>
        </Card>
        <Card title="Your data">
          <p className="text-sm text-ink-2 mb-3">The County owns all data. Take a complete copy, or the audit log, at any time. No ticket, no fee.</p>
          <DataExport />
        </Card>
      </div>
    </>
  );
}
