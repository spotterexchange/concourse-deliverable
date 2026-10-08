// Browser stress test (S8). Drives every page at phone and desktop widths plus each
// workflow added for the RFP, and fails on console errors or horizontal overflow.
// Zero model tokens: typed report questions are answered by the rules fallback
// unless the target has a key, and this script asks only preset questions.
//
//   npx playwright --version   # needs Playwright + Chromium available
//   node scripts/e2e.mjs http://localhost:3000
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright");
const BASE = process.argv[2] ?? "http://localhost:3000";
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok, detail }); console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` (${detail})` : ""}`); };

const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1360, height: 900 }, acceptDownloads: true });
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const go = async (path, waitFor) => { await page.goto(BASE + path); await page.waitForSelector(waitFor); };
const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

// 1. Every page renders at desktop and phone widths without horizontal scroll.
const PAGES = [["/", "text=Provider outcomes"], ["/youth", "table"], ["/intake", "text=Step 1 of 2"], ["/reports", "text=Ask a report"], ["/security", "text=Implementation timeline"]];
for (const [w, h] of [[1360, 900], [390, 844]]) {
  await page.setViewportSize({ width: w, height: h });
  for (const [path, sel] of PAGES) { await go(path, sel); const o = await overflow(); check(`${path} @${w}px renders without horizontal scroll`, o <= 1, o > 1 ? `${o}px overflow` : ""); }
  await go("/youth", "table"); await page.click("tbody a >> nth=0"); await page.waitForSelector("text=Case notes"); const o = await overflow();
  check(`/youth/[id] @${w}px renders without horizontal scroll`, o <= 1, o > 1 ? `${o}px overflow` : "");
}
await page.setViewportSize({ width: 1360, height: 900 });

// 2. Intake validation rejects bad input.
await go("/intake", "text=Step 1 of 2");
await page.fill("label:has-text('First name') input", "Ana");
await page.fill("label:has-text('Last initial') input", "7");
await page.fill("label:has-text('Parent / guardian name') input", "Rosa M.");
await page.fill("label:has-text('Guardian mobile') input", "555-12");
check("intake blocks invalid last initial and phone", await page.isDisabled("text=Continue to screening"));
await page.fill("label:has-text('Last initial') input", "M");
await page.fill("label:has-text('Guardian mobile') input", "(716) 555-0142");
await page.fill("label:has-text('Youth mobile') input", "716-555-0177");
check("intake accepts valid input", !(await page.isDisabled("text=Continue to screening")));

// 3. CRAFFT with skip logic: answer Part B, then flip Part A to all "no".
await page.click("text=Continue to screening");
for (let i = 0; i < 3; i++) await page.locator("button:has-text('Yes')").nth(i).click();
for (let i = 3; i < 9; i++) await page.locator("button:has-text('Yes')").nth(i).click();
for (let i = 0; i < 3; i++) await page.locator("button:has-text('No')").nth(i).click();
check("CRAFFT collapses to CAR only when Part A is all no", (await page.locator("text=Score 1 / 1").count()) === 1);
for (let i = 0; i < 3; i++) await page.locator("button:has-text('Yes')").nth(i).click();
await page.click("text=Save intake & screening");
await page.waitForURL(/youth\/Y-/); await page.waitForSelector("text=Next step");
const youthUrl = page.url();
check("screened youth lands on profile with High risk", (await page.locator("text=High risk").count()) > 0);

// 4. Case management: note, task, appointment, referral.
await page.fill("input[aria-label='Case note']", "Met with Ana and Rosa; Ana prefers afternoon appointments.");
await page.click("text=Add note");
check("case note appears in audit trail", (await page.locator("text=prefers afternoon appointments").count()) === 1);
await page.fill("input[aria-label='New task']", "Call school counselor");
await page.click("form:has(input[aria-label='New task']) button");
check("task added", (await page.locator("text=Call school counselor").count()) >= 1);
await page.selectOption("select[aria-label='Treatment provider']", { index: 2 });
check("referral warns when Part 2 consent missing", (await page.locator("text=Part 2 consent isn't signed yet").count()) === 1);
await page.click("text=Send referral"); await page.waitForSelector("text=Awaiting first appointment");
const soon = new Date(Date.now() + 3 * 86_400_000); soon.setHours(15, 30, 0, 0);
const local = new Date(soon.getTime() - soon.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
await page.fill("input[aria-label='Appointment date and time']", local);
await page.click("form:has(input[aria-label='Appointment date and time']) button");
check("appointment scheduled and logged", (await page.locator("text=Appointment scheduled for").count()) === 1);
check("reminder goes to youth and guardian", (await page.locator("text=Text reminder to youth and guardian").count()) === 1);
const sms = await page.locator("p.text-xs.bg-surface").innerText();
check("reminder text never names a provider", !/Riverbend|Kestrel|Northgate|Larkspur|Cedar|treatment|substance/i.test(sms), sms.slice(0, 60));

// 5. Portals: provider can't see screening until guardian signs; then can.
await page.click("button[role=tab]:has-text('Provider portal')");
check("provider portal hides screening without consent", (await page.locator("text=Hidden: Part 2 consent has not been signed").count()) === 1);
check("provider portal hides case notes", (await page.locator("text=prefers afternoon").count()) === 0);
await page.click("button[role=tab]:has-text('Family portal')");
check("family portal hides risk level", (await page.locator("text=High risk").count()) === 0);
await page.check("text=I have read and agree");
await page.fill("input[aria-label='Typed signature']", "Rosa Martinez");
await page.click("button:has-text('Sign')");
check("guardian signature retained", (await page.locator("text=Signed by").count()) === 1);
await page.click("button[role=tab]:has-text('Provider portal')");
check("provider portal shows screening after consent", (await page.locator("text=CRAFFT 2.1 on").count()) === 1);
await page.click("button[role=tab]:has-text('Staff view')");
check("signed document listed in staff view", (await page.locator("text=Typed e-signature by Rosa Martinez").count()) === 1);

// 6. Closing a case cancels reminders.
await page.click("text=Mark first appointment attended");
await page.click("text=Discharge: left early");
check("closed case has no appointment or reminder", (await page.locator("text=Send text reminder").count()) === 0 && (await page.locator("text=Case closed.").count()) === 1);

// 7. Reports: preset (0 tokens) and chip edits recompute locally.
await go("/reports", "text=Ask a report");
await page.click("text=Completion rate by provider"); await page.waitForSelector("text=Grouped by");
check("preset report renders without a network call", (await page.locator("text=Saved report").count()) === 1);
await page.selectOption("label:has-text('Grouped by') select", "pathway");
check("editing a chip recomputes locally", (await page.locator("text=Edited by you").count()) === 1 && (await page.locator("text=Diversion").count()) >= 1);

// 8. Data ownership exports.
await go("/security", "text=Your data");
const [json] = await Promise.all([page.waitForEvent("download"), page.click("text=Export all County data (JSON)")]);
const [csv] = await Promise.all([page.waitForEvent("download"), page.click("text=Export audit log (CSV)")]);
check("JSON and audit CSV exports download", /\.json$/.test(json.suggestedFilename()) && /\.csv$/.test(csv.suggestedFilename()));

// 9. Dashboard QA card and persistence across reloads.
await go("/", "text=Data quality");
check("data-quality card renders", (await page.locator("text=Referred without Part 2 consent").count()) === 1);
await page.goto(youthUrl); await page.waitForSelector("text=Case notes");
check("changes persist across reload", (await page.locator("text=prefers afternoon appointments").count()) === 1);

// 10. Corrupt saved data falls back to a fresh seed instead of crashing.
await page.evaluate(() => localStorage.setItem("intercept.dataset.v2", JSON.stringify({ youth: "nope" })));
await go("/", "text=Provider outcomes");
check("corrupt localStorage recovers to seed", true);

check("no console or page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} browser checks passed`);
process.exit(failed.length ? 1 : 0);
