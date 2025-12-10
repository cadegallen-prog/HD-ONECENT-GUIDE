# Penny List: Freshness & Adoption Plan

> **Goal:** Make the Penny List the fastest, clearest way to see "what’s new for me" – driving daily check-ins that beat scrolling Facebook – without adding ongoing maintenance for Cade.

**Status:** Phase 1 not yet implemented. This file defines how to implement it and how to encourage real usage.

---

## 1. Quick Summary

**What we’re building _now_ (Phase 1 – Freshness & Trust)**

1. **Data validation + gating:** Only show rows with SKU, name, and a valid date; everything else is dropped. If nothing valid remains, show the existing feed-unavailable banner.
2. **One freshness summary at the top:**  
   `"X new reports in the last 24 hours; Y total in 30 days."`  
   Calculated from valid rows only, rendered server-side.
3. **Relative timestamps on items:**  
   "Today", "Yesterday", or "X days ago" instead of raw dates, while keeping `<time datetime="...">` for SEO.

**What we are explicitly _not_ building yet**

- Email capture prompt (Phase 2 – only if Phase 1 is working and not annoying).
- `Approved` / moderation column (only if spam actually becomes a problem).
- Pagination (only if the list grows to the point that it hurts UX/performance).
- Per-item “NEW” badges or chips (deferred until metrics are healthy and design constraints allow it).

**Why this matters**

- Creates a simple daily habit trigger: “How many new reports in the last 24 hours?”
- Makes the list feel alive and understandable at a glance, without flashy UI.
- Stays within our guardrails from `AGENTS.md` and `CODEX_GREAT_PLAN.md` (SSR, design system, low maintenance).

---

## 2. Alignment With CODEX_GREAT_PLAN

This plan is the **implementation detail** for the Penny List slice described in `CODEX_GREAT_PLAN.md`:

- **Phase 1a – Validation/Gating**
  - Require SKU, name, and a valid `dateAdded`.
  - Drop bad rows; show feed-unavailable banner if no valid rows remain.
- **Phase 1b – Single freshness cue**
  - One summary at the top: `X new in last 24 hours; Y total in 30 days`.
  - **No per-item chips** yet – only the summary.
- **Phase 1c – Measure & refine**
  - Lint/build must pass.
  - Manual checks for HTML content, correct counts, correct empty-handling.

This document only adds: relative timestamps and some concrete engineering steps, plus a small adoption section.

---

## 3. Phase 1: Freshness & Trust (NOW)

### 3.1 Validation & Gating (Phase 1a)

**Behavior**

- Build a `validRows` array where each row has:
  - `sku` is non-empty (after `trim()`).
  - `name` is non-empty (after `trim()`).
  - `dateAdded` parses into a valid `Date` (not `NaN`).
- Use `validRows` for:
  - Rendering table/cards.
  - Computing freshness summary.
  - Computing all freshness metrics.
- If `validRows.length === 0`:
  - Show the existing feed-unavailable banner.
  - Hide the list/table.

**Files**

- `lib/fetch-penny-data.ts` – normalize rows so `sku`, `name`, and `dateAdded` are present.
- `components/penny-list-client.tsx` – construct `validRows` and pass them to UI components.
- `components/penny-list-table.tsx` / cards – render only `validRows`.

---

### 3.2 Freshness Summary Block (Phase 1b)

Add a single summary block above the filters/search:

```text
X new reports in the last 24 hours; Y total in 30 days.
```

**Rules**

- Compute X and Y **only from `validRows`**.
- Use a **rolling 24-hour window** for “last 24 hours” (not calendar day).
- Use a **rolling 30-day window** for “30 days”.
- If `validRows.length === 0`:
  - Summary still renders (with `0` / `0`), and the feed-unavailable banner is visible.
- Render this block on the **server** so the text is in the initial HTML.
- Use existing design tokens (muted/secondary text) – no new accent colors.

**Example pseudo-code (server side)**

```ts
const now = Date.now()
const dayMs = 24 * 60 * 60 * 1000
const thirtyDaysMs = 30 * dayMs

const new24h = validRows.filter((item) => {
  const d = new Date(item.dateAdded).getTime()
  return !Number.isNaN(d) && now - d <= dayMs
}).length

const total30d = validRows.filter((item) => {
  const d = new Date(item.dateAdded).getTime()
  return !Number.isNaN(d) && now - d <= thirtyDaysMs
}).length
```

