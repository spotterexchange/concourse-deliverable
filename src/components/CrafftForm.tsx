"use client";

import { useState } from "react";
import { CRAFFT_PART_A, cleanAnswers, partBQuestions, scoreCrafft } from "@/lib/crafft";
import { RiskBadge, btn } from "./ui";
import type { Screening } from "@/lib/types";

// Interactive CRAFFT 2.1. Skip logic: only CAR is asked when Part A is all "no".
// The score updates live, so the case manager sees why the risk level is what it is.

export function CrafftForm({ onSubmit, submitLabel = "Save screening" }: { onSubmit: (s: Omit<Screening, "id">) => void; submitLabel?: string }) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const partB = partBQuestions(answers);
  const answeredA = CRAFFT_PART_A.every((q) => q.id in answers);
  const complete = answeredA && partB.every((q) => q.id in answers);
  const { score, risk } = scoreCrafft(answers);

  const Row = ({ id, label, text }: { id: string; label?: string; text: string }) => (
    <div className="flex gap-3 items-start py-2 border-b border-line last:border-0">
      {label && <span className="font-semibold text-brand w-4 shrink-0">{label}</span>}
      <p className="text-sm flex-1">{text}</p>
      <div className="flex gap-1 shrink-0">
        {[true, false].map((v) => (
          <button
            key={String(v)} type="button"
            onClick={() => setAnswers((a) => ({ ...a, [id]: v }))}
            className={`text-xs rounded px-2.5 py-1 border ${answers[id] === v ? "bg-brand text-white border-brand" : "border-line hover:bg-surface"}`}
          >
            {v ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-2 mt-1">Part A · past 12 months</h3>
      {CRAFFT_PART_A.map((q) => <Row key={q.id} id={q.id} text={q.text} />)}
      {answeredA && (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-2 mt-4">Part B · CRAFFT questions</h3>
          {partB.map((q) => <Row key={q.id} id={q.id} label={q.letter} text={q.text} />)}
        </>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface px-3 py-2.5">
        <div className="text-sm">
          Score <span className="font-semibold tabular-nums">{score}</span> / {partB.length} · <RiskBadge risk={complete ? risk : undefined} />
          {complete && risk === "High" && <span className="text-xs text-ink-2 ml-2">≥2 indicates need for further assessment and treatment referral.</span>}
        </div>
        <button
          type="button" disabled={!complete} className={btn}
          onClick={() => onSubmit({ tool: "CRAFFT 2.1", date: new Date().toISOString().slice(0, 10), answers: cleanAnswers(answers), score, risk })}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
