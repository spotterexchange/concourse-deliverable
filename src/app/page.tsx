"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BarChart } from "@/components/BarChart";
import { Card, Loading, PageHeader, StatTile } from "@/components/ui";
import { formatValue, runReport } from "@/lib/query/engine";
import { isOverdue, useStore, youthName } from "@/lib/store";
import { CLOSED_STAGES, STAGES } from "@/lib/types";

// Supervisor landing page. RFP §V Operational asks for "a dashboard … to provide an
// overview of case load, status, tasks, and outcomes". Every number here is a
// call to the same report engine the "Ask a report" page uses (ADR-004), so
// the two can't disagree.

export default function Dashboard() {
  const { data } = useStore();

  const view = useMemo(() => {
    if (!data) return null;
    const base = { title: "", date_range: "all" as const, filters: {} };
    const open = data.youth.filter((y) => !CLOSED_STAGES.includes(y.stage));
    const overdue = open.flatMap((y) => y.tasks.filter((t) => !t.done && isOverdue(t.due)).map((t) => ({ y, t })));
    const completion = runReport({ ...base, metric: "completion_rate", group_by: "none" }, data).rows[0];
    const days = runReport({ ...base, metric: "avg_days_to_treatment", group_by: "none" }, data).rows[0];
    const pipeline = runReport({ ...base, metric: "youth_count", group_by: "stage", filters: { open_only: true } }, data);
    pipeline.rows.sort((a, b) => STAGES.indexOf(a.label as never) - STAGES.indexOf(b.label as never));

    const byProvider = (metric: "engagement_rate" | "avg_days_to_treatment" | "completion_rate") =>
      new Map(runReport({ ...base, metric, group_by: "provider" }, data).rows.map((r) => [r.label, r]));
    const eng = byProvider("engagement_rate"), wait = byProvider("avg_days_to_treatment"), comp = byProvider("completion_rate");
    // Rates over fewer than 3 cases are hidden: one discharge shouldn't read as "0% completion".
    const small = (r?: { value: number | null; n: number }) => (r && r.n >= 3 ? r : undefined);
    const providers = data.providers.map((p) => ({
      ...p,
      referrals: data.youth.filter((y) => y.referrals.at(-1)?.providerId === p.id).length,
      engagement: small(eng.get(p.name)), wait: small(wait.get(p.name)), completion: small(comp.get(p.name)),
    }));

    // One computed insight. Flag the provider whose wait is furthest above the program average.
    const slowest = [...providers].sort((a, b) => (b.wait?.value ?? 0) - (a.wait?.value ?? 0))[0];
    const insight = slowest?.wait?.value && days?.value && slowest.wait.value > days.value * 1.5
      ? `${slowest.name} averages ${formatValue(slowest.wait.value, "days")} from referral to first appointment, vs. ${formatValue(days.value, "days")} program-wide, and engages ${formatValue(slowest.engagement?.value ?? null, "percent")} of referred youth.`
      : null;

    const caseload = data.caseManagers.map((cm) => {
      const mine = open.filter((y) => y.caseManagerId === cm.id);
      return {
        ...cm, open: mine.length,
        high: mine.filter((y) => y.riskLevel === "High").length,
        overdue: mine.reduce((n, y) => n + y.tasks.filter((t) => !t.done && isOverdue(t.due)).length, 0),
      };
    });

    const appts = open.filter((y) => y.nextAppointment).sort((a, b) => a.nextAppointment!.localeCompare(b.nextAppointment!)).slice(0, 6);
    return { open, overdue, completion, days, pipeline, providers, insight, caseload, appts };
  }, [data]);

  if (!data || !view) return <Loading />;

  return (
    <>
      <PageHeader title="Program overview" sub="Juvenile Substance Use Services Coordination Program · all case managers" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatTile label="Active youth" value={String(view.open.length)} sub={`${view.open.filter((y) => y.riskLevel === "High").length} high risk`} />
        <StatTile label="Overdue tasks" value={String(view.overdue.length)} sub="across all caseloads" />
        <StatTile label="Completion rate" value={formatValue(view.completion?.value ?? null, "percent")} sub={`of ${view.completion?.n ?? 0} closed cases`} />
        <StatTile label="Referral → first appointment" value={formatValue(view.days?.value ?? null, "days")} sub="average, all providers" />
      </div>

      {view.insight && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <span className="font-semibold">Worth a look: </span>{view.insight}{" "}
          <Link href="/reports?q=average+days+to+first+appointment+by+provider" className="underline">See the report</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4 mb-4">
        <Card title="Provider outcomes" className="lg:col-span-3">
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm">
              <thead className="text-xs text-ink-2 text-left">
                <tr className="border-b border-line">
                  <th className="py-2 pr-3 font-medium">Provider</th>
                  <th className="py-2 px-2 font-medium text-right">Referrals</th>
                  <th className="py-2 px-2 font-medium text-right">Engaged</th>
                  <th className="py-2 px-2 font-medium text-right">Days to 1st appt</th>
                  <th className="py-2 pl-2 font-medium text-right">Completed</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {view.providers.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-3"><div>{p.name}</div><div className="text-xs text-ink-3">{p.modality}</div></td>
                    <td className="py-2 px-2 text-right">{p.referrals}</td>
                    <td className="py-2 px-2 text-right">{formatValue(p.engagement?.value ?? null, "percent")}</td>
                    <td className="py-2 px-2 text-right">{p.wait?.value != null ? p.wait.value.toFixed(1) : "—"}</td>
                    <td className="py-2 pl-2 text-right">{formatValue(p.completion?.value ?? null, "percent")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-3 mt-2">Completed = % of closed treatment cases completing. Engaged = % of resolved referrals attending a first appointment. — = fewer than 3 cases so far.</p>
        </Card>

        <Card title="Active youth by stage" className="lg:col-span-2">
          <BarChart result={view.pipeline} />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card title="Caseload by case manager">
          <table className="w-full text-sm tabular-nums">
            <thead className="text-xs text-ink-2 text-left">
              <tr className="border-b border-line"><th className="py-1.5 font-medium">Case manager</th><th className="py-1.5 font-medium text-right">Active</th><th className="py-1.5 font-medium text-right">High risk</th><th className="py-1.5 font-medium text-right">Overdue</th></tr>
            </thead>
            <tbody>
              {view.caseload.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="py-1.5">{c.name}</td><td className="text-right">{c.open}</td><td className="text-right">{c.high}</td>
                  <td className={`text-right ${c.overdue ? "text-red-700 font-medium" : ""}`}>{c.overdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title={`Overdue tasks (${view.overdue.length})`}>
          <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
            {view.overdue.sort((a, b) => a.t.due.localeCompare(b.t.due)).slice(0, 8).map(({ y, t }) => (
              <li key={t.id} className="flex justify-between gap-2">
                <Link href={`/youth/${y.id}`} className="hover:underline min-w-0"><span className="font-medium">{youthName(y)}</span> <span className="text-ink-2">· {t.title}</span></Link>
                <span className="text-xs text-red-700 whitespace-nowrap">due {t.due.slice(5)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Upcoming appointments">
          <ul className="space-y-2 text-sm">
            {view.appts.map((y) => (
              <li key={y.id} className="flex justify-between gap-2">
                <Link href={`/youth/${y.id}`} className="hover:underline font-medium">{youthName(y)}</Link>
                <span className="text-ink-2 text-xs whitespace-nowrap">{new Date(y.nextAppointment!).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
