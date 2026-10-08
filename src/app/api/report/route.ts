import { NextResponse } from "next/server";
import { ReportSpecSchema, schemaPrompt, type ReportSpec } from "@/lib/query/spec";
import { parseWithRules } from "@/lib/query/rules";
import { PROVIDERS } from "@/lib/seed";

// POST /api/report  { question: string } → { spec, source }
//
// Turns a plain-English question into a validated ReportSpec. Only the question
// and the field catalog are sent to the model. No case data reaches this
// route, let alone the model (ADR-004). Token budget controls (ADR-005):
//   • short system prompt (~250 tokens), JSON-only output, capped completion
//   • in-memory cache of normalized question → spec (repeat questions cost 0)
//   • per-instance rate limit, 200-char question cap
//   • rules fallback when there's no key, an error, or invalid output

const MODEL = process.env.CEREBRAS_MODEL ?? "gpt-oss-120b";
const BASE_URL = process.env.CEREBRAS_BASE_URL ?? "https://api.cerebras.ai/v1";
const MAX_QUESTION = 200;

const cache = new Map<string, ReportSpec>();
const recent: number[] = [];
const RATE_LIMIT_PER_MIN = 20;

const providerNames = PROVIDERS.map((p) => p.name);
const SYSTEM = `Convert a juvenile-justice case-management question into ONE JSON object for a report engine. Use only these fields/values:
${schemaPrompt(providerNames)}
Rules: pick the closest metric; "how many" = youth_count; omit filters you aren't sure of; reply with JSON only, no prose.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const question = String(body?.question ?? "").trim().slice(0, MAX_QUESTION);
  if (!question) return NextResponse.json({ error: "Ask a question" }, { status: 400 });

  const key = question.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
  const hit = cache.get(key);
  if (hit) return NextResponse.json({ spec: hit, source: "cache" });

  const fallback = (reason: string) =>
    NextResponse.json({ spec: parseWithRules(question, providerNames), source: "rules", reason });

  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) return fallback("No model key configured");

  const now = Date.now();
  while (recent.length && now - recent[0] > 60_000) recent.shift();
  if (recent.length >= RATE_LIMIT_PER_MIN) return fallback("Rate limited");
  recent.push(now);

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: question },
        ],
        response_format: { type: "json_object" },
        temperature: 0,
        reasoning_effort: "low",
        max_completion_tokens: 400,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallback(`Model error ${res.status}`);
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";
    const parsed = ReportSpecSchema.safeParse(JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)));
    if (!parsed.success) return fallback("Model output failed validation");
    cache.set(key, parsed.data);
    if (cache.size > 500) cache.delete(cache.keys().next().value!);
    return NextResponse.json({ spec: parsed.data, source: "model", model: MODEL, usage: data?.usage?.total_tokens });
  } catch {
    return fallback("Model unavailable");
  }
}
