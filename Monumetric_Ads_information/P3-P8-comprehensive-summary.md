# Monumetric Ad Optimization: Comprehensive Summary (P3-P8)

> **Date:** 2026-03-06
> **Author:** Claude Code (Opus 4.6)
> **Purpose:** Consolidated findings from Prompts 3-8 for audit handoff.
> **Code change:** Only P4 modified code. All others are read-only analysis.

---

## What Was Done This Session

| Prompt | Type               | Status          | Output                                         |
| ------ | ------------------ | --------------- | ---------------------------------------------- |
| P3     | Documentation      | DONE            | `Monumetric_Ads_information/control-matrix.md` |
| P4     | **Code change**    | DONE + VERIFIED | `lib/ads/monumetric-slot-shell.tsx`            |
| P5     | Read-only audit    | DONE            | CSS CLS audit (below)                          |
| P6     | Read-only audit    | DONE            | Slot ID gap analysis (below)                   |
| P7     | Read-only analysis | DONE            | Mobile sticky assessment (below)               |
| P8     | Read-only analysis | DONE            | Sidebar evaluation (below)                     |

---

## P3: Control Boundary Matrix

**Output file:** `Monumetric_Ads_information/control-matrix.md`

Three-column matrix defining what PennyCentral controls vs. what Monumetric controls vs. shared responsibilities. Every entry cites deep research reports, March 4 email, or codebase file paths. Includes phase-by-phase annotations for all 11 prompts (P0-P10).

**Key takeaway:** Most revenue-impacting changes require Monumetric action (slot provisioning, refresh interval, placement enablement). Publisher-side work is limited to DOM structure, CSS, CSP, and runtime loading.

---

## P4: Slot Shell Styling Fix (ONLY CODE CHANGE)

**File modified:** `lib/ads/monumetric-slot-shell.tsx`

**What changed:**

