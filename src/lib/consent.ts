import type { Youth } from "./types";

/** Part 2 consent on file? Gates what the provider portal may show (ADR-010). */
export const hasPart2Consent = (y: Youth) => (y.documents ?? []).some((d) => d.kind === "part2_consent");
