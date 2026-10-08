// Server-side spend guard for the free model tier (ADR-005). Counts are per
// serverless instance and reset at UTC midnight. That's good enough to cap a
// demo's worst case; production would use a shared counter (e.g. Redis).

let day = "";
let used = 0;
const recent: number[] = [];

const today = () => new Date().toISOString().slice(0, 10);
const dailyCap = () => Number(process.env.REPORT_DAILY_MODEL_CALLS ?? 200);
const perMinute = () => Number(process.env.REPORT_MODEL_CALLS_PER_MIN ?? 20);

/** Reserve one model call. Returns a reason string if the budget is spent. */
export function takeModelCall(now = Date.now()): string | null {
  if (day !== today()) { day = today(); used = 0; }
  if (used >= dailyCap()) return "Daily AI budget reached";
  while (recent.length && now - recent[0] > 60_000) recent.shift();
  if (recent.length >= perMinute()) return "Rate limited";
  used++;
  recent.push(now);
  return null;
}

export function resetBudgetForTests() { day = ""; used = 0; recent.length = 0; }