---

### 3.3 Relative Timestamps on Items

Replace raw `YYYY-MM-DD` display in the list with relative labels, while keeping semantic HTML.

**Display rules**

- `Today` – if `diffDays === 0`.
- `Yesterday` – if `diffDays === 1`.
- `X days ago` – for `2 <= diffDays <= 14`.
- `MMM d` – for older items (e.g., `Nov 15`).
- Keep `<time datetime={item.dateAdded}>…</time>` for SEO.

**Example helper**

```ts
function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 14) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
```

**Files**

- `components/penny-list-card.tsx` – use `formatRelativeDate` for the date display.
- Any compact/alternate card variants – same pattern.

---

### 3a. Engineering Checklist for Phase 1 (Practical)

**Files you will likely touch**

- `lib/fetch-penny-data.ts`
- `components/penny-list-client.tsx`
- `components/penny-list-table.tsx` and/or `components/penny-list-card.tsx`
- `app/penny-list/page.tsx` (for SSR summary placement, if needed)

**Implementation steps**

1. **Create `validRows`:**
   - Filter by non-empty SKU/name and valid `dateAdded`.
   - Use `validRows` everywhere downstream.
2. **Add 24h/30d summary:**
   - Compute `new24h` and `total30d` from `validRows`.
   - Render summary text at the top, server-side.
3. **Switch to relative timestamps:**
   - Add `formatRelativeDate` helper.
   - Update list/card UI to use it, keeping `<time datetime="...">`.
4. **Verify behavior:**
   - `npm run lint`
   - `npm run build`
   - View source for `/penny-list` and confirm:
     - SKUs and names are in HTML.
     - Summary sentence is in HTML.
   - Confirm:
     - Counts match rendered items.
     - Banner appears only when `validRows.length === 0`.

**Acceptance criteria (all must be true)**

- No invalid rows (missing SKU/name/valid date) appear.
- Summary always matches what’s rendered and uses 24h/30d windows.
- Empty feeds show banner and zero-count summary, not a broken page.
- Dates on items are human-friendly but keep semantic `<time>` for SEO.
- No design system violations (no new accent colors, typography unchanged).
- `npm run lint` and `npm run build` both pass.

---

## 4. Phase 2: Light Email Capture (LATER – Only if Phase 1 Works)

This is **optional** and must wait until:

- Phase 1 metrics are stable (good valid-row rate, low empty-fetch rate).
- Penny List is clearly useful and not confusing.

**Deliverable**

Small, dismissible prompt that only appears **after** a user filters by state:

> “Get notified when new finds appear in Georgia” [Subscribe]

**Rules**

- Only shows when a state filter is active (e.g., `?state=GA`).
- Dismissible; remembered in `localStorage` (single key or per-state key).
- Links to an existing newsletter/signup form (no new backend).
- Styled as inline text + underlined link per design system (no new accent color).

**Files (when we get here)**

- `components/penny-list-filters.tsx` (or a small dedicated prompt component that lives near the filters).

---

## 5. Later Ideas (Conditional, Not Approved Yet)

These are **just options** for future phases if traffic and engagement justify it and if they don’t violate design constraints:

- **Per-item “NEW” chips** for items within the last 24h:
  - Only if we can do this without blowing up the “max 3 accents” rule.
  - Likely a subtle text/border treatment, not a bright new color.
- **Simple, server-side pagination**:
  - If row count grows into hundreds/thousands and affects UX/performance.
  - No infinite scroll; keep page 1 SSR/ISR.

Nothing here should be built until the readiness gates in `CODEX_GREAT_PLAN.md` (Section 11/11a) are satisfied.

---

## 6. User Activation & Adoption (Low-Burden)

The Penny List has no value if nobody actually uses it. These are **simple, low-maintenance** ways to increase the odds that people discover and return to it.

**On-site changes (code-level, small)**

- **Homepage teaser (optional):**
  - In the hero or primary section, add a text line such as:  
    “Live community penny list: X new reports in the last 24 hours.”  
    Linking to `/penny-list`.
  - Reuse the same counts computed for the Penny List summary (no new data layer).
