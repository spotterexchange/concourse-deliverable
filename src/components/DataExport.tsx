"use client";

import { auditLogCsv, fullExportJson } from "@/lib/export";
import { useStore } from "@/lib/store";
import { btnSecondary } from "./ui";

function download(name: string, body: string, type: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([body], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function DataExport() {
  const { data } = useStore();
  const stamp = new Date().toISOString().slice(0, 10);
  return (
    <div className="flex flex-wrap gap-2">
      <button className={btnSecondary} disabled={!data} onClick={() => download(`intercept-all-data-${stamp}.json`, fullExportJson(data!), "application/json")}>Export all County data (JSON)</button>
      <button className={btnSecondary} disabled={!data} onClick={() => download(`intercept-audit-log-${stamp}.csv`, auditLogCsv(data!), "text/csv")}>Export audit log (CSV)</button>
    </div>
  );
}
