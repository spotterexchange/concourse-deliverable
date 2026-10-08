// OPT-IN, SPENDS TOKENS. Scores the deployed model on the stress-test question
// corpus (S1 + S1b, 42 questions, roughly 450 tokens each ≈ 19k tokens total).
// Questions already cached on the server cost nothing; re-runs on a warm instance
// are mostly free.
//   npx tsx scripts/eval-model.ts https://your-app.vercel.app
import { CORPUS, HELD_OUT } from "../tests/corpus";
import type { ReportSpec } from "../src/lib/query/spec";

const base = process.argv[2];
if (!base) { console.error("usage: tsx scripts/eval-model.ts <base-url>"); process.exit(1); }

let ok = 0, tokens = 0, model = 0;
for (const [q, e] of [...CORPUS, ...HELD_OUT]) {
  const res = await fetch(`${base}/api/report`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q }) });
  const json = (await res.json()) as { spec: ReportSpec; source: string; usage?: number };
  tokens += json.usage ?? 0;
  if (json.source === "model") model++;
  const s = json.spec;
  const miss = (["metric", "group_by", "date_range"] as const).filter((k) => e[k] && s[k] !== e[k]).map((k) => `${k}=${s[k]}`)
    .concat(Object.entries(e.filters ?? {}).filter(([k, v]) => (s.filters as Record<string, unknown>)[k] !== v).map(([k]) => `filters.${k}`));
  if (!miss.length) ok++;
  console.log(`${miss.length ? "✗" : "✓"} [${json.source}] ${q}${miss.length ? `  → ${miss.join(", ")}` : ""}`);
}
console.log(`\n${ok}/${CORPUS.length + HELD_OUT.length} correct · ${model} model calls · ${tokens} tokens`);
