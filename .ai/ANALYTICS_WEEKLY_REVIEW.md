# Analytics Weekly Review (Founder OS)

**Purpose:** Turn analytics into decisions (not dashboards).

**Cadence:** Weekly, ~30 minutes (pick a consistent day/time).

**Inputs:** GA4 + Google Search Console.

**Output:** 3 bullets in `.ai/STATE.md` (“Top leak”, “Top opportunity”, “Top guardrail”).

---

## Rules (Non‑Negotiable)

- **No PII:** never export/store emails, names, full URLs with query params, or anything that identifies a person.
- **Compare windows consistently:** default to **last 7 days vs prior 7 days** for weekly review.
- **Wait for signal:** judge impact starting **48 hours after deploy**; compare 7‑day windows.
- **Change one thing at a time:** avoid shipping multiple large changes with the same “expected impact”.

---

## Step 0 — What changed since last review? (2 min)

Open `.ai/SESSION_LOG.md` and list the 1–3 most meaningful changes since the last review.

Write each change as:

- **Change:** what shipped (plain English)
- **Expected:** what metric should move (up/down)
- **Where:** GA4 report / Search Console report to verify

---

## Step 1 — Traffic + Device Mix (5 min)

**GA4 → Reports → Tech → Tech details**

- Primary dimension: **Device category** (mobile / desktop / tablet)
- Metric: **Users** (or Sessions if that’s your default)
- Compare: **last 7 days vs prior 7 days**

**Interpretation + actions**

- If mobile share shifts by **±10 points** (ex: 60% → 70%):
  - Update `.ai/STATE.md` “Device Mix”.
  - Update QA focus for the next week (mobile-first vs desktop parity).
- If tablet is **≥8%**, add tablet viewport to QA for any UI changes this week.

---

## Step 2 — “Leak Check” (10 min)

Goal: find pages that are getting traffic but failing to move users into the core loop.

**GA4 → Reports → Engagement → Pages and screens**

Look at top pages by **Views** and scan for:

- pages with unusually low engagement / high exits (relative to your baseline)
- pages with high traffic but weak downstream actions (see Step 3)

**Actions**

- If `/penny-list` is leaky: prioritize speed-to-value (first card render, trust signals, scanability).
- If `/report-find` is leaky: prioritize friction reduction (field clarity, validation, error states, mobile UX).
- If a guide page is leaky: strengthen internal links to `/penny-list` and `/report-find`.

---

## Step 3 — Core Loop Health (10 min)

Goal: confirm the flywheel is spinning and identify the tightest bottleneck.

Use the events already tracked in this repo (see `lib/analytics.ts` and `app/layout.tsx`):

- `penny_list_view`
- `report_find_click`
- `find_submit`
- `return_visit`
- `email_signup`

**Simple diagnosis**

- If `report_find_click` is stable but `find_submit` drops → **Report Find is the bottleneck**.
- If `penny_list_view` rises but `return_visit` falls → **Penny List retention is the bottleneck**.
- If both drop → **acquisition, reliability, or performance** is the bottleneck.

**Action rule**

- Pick **one** bottleneck to fix this week (do not try to fix everything).

---

## Step 4 — Search Console: Opportunity + Breakage (3 min)

**Search Console → Performance**

- Queries with **high impressions + low CTR** → improve titles/meta/H1 alignment.
- Pages gaining impressions but not clicks → add clearer internal links to `/penny-list` and `/report-find`.

**Search Console → Indexing / Pages**

- Any new errors → fix immediately (redirect/canonical/robots/sitemap issues).

---

## Step 5 — Write the weekly decision (the output) (2 min)

In `.ai/STATE.md`, add 3 bullets:

- **Top leak:** (page + hypothesis)
- **Top opportunity:** (query/page + what you will change)
- **Top guardrail:** (device mix shift / perf warning / QA focus)

Example:

- Top leak: `/report-find` → users start but don’t submit (mobile form friction).
- Top opportunity: Search Console query “home depot penny list” has impressions but low CTR → tighten homepage title/meta.
- Top guardrail: Mobile share up to 72% → mobile-first QA for all UI work this week.