- **Inline links on relevant pages:**
  - On the guide / “what are pennies” / report-find pages, add a simple underlined link:  
    “See the live community penny list” → `/penny-list`.

**Off-site behavior (no-code, for Cade)**

- **Pinned / recurring posts in the Facebook group:**
  - Short message like:  
    “Instead of scrolling for an hour, check the live Penny List here: https://pennycentral.com/penny-list – it shows how many new reports came in during the last 24 hours.”
  - Do this occasionally, not constantly (low-noise).
- **Explain the loop once:**
  - Very simple explanation:  
    “You submit your finds via the Google Form. The site updates itself every hour. The Penny List is where you see what’s new.”

These steps increase the chance that the Penny List is actually used, without changing core product complexity.

---

## 7. Guardrails (Non-Negotiables)

These mirror `AGENTS.md` and `CODEX_GREAT_PLAN.md` and apply to all Penny List work:

1. **SSR/ISR required** – SKUs and names must be present in initial HTML. No client-only rendering of the list.
2. **Design system** – No new accent colors. Max 3 accent elements visible. AAA typography. 44px touch targets. Underlined links.
3. **Affiliate safety** – `/go/befrugal` stays a plain `<a>` with `target="_blank" rel="noopener noreferrer"`. Never wrap in `next/link` or prefetching components.
4. **Testing** – Always run `npm run lint` and `npm run build` before declaring anything done.
5. **Branching** – `main` is the deployment branch. Changes only go live when merged to `main` and pushed.
6. **Owner burden** – Default to zero ongoing moderation. `Approved` stays off unless Cade explicitly chooses to use it.

---

## 8. Effort Estimate (Phase 1 Only)

| Task                                | Time   |
|-------------------------------------|--------|
| Validation + `validRows` wiring     | 10–15m |
| 24h/30d summary block (SSR)        | 10–15m |
| Relative timestamp helper + wiring | 10–15m |
| Testing & verification              | 10–15m |
| **Total (Phase 1)**                | ~45–60m |

---

## 9. Start Here (For Any AI / Dev)

1. Read this file first.
2. Read `.ai/SESSION_LOG.md` for recent context.
3. Read `.ai/CONSTRAINTS.md` for hard boundaries.
4. Implement **Phase 1** (Sections 3 + 3a) in order:
   - Validation/gating (`validRows`).
   - 24h/30d summary block.
   - Relative timestamps.
5. Run acceptance criteria checks.
6. Update `.ai/SESSION_LOG.md` with:
   - What changed (files, behaviors).
   - Any issues or open questions.

Do **not**:

- Jump to Phase 2 or "Later Ideas" before Phase 1 is fully implemented and stable.
- Modify the data layer (`lib/fetch-penny-data.ts`) beyond what's needed for validation.
- Add features not described here or in `CODEX_GREAT_PLAN.md` without clearly documenting why.

---

## 10. UI Readability & Alignment (Next Polish)

**Why:** Table and card views need clearer alignment, spacing, and contrast (especially at 75% zoom) to reduce scanning fatigue.

**Goals (actionable & testable):**
- **Table:** Equal column spacing with fixed widths; headers and cells left-aligned; item names wrap to 2 lines instead of truncating; badges and SKUs use higher-contrast text/background; tabular numbers align cleanly.
- **Cards:** Increase text legibility (font weight/size within AAA rules), consistent badge styling, clearer contrast for SKUs/states/notes; ensure readability at 75% zoom.
- **QA:** Visual diff or screenshots after changes; manual check that state filter still works; `npm run lint`, `npm run build`, `npm run test:unit`.

**Suggested steps:**
1) Table layout: add `colgroup` widths, left-align headers/cells, allow 2-line wrap for item names/notes, lighten badge backgrounds using existing tokens, ensure tabular numbers for counts/dates.
2) Card layout: bump supporting text to `text-sm/base`, use consistent border+background for badges/SKUs/states, increase line-height, keep CTA/price unchanged.
3) Validate: run unit tests + lint + build; capture quick before/after screenshots; verify filters and sorting still respond.
