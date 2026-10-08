import type { Dataset } from "./types";

// County data ownership (RFP §V Administrative, §VI.11): the County can take all of
// its data, in open formats, at any time. Pure functions, unit-tested in stress S7.

const csvCell = (v: unknown) => {
  const s = String(v ?? "");
  // Quote always; double embedded quotes; neutralise spreadsheet formula injection.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export function auditLogCsv(ds: Dataset): string {
  const rows = ds.youth
    .flatMap((y) => y.timeline.map((e) => [e.date, y.id, e.actor, e.kind, e.text]))
    .sort((a, b) => a[0].localeCompare(b[0]));
  return [["timestamp_utc", "youth_id", "actor", "event_type", "description"], ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
}

export function fullExportJson(ds: Dataset): string {
  return JSON.stringify({ format: "intercept-export", version: 1, exportedAt: new Date().toISOString(), ...ds }, null, 2);
}