| Before                                                                                                                         | After                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-3 sm:p-4`                                              | `flex flex-col items-center`                                                                                     |
| `mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]` label saying "Advertisement" | `mb-1 text-center text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)] opacity-40` label saying "Ad" |

**What was preserved (unchanged):**

- `my-8 overflow-hidden transition-all duration-200` on outer section
- All `data-ad-slot` and `data-ad-slot-collapsed` attributes
- Collapse inline styles (height:0, margin:0, opacity:0, overflow:hidden, padding:0, borderWidth:0)
- Inner div: `mx-auto w-full overflow-hidden` with inline `minHeight` for CLS prevention
- `{children}` passthrough
- All props and hook behavior

**Verification:** `npm run verify:fast` passed all 4 gates:

- Lint: 0 warnings
- Typecheck: clean
- Unit tests: 108/108 passed
- Build: 695 pages generated

---

## P5: CSS CLS Audit

**Verdict: CSS is adequate, no changes needed.**

| Check                                  | Status | Evidence                                                                                                          |
| -------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| min-height reservation                 | OK     | `monumetric-slot-shell.tsx:173-175` -- inline `minHeight` + Tailwind `min-h-[250px]` from containerClassName      |
| Overflow clipping risk                 | OK     | No `overflow:hidden` on parent containers (.guide-article, PageShell, Prose). Only on ad container itself (safe). |
| Z-index stacking (navbar vs header ad) | OK     | Navbar `z-50` applies to its own stacking context. Ads render in document flow below navbar. No occlusion.        |
| CSS containment                        | OK     | No `contain: layout/paint` rules found in globals.css                                                             |
| Global iframe resets                   | OK     | No `iframe { display:none }` or `* { max-width }` rules. Universal selector only sets `border-color`.             |
| PageShell width constraints            | OK     | `max-w-4xl/5xl/6xl` are width-only, not overflow. Ads render fully within 68ch (~680px) guide containers.         |
| Transition behavior                    | OK     | `transition-all duration-200` on section. Smooth 200ms collapse. No `will-change` or transform stacking issues.   |

**No fixes required.**

---

## P6: Slot ID Gap Analysis

### Provisioned & Used (1 of 8)

| UUID                                   | Name                  | Usage                                                                                |
| -------------------------------------- | --------------------- | ------------------------------------------------------------------------------------ |
| `39b97adf-dc3e-4795-b4a4-39f0da3c68dd` | In-content Repeatable | 11 DOM placements across 9 routes (7 guide chapters + guide hub + penny-list client) |

### Provisioned & Unused (7 of 8)

| UUID           | Name                | Why Unused                                                                         |
| -------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `fd66fcce-...` | Video Ad            | No video player integration; VOLT disabled by Monumetric                           |
| `5f725bea-...` | Sticky Sidebar      | Feature disabled in launch-config; no DOM target                                   |
| `c243b456-...` | Middle Sidebar Flex | No sidebar DOM structure; Monumetric config: "Not being inserted"                  |
| `b3dc56d1-...` | Top Sidebar Flex    | Same as above                                                                      |
| `785d6c5a-...` | Pillar (Left)       | Floats in viewport gutters via Monumetric; no explicit DOM needed but not inserted |
| `45ff9f95-...` | Footer In-screen    | No footer ad DOM target; Monumetric removed from mobile                            |
| `8c9623fb-...` | Header In-screen    | No header ad DOM target; Monumetric removed from mobile                            |

### Needed But Missing (2 new UUIDs required)

| Need                       | Route         | Why Can't Reuse                                                                                                                                            | Env Var (placeholder today)                |
| -------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Guide hub secondary slot   | `/guide`      | Page already uses the one real UUID as `leadInContentSlotId`; `followupInContentSlotId` falls back to placeholder string `"pc-guide-secondary-in-content"` | `NEXT_PUBLIC_MONU_GUIDE_SECONDARY_SLOT_ID` |
| Penny-list in-content slot | `/penny-list` | Uses placeholder `"pc-penny-list-in-content"`, NOT a real Monumetric UUID                                                                                  | `NEXT_PUBLIC_MONU_PENNY_LIST_SLOT_ID`      |

### Critical Finding

Only **1 of 8** provisioned UUIDs is actually wired into the codebase. The other 7 exist in Monumetric's config but have no corresponding DOM targets. Meanwhile, 2 pages need NEW UUIDs that don't exist yet.

**Action required:** Request 2 additional UUIDs from Monumetric (guide secondary + penny-list). Set them in Vercel env vars.

---

## P7: Mobile Sticky Ad Assessment

### Two Paths Compared

| Factor                  | Path A: Self-Integrated                       | Path B: Monumetric Managed                                            |
| ----------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| Mobile nav overlap risk | LOW -- we control z-index (z-30)              | HIGH -- they broke it in February                                     |
| Safe-area (iOS notch)   | HANDLED -- uses `env(safe-area-inset-bottom)` | UNKNOWN -- likely doesn't respect it                                  |
| Time to launch          | ~3 business days (UUID wait + 2-3h code)      | 1-2 weeks (renegotiation + their dev cycle)                           |
| Kill switch             | Instant -- `sticky.enabled: false` in config  | Slow -- requires email to Monumetric                                  |
| Contract alignment      | Clean -- we manage it silently                | Contradicts reengagement email that banned sticky ads from Monumetric |
| Ongoing control         | Full -- our code, our tests                   | None -- their CSS, their timeline                                     |

### Current State of `mobile-sticky-anchor.tsx`

- 71 lines, well-structured React component
- `fixed inset-x-0 bottom-0 z-30 sm:hidden` (mobile-only, below modals)
- Safe-area: `pb-[calc(4px+env(safe-area-inset-bottom))]`
- Collapse: Uses `useMonumetricSlotCollapse()` hook, collapses after 7000ms if no ad renders
- Dismiss animation: `translate-y-full` / `translate-y-0`, respects `prefers-reduced-motion`
- **BUT:** Zero `$MMT` integration. No `$MMT.cmd.push()` or `$MMT.display.slots.push()`. Uses hardcoded `"pc-mobile-sticky-anchor"` (not a UUID).
- Config: `sticky.enabled: false` in launch-config.ts

### Recommendation: Path A (Self-Integrated)

The component infrastructure is ready. It just needs:

1. A real UUID from Monumetric
2. `$MMT.cmd.push()` script injection (same pattern as `monumetric-in-content-slot.tsx`)
3. Flip `sticky.enabled: true`

Path B re-opens a door explicitly closed in Cade's reengagement email and repeats a known failure mode.

---

## P8: Sidebar Layout Evaluation

### Key Fact (Critical)

**Sidebar ads do NOT require a sidebar DOM.** Monumetric's pillar ad inserts "AFTER body" and floats in viewport gutters using position:fixed/absolute. The 3 sidebar slots being "Not being inserted" is a Monumetric config decision, not a layout problem. Building a sidebar will NOT cause Monumetric to enable sidebar ads.

### Three Options

| Option                                | Description                                                    | Recommendation                                      |
| ------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| **A: Keep single-column**             | No changes. Pillar ads still work.                             | Safe default.                                       |
| **B: Sidebar on all pages**           | Right-rail at `lg:` breakpoint. TOC, filters, related content. | Over-engineered for current traffic/content volume. |
| **C: Sidebar on guide chapters only** | Scoped -- auto-generated TOC, reading progress. Desktop only.  | **Recommended** if Cade wants it.                   |

### Option C Details (Recommended if pursued)

- Auto-generated TOC from h2/h3 headings with IntersectionObserver for active section
- Desktop only (`lg:` and up); zero impact on mobile (85-90% of traffic)
- New `GuideChapterLayout` component wrapping PageShell
- Phase 1: TOC sidebar on chapters. Phase 2: Progress bar, reading time. Phase 3: Expand if metrics justify.

### Decision Required

**This is a design/UX decision, not an ad optimization.** Cade must approve before any implementation. Questions for Cade:

1. Do guide chapters need better navigation for desktop readers?
2. Open to phased rollout?
3. Sticky TOC or scroll-with-page?

---

## What's Next (Remaining Prompts)

| Prompt | Description                                | Status      | Blocked On                                 |
| ------ | ------------------------------------------ | ----------- | ------------------------------------------ |
| P1     | Verify Monumetric production status        | NOT STARTED | Vercel env var access                      |
| P9     | Draft Monumetric email                     | UNBLOCKED   | All inputs ready (P2, P3, P6, P7, P8 done) |
| P10    | Update `.ai/STATE.md` and `.ai/BACKLOG.md` | BLOCKED     | P1 + P9                                    |

### Decisions Needed From Cade

1. **Sidebar:** Option A (keep single-column), B (all pages), or C (guide chapters only)?
2. **Mobile sticky:** Approve Path A (self-integrated) to include in Monumetric email?
3. **Monumetric email:** Ready to draft P9? It will request 2 new UUIDs + confirm refresh interval + verify `.py-8` selector + ask about SKU page targeting.

---

## Files Modified This Session

| File                                                        | Change                                          | Verification                                                         |
| ----------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| `Monumetric_Ads_information/control-matrix.md`              | NEW -- control boundary matrix                  | N/A (docs)                                                           |
| `Monumetric_Ads_information/P3-P8-comprehensive-summary.md` | NEW -- this summary                             | N/A (docs)                                                           |
| `lib/ads/monumetric-slot-shell.tsx`                         | MODIFIED -- removed card wrapper, subtler label | `verify:fast` passed (lint + typecheck + 108 tests + 695-page build) |
