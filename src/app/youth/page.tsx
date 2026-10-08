"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Loading, PageHeader, RiskBadge, StageBadge, btn, input } from "@/components/ui";
import { CURRENT_USER, isOverdue, useStore, youthName } from "@/lib/store";
import { CLOSED_STAGES, RISK_LEVELS, STAGES } from "@/lib/types";

export default function Caseload() {
  const { data } = useStore();
  const [q, setQ] = useState("");
  const [mine, setMine] = useState(true);
  const [showClosed, setShowClosed] = useState(false);
  const [stage, setStage] = useState("");
  const [risk, setRisk] = useState("");

  const rows = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return data.youth.filter((y) =>
      (!mine || y.caseManagerId === CURRENT_USER.caseManagerId) &&
      (showClosed || !CLOSED_STAGES.includes(y.stage)) &&
      (!stage || y.stage === stage) &&
      (!risk || y.riskLevel === risk) &&
      (!needle || `${y.firstName} ${y.lastInitial} ${y.id} ${y.contacts.map((c) => c.name).join(" ")}`.toLowerCase().includes(needle)),
    );
  }, [data, q, mine, showClosed, stage, risk]);

  if (!data) return <Loading />;
  const cm = (id: string) => data.caseManagers.find((c) => c.id === id)?.name ?? "";

  return (
    <>
      <PageHeader title={mine ? "My caseload" : "All youth"} sub={`${rows.length} youth`} action={<Link href="/intake" className={btn}>+ New intake</Link>} />

      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <input className={`${input} max-w-xs`} placeholder="Search name, ID, guardian, PO…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select className={`${input} w-auto`} value={stage} onChange={(e) => setStage(e.target.value)} aria-label="Stage">
          <option value="">Any stage</option>{STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className={`${input} w-auto`} value={risk} onChange={(e) => setRisk(e.target.value)} aria-label="Risk">
          <option value="">Any risk</option>{RISK_LEVELS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="text-sm flex items-center gap-1.5"><input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /> Only mine</label>
        <label className="text-sm flex items-center gap-1.5"><input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} /> Include closed</label>
      </div>

      <div className="bg-card border border-line rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-ink-2 text-left bg-surface">
            <tr>
              <th className="px-4 py-2 font-medium">Youth</th>
              <th className="px-3 py-2 font-medium">Pathway</th>
              <th className="px-3 py-2 font-medium">Stage</th>
              <th className="px-3 py-2 font-medium">Risk</th>
              <th className="px-3 py-2 font-medium">Open tasks</th>
              {!mine && <th className="px-3 py-2 font-medium">Case manager</th>}
              <th className="px-3 py-2 font-medium">Referred</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((y) => {
              const openTasks = y.tasks.filter((t) => !t.done);
              const overdue = openTasks.filter((t) => isOverdue(t.due)).length;
              return (
                <tr key={y.id} className="border-t border-line hover:bg-surface">
                  <td className="px-4 py-2"><Link href={`/youth/${y.id}`} className="font-medium hover:underline">{youthName(y)}</Link> <span className="text-xs text-ink-3">{y.id} · {y.age}</span></td>
                  <td className="px-3 py-2">{y.pathway}</td>
                  <td className="px-3 py-2"><StageBadge stage={y.stage} /></td>
                  <td className="px-3 py-2"><RiskBadge risk={y.riskLevel} /></td>
                  <td className="px-3 py-2 tabular-nums">{openTasks.length}{overdue > 0 && <span className="text-red-700 text-xs ml-1">({overdue} overdue)</span>}</td>
                  {!mine && <td className="px-3 py-2">{cm(y.caseManagerId)}</td>}
                  <td className="px-3 py-2 tabular-nums text-ink-2">{y.referralDate}</td>
                </tr>
              );
            })}
            {!rows.length && <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-3">No youth match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
