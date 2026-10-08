"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateDataset } from "./seed";
import type { Dataset, Referral, RiskLevel, Screening, Stage, TimelineEvent, Youth } from "./types";

// Client-side store (ADR-002). In the demo, case data lives only in this browser's
// localStorage: there's no server database, so nothing synthetic or real is ever
// persisted off-device. In production this module becomes a thin client over
// an API backed by a US-region Postgres with row-level security. The action
// names below map 1:1 to the API endpoints that would replace them.

const STORAGE_KEY = "intercept.dataset.v1";

/** The signed-in demo user. Production identity comes from the County IdP (SAML/OIDC). */
export const CURRENT_USER = { name: "Dana Whitfield", role: "Case Manager", caseManagerId: "cm1" };

type Ctx = {
  data: Dataset | null;
  addYouth: (y: Omit<Youth, "id" | "timeline" | "screenings" | "referrals" | "tasks" | "stage">, screening?: Omit<Screening, "id">) => string;
  recordScreening: (youthId: string, s: Omit<Screening, "id">) => void;
  referToProvider: (youthId: string, providerId: string) => void;
  setStage: (youthId: string, stage: Stage, note: string) => void;
  toggleTask: (youthId: string, taskId: string) => void;
  logEvent: (youthId: string, kind: TimelineEvent["kind"], text: string) => void;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const event = (kind: TimelineEvent["kind"], text: string): TimelineEvent => ({
  id: uid(), date: new Date().toISOString(), kind, text, actor: CURRENT_USER.name,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Dataset | null>(null);

  useEffect(() => {
    let loaded: Dataset | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loaded = JSON.parse(raw);
    } catch { /* storage blocked: fall through to a fresh seed */ }
    setData(loaded ?? generateDataset());
  }, []);

  useEffect(() => {
    if (!data) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* demo still works in-memory */ }
  }, [data]);

  const updateYouth = useCallback((id: string, fn: (y: Youth) => Youth) => {
    setData((d) => (d ? { ...d, youth: d.youth.map((y) => (y.id === id ? fn(y) : y)) } : d));
  }, []);

  const value = useMemo<Ctx>(() => ({
    data,
    addYouth: (input, screening) => {
      const id = `Y-${2000 + Math.floor(Math.random() * 8000)}`;
      const timeline = [event("stage", `Referred via ${input.pathway}; intake completed`)];
      const screenings: Screening[] = [];
      let riskLevel: RiskLevel | undefined;
      if (screening) {
        screenings.push({ ...screening, id: uid() });
        riskLevel = screening.risk;
        timeline.unshift(event("screening", `CRAFFT 2.1 administered: score ${screening.score} (${screening.risk} risk)`));
      }
      const y: Youth = {
        ...input, id, riskLevel, screenings, referrals: [], timeline,
        stage: screening ? "Screened" : "Intake",
        tasks: [{ id: uid(), title: screening ? "Select treatment provider" : "Administer CRAFFT screening", due: today(), done: false }],
      };
      setData((d) => (d ? { ...d, youth: [y, ...d.youth] } : d));
      return id;
    },
    recordScreening: (youthId, s) => updateYouth(youthId, (y) => ({
      ...y,
      screenings: [...y.screenings, { ...s, id: uid() }],
      riskLevel: s.risk,
      stage: y.stage === "Referred" || y.stage === "Intake" ? "Screened" : y.stage,
      timeline: [event("screening", `CRAFFT 2.1 administered: score ${s.score} (${s.risk} risk)`), ...y.timeline],
    })),
    referToProvider: (youthId, providerId) => updateYouth(youthId, (y) => {
      const name = data?.providers.find((p) => p.id === providerId)?.name ?? providerId;
      const r: Referral = { id: uid(), providerId, date: today(), status: "Pending" };
      return {
        ...y, referrals: [...y.referrals, r], stage: "Referred to Treatment",
        timeline: [event("referral", `Referred to ${name}`), ...y.timeline],
        tasks: [...y.tasks, { id: uid(), title: `Confirm ${name} received referral`, due: today(), done: false }],
      };
    }),
    setStage: (youthId, stage, note) => updateYouth(youthId, (y) => {
      const referrals = y.referrals.map((r, i) => {
        if (i !== y.referrals.length - 1) return r;
        if (stage === "In Treatment") return { ...r, status: "Engaged" as const, firstAppointment: today() };
        if (stage === "Completed") return { ...r, status: "Completed" as const, closedDate: today() };
        if (stage === "Discharged") return { ...r, status: "Dropped" as const, closedDate: today() };
        return r;
      });
      return { ...y, stage, referrals, timeline: [event("stage", note), ...y.timeline] };
    }),
    toggleTask: (youthId, taskId) => updateYouth(youthId, (y) => {
      const task = y.tasks.find((t) => t.id === taskId);
      return {
        ...y,
        tasks: y.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
        timeline: task && !task.done ? [event("task", `Task completed: ${task.title}`), ...y.timeline] : y.timeline,
      };
    }),
    logEvent: (youthId, kind, text) => updateYouth(youthId, (y) => ({ ...y, timeline: [event(kind, text), ...y.timeline] })),
    reset: () => {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      setData(generateDataset());
    },
  }), [data, updateYouth]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/** Small derived helpers shared by pages. */
export const youthName = (y: Youth) => `${y.firstName} ${y.lastInitial}.`;
export const isOverdue = (due: string) => due < today();
