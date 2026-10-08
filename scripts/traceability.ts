// Regenerates docs/RFP_TRACEABILITY.md from src/lib/traceability.ts so the
// doc and the /security page can't drift.  Run: npm run docs:trace
import { writeFileSync } from "node:fs";
import { TRACEABILITY } from "../src/lib/traceability";

const label = { built: "✅ Working in demo", simulated: "🟦 Simulated in demo", plan: "⬜ Production commitment" };
const rows = TRACEABILITY.map((r) => `| ${r.section} | ${r.requirement} | ${label[r.status]} | ${r.answer} |`);
writeFileSync(
  "docs/RFP_TRACEABILITY.md",
  `# RFP traceability: Erie County #2026-052VF

_Generated from \`src/lib/traceability.ts\` (also rendered at \`/security\`). Do not edit by hand. Run \`npm run docs:trace\`._

| RFP section | Requirement | Status | How we meet it |
|---|---|---|---|
${rows.join("\n")}
`,
);
