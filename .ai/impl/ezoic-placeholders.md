# Ezoic Ad Placeholders Implementation Plan

**Created:** 2026-01-22
**Status:** Awaiting approval
**Priority:** Monetization (bridge to Mediavine)

---

## Goal

Implement controlled Ezoic ad placeholders with Core Web Vitals protection to enable bridge monetization while awaiting Mediavine approval.

## Done Means (Testable)

- [x] `lib/ads.ts` created with centralized config and `NEXT_PUBLIC_EZOIC_ENABLED` flag
- [x] `components/ezoic-placeholder.tsx` created with CLS-protected placeholder component
- [x] 3 ad slots added to homepage ([app/page.tsx](../../app/page.tsx)) — `HOME_TOP`, `HOME_MID`, `HOME_BOTTOM`
- [x] 1 ad slot added to Penny List ([components/penny-list-client.tsx](../../components/penny-list-client.tsx)) — `LIST_AFTER_N` after item #10
- [x] 1 ad slot added to Guide ([components/GuideContent.tsx](../../components/GuideContent.tsx)) — `CONTENT_AFTER_P1` after Section II
- [ ] Kill switch verified: `NEXT_PUBLIC_EZOIC_ENABLED=false` disables all placeholders
- [ ] No layout shift when scrolling Penny List
- [ ] Ads render as separate cards, not broken results
- [ ] CLS < 0.1 on key pages (Lighthouse mobile)
- [ ] LCP still <= 2.5s on key pages
- [ ] All 4 quality gates pass (lint/build/unit/e2e)

---

## Constraints and Non-Negotiables

### Trust-First Monetization

- **NO ads above Penny List results** - first ad appears after item #10
- **NO ads in middle of Report Find form** - only at page bottom
- **NO popups, interstitials, auto-play audio, or sticky units covering UI**
- Conservative density targets: 3-5 slots mobile, 5-8 desktop

### Core Web Vitals Protection

- Reserved min-heights per format (prevent CLS):
  - Leaderboard (728x90): 90px
  - Rectangle (300x250): 250px
  - Mobile banner (320x50/100): 50px
- Skeleton placeholder while loading
- CSS containment: `contain: layout style`
- No late injection - only pre-defined slots

### Kill Switch

- Environment variable: `NEXT_PUBLIC_EZOIC_ENABLED`
- Default: `true` (enabled in production)
- `false` = all placeholders return `null` and Ezoic scripts do not load
- Rollback: Set to `false` in Vercel dashboard and **redeploy** (Vercel env var changes require redeploy)

### Design System Compliance

- Use existing design tokens only (no new colors)
- Follow WCAG AAA contrast requirements
- Maintain responsive layout integrity

---

## Current State

| Component             | Status                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Ezoic header scripts  | ✅ Already in [app/layout.tsx:128-149](../../app/layout.tsx#L128-L149)                       |
| Privacy/CMP scripts   | ✅ Already loading first (synchronous)                                                       |
| CSP headers           | ✅ Already whitelist Ezoic domains in [next.config.js](../../next.config.js)                 |
| ads.txt               | ✅ Already exists at [public/ads.txt](../../public/ads.txt) with Ezoic entries               |
| Kill switch           | ✅ Implemented in [lib/ads.ts](../../lib/ads.ts) (`NEXT_PUBLIC_EZOIC_ENABLED=false`)         |
| Placeholder component | ✅ Implemented in [components/ezoic-placeholder.tsx](../../components/ezoic-placeholder.tsx) |
| Page placements       | ❌ Not yet added (home / penny list / SKU / guide / report-find)                             |

---

## Analytics Snapshot (Used to Pick Initial Placements)

### GA4 (Most recent 14 days)

**Date range:** 2026-01-08 → 2026-01-21  
**Source files:** `data/Google Analytics/*`

**Page views (27,994 total in export):**

- `/penny-list`: 10,542 (37.7%)
- `/`: 10,113 (36.1%)
- `/guide` (incl `/GUIDE`): 2,354 (8.4%)
- `/sku/*` (all SKU pages combined): 2,094 (7.5%)
- `/report-find`: 1,731 (6.2%)

**Key events:**

- `home_depot_click`: 980 events (260 users)
- `penny_list_filter`: 1,128 events (300 users)
- `penny_list_search`: 512 events (40 users)

**Implication:** ~74% of page views are **Homepage + Penny List**, so if we want meaningful monetization we should prioritize those pages first (while staying trust-first).

### Device Mix (GA4 + Search Console)

**GA4 (2025-12-23 → 2026-01-21, key pages):**

- Mobile: `/` 14,132 views, `/penny-list` 14,230 views
- Web/desktop: `/` 1,571 views, `/penny-list` 2,907 views

**Search Console (export dated 2026-01-22):**

- Mobile: 302 clicks (CTR 41.8%, avg pos 6.54)
- Desktop: 45 clicks (CTR 2.1%, avg pos 13.92)

**Implication:** Start mobile-first formats (`mobileBanner` / `mobileLeaderboard`), and keep density conservative.

---

## Files to Create/Modify

### Create (2 files)

1. **lib/ads.ts** (NEW)
   - Centralized ad configuration
   - `EZOIC_ENABLED` flag: `process.env.NEXT_PUBLIC_EZOIC_ENABLED !== 'false'`
   - `AD_SLOTS` object with numeric IDs (100-140 range)
   - `AD_MIN_HEIGHTS` for CLS protection per format
   - Export constants for use across components

2. **components/ezoic-placeholder.tsx** (NEW)
   - `EzoicPlaceholder` component with props: `slotId`, `format`, `minHeight`
   - `EzoicInlineAd` compact variant for list injection
   - Only renders when `EZOIC_ENABLED` is `true`
   - Uses `ezstandalone.cmd.push` pattern for SPA compatibility
   - Reserved min-height with skeleton placeholder
   - TypeScript types for format validation

### Modify (6 files)

3. **app/layout.tsx** (line 33-38)
   - Replace current `ENABLE_EZOIC_SCRIPTS` logic
   - Import `EZOIC_ENABLED` from `lib/ads.ts`
   - Maintain existing script loading order (Privacy/CMP → Header script)

4. **app/page.tsx** (3 new ad slots)
   - `HOME_TOP (100)` after `<TodaysFinds>` (around line 127) - leaderboard
   - `HOME_MID (101)` after How It Works section (around line 210) - rectangle
   - `HOME_BOTTOM (102)` after Community, before Support (around line 294) - leaderboard

5. **components/penny-list-client.tsx** (1 new ad slot with grid injection)
   - `LIST_AFTER_N (110)` after item #10 in grid
   - Implementation: Inject ad after item #10 as full-width card with `col-span-full`

6. **components/GuideContent.tsx** (1 new ad slot)
   - `CONTENT_AFTER_P1 (130)` after Section II
   - Minimal ads - this is a conversion page

---

## Change Sequencing

**Critical order:**

1. **First:** Create `lib/ads.ts` (foundation, no dependencies)
2. **Second:** Create `components/ezoic-placeholder.tsx` (depends on `lib/ads.ts`)
3. **Third:** Update `app/layout.tsx` (wire up centralized flag)
4. **Then:** Add placeholders to pages (can be done in any order, but test incrementally)

**Why this order:**

- Foundation first prevents import errors
- Layout update ensures global flag is centralized before placeholders reference it
- Incremental page updates allow testing CLS impact per template

---

## Technical Approach

### A. Foundation (lib/ads.ts)

```typescript
// lib/ads.ts
export const EZOIC_ENABLED = process.env.NEXT_PUBLIC_EZOIC_ENABLED !== "false"

export const AD_SLOTS = {
  // Homepage
  HOME_TOP: 100,
  HOME_MID: 101,
  HOME_BOTTOM: 102,

  // Penny List
  LIST_AFTER_N: 110,
  LIST_MID: 111,
  LIST_BOTTOM: 112,

  // SKU Detail
  DETAIL_MID: 120,
  DETAIL_BOTTOM: 121,

  // Guide
  CONTENT_AFTER_P1: 130,
  CONTENT_MID: 131,
  CONTENT_BOTTOM: 132,

  // Report Find
  REPORT_BOTTOM: 140,
} as const

export type AdFormat = "leaderboard" | "rectangle" | "mobileBanner"

export const AD_MIN_HEIGHTS: Record<AdFormat, number> = {
  leaderboard: 90, // 728x90
  rectangle: 250, // 300x250
  mobileBanner: 50, // 320x50/100
}
```

**Risk:** None - pure configuration file
**Verification:** TypeScript compilation

---

### B. Component (components/ezoic-placeholder.tsx)

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { EZOIC_ENABLED, AD_MIN_HEIGHTS, type AdFormat } from '@/lib/ads'

interface EzoicPlaceholderProps {
  slotId: number
  format: AdFormat
  className?: string
}

export function EzoicPlaceholder({ slotId, format, className = '' }: EzoicPlaceholderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const minHeight = AD_MIN_HEIGHTS[format]

  useEffect(() => {
    if (!EZOIC_ENABLED || typeof window === 'undefined') return

    // SPA-compatible ad loading
    if (window.ezstandalone?.cmd) {
      window.ezstandalone.cmd.push(() => {
        window.ezstandalone.define(slotId)
        window.ezstandalone.enable()
        window.ezstandalone.display()
      })
    }
  }, [slotId])

  if (!EZOIC_ENABLED) return null

  return (
    <div
      ref={containerRef}
      className={`ezoic-placeholder ${className}`}
      style={{
        minHeight: `${minHeight}px`,
        contain: 'layout style',
      }}
    >
      <div id={`ezoic-pub-ad-placeholder-${slotId}`} />
      {/* Skeleton placeholder while loading */}
      <div className="skeleton-ad" aria-hidden="true">
        Loading...
      </div>
    </div>
  )
}

// Compact variant for list injection
export function EzoicInlineAd({ slotId }: { slotId: number }) {
  return (
    <div className="col-span-full my-4">
      <EzoicPlaceholder slotId={slotId} format="mobileBanner" />
    </div>
  )
}
```

**Risk:** Low - uses existing Ezoic script pattern, defensive checks
**Verification:** Build + visual inspection via Playwright

---

### C. Layout Update (app/layout.tsx)

**Change:**

```typescript
// Before (line 33-38):
const ENABLE_EZOIC_SCRIPTS =
  process.env.NODE_ENV === "production" &&
  process.env.PLAYWRIGHT !== "1" &&
  !process.env.CI &&
  IS_VERCEL &&
  IS_VERCEL_PROD

// After:
import { EZOIC_ENABLED } from "@/lib/ads"

const ENABLE_EZOIC_SCRIPTS =
  EZOIC_ENABLED &&
  process.env.NODE_ENV === "production" &&
  process.env.PLAYWRIGHT !== "1" &&
  !process.env.CI &&
  IS_VERCEL &&
  IS_VERCEL_PROD
```

**Risk:** Low - additive change, preserves existing conditions
**Verification:** Build + production deployment check

---

### D. Placeholder Locations

#### Homepage (app/page.tsx)

- Insert `<EzoicPlaceholder slotId={AD_SLOTS.HOME_TOP} format="leaderboard" />` after line 127
- Insert `<EzoicPlaceholder slotId={AD_SLOTS.HOME_MID} format="rectangle" />` after line 210
- Insert `<EzoicPlaceholder slotId={AD_SLOTS.HOME_BOTTOM} format="leaderboard" />` before line 294

**Risk:** Low - visual placement changes only, reversible
**Verification:** Lighthouse CLS, visual inspection

---

#### Penny List (components/penny-list-client.tsx)

- Inject ads into `items` array at indices 10, 20, and after end
- Render as full-width cards: `<div className="col-span-full"><EzoicInlineAd slotId={...} /></div>`

**Risk:** Medium - grid injection could break layout if `col-span-full` doesn't work
**Mitigation:** Test with Playwright, verify grid doesn't break
**Verification:** Visual inspection + scroll test for CLS

---

#### SKU Detail (app/sku/[sku]/page.tsx)

- Insert after identifiers section
- Insert after related items

**Risk:** Low - append-style additions
**Verification:** Visual inspection

---

#### Guide (components/GuideContent.tsx)

- Insert after Section II, Section V, and before final CTA

**Risk:** Low - text-heavy page, ads are clearly separated
**Verification:** Visual inspection + readability check

---

#### Report Find (app/report-find/page.tsx)

- Insert at page bottom only (minimal ads, conversion page)

**Risk:** Low - single ad at bottom
**Verification:** Conversion flow still works

---

## Risk Assessment

### Per-Change Risks

| Change                | Risk Level | Mitigation                    | Rollback          |
| --------------------- | ---------- | ----------------------------- | ----------------- |
| lib/ads.ts            | None       | Pure config                   | Delete file       |
| ezoic-placeholder.tsx | Low        | TypeScript + defensive checks | Delete file       |
| app/layout.tsx        | Low        | Additive change               | Git revert        |
| Homepage ads          | Low        | Visual only                   | Remove components |
| Penny List ads        | Medium     | Grid injection could break    | Remove components |
| SKU detail ads        | Low        | Append-style                  | Remove components |
| Guide ads             | Low        | Text-heavy page               | Remove components |
| Report Find ads       | Low        | Single ad                     | Remove component  |

### Overall Risk Profile

- **CLS degradation:** Medium - mitigated by reserved heights
- **LCP degradation:** Low - ads lazy-load after content
- **Layout breakage:** Low-Medium - mitigated by incremental testing
- **Kill switch failure:** Low - simple boolean check

---

## Verification Plan

### Pre-Implementation (Baseline Capture)

Run Lighthouse mobile on each key page and record:

- LCP (target: ≤ 2.5s)
- CLS (target: < 0.1)
- INP (if available)
- Performance score

Save results in PR description for comparison.

**Command:**

```bash
npm run lighthouse:mobile -- --url=http://localhost:3001/ > baseline-home.txt
npm run lighthouse:mobile -- --url=http://localhost:3001/penny-list > baseline-list.txt
npm run lighthouse:mobile -- --url=http://localhost:3001/sku/123456 > baseline-sku.txt
npm run lighthouse:mobile -- --url=http://localhost:3001/guide > baseline-guide.txt
```

---

### Pre-Merge Checklist

**Build & Tests:**

- [ ] `npm run lint` - 0 errors
- [ ] `npm run build` - successful
- [ ] `npm run test:unit` - all passing
- [ ] `npm run test:e2e` - all passing

**Kill Switch:**

- [ ] Set `NEXT_PUBLIC_EZOIC_ENABLED=false` locally
- [ ] Verify all placeholders return `null` (no ad divs in DOM)
- [ ] Verify build still succeeds
- [ ] Set back to `true`

**Visual Verification (Playwright):**

- [ ] Homepage: 3 ad slots render, no layout shift
- [ ] Penny List: Ads appear as separate cards (not broken grid)
- [ ] Penny List: NO ad above first 10 items
- [ ] Penny List: Scroll test - no layout shift
- [ ] SKU detail: 2 ad slots render
- [ ] Guide: 3 ad slots render
- [ ] Report Find: 1 ad at bottom only
- [ ] All pages: No ad overlaps nav/buttons
- [ ] Console: No Ezoic-related errors (filter known ID5/CSP noise)

**Core Web Vitals (Lighthouse Mobile):**

- [ ] Homepage: CLS < 0.1, LCP ≤ 2.5s
- [ ] Penny List: CLS < 0.1, LCP ≤ 2.5s
- [ ] SKU detail: CLS < 0.1, LCP ≤ 2.5s
- [ ] Guide: CLS < 0.1, LCP ≤ 2.5s
- [ ] Report Find: CLS < 0.1, LCP ≤ 2.5s

**Documentation:**

- [ ] `SESSION_LOG.md` updated
- [ ] `STATE.md` updated (if meaningful)
- [ ] PR includes before/after Lighthouse comparison

---

### Post-Merge Monitoring

**Week 1:**

- Check Vercel Speed Insights for field CWV (CLS, LCP, INP)
- Monitor Ezoic dashboard for fill rate
- Watch for user reports of layout issues

**Week 2-3:**

- If CWV stable: consider expanding slots (up to 5-8 desktop)
- If CWV degraded: reduce slots or adjust formats

---

## Rollback Plan

### Quick Rollback

Set `NEXT_PUBLIC_EZOIC_ENABLED=false` in Vercel dashboard, then redeploy
→ All placeholders disappear and Ezoic scripts stop loading

### Full Rollback

Revert the PR via GitHub

### Partial Rollback

Remove specific page integrations (e.g., if Penny List CLS is bad, remove just those slots)

---

## Open Questions

### 1. Should we start with fewer slots?

**Context:** The plan proposes 12 total slots across 5 templates, but GA4 shows the site is still early and heavily mobile, with most traffic concentrated on `/` and `/penny-list`.

**Options:**

- **A) Safest** - Homepage + Guide only (4 slots). Skip Penny List + Report Find + SKU initially. Expand after 72h if CWV and user sentiment are good.
- **B) Balanced** - Homepage (3) + Penny List (1, after item #10) + Guide (1) = 5 slots total. Skip Report Find + SKU initially.
- **C) As planned** - All 12 slots across all templates, monitor closely.

**Recommendation:** Option B - it covers the pages that drive ~82% of page views (home + penny list + guide) while keeping risk and density low.

---

### 2. Should we enforce ad spacing rules?

**Context:** Multiple ads on same page could be too dense.

**Options:**

- **A) No rules** - Trust Ezoic's frequency capping
- **B) Minimum 1000px vertical spacing** - Hard-coded CSS rule
- **C) "Fold" rule** - Max 1 ad above fold, rest below

**Recommendation:** Option A initially, add rules if user feedback is negative

---

### 3. Should we track ad impressions in GA4?

**Context:** Useful for monitoring fill rate and revenue correlation.

**Options:**

- **A) No tracking** - Keep it simple
- **B) Track impressions only** - Fire GA4 event when ad renders
- **C) Track impressions + viewability** - Use Intersection Observer

**Recommendation:** Option B - low effort, high value for analytics

---

### 4. Should we add "Advertisement" labels?

**Context:** FTC guidelines may require disclosure.

**Options:**

- **A) No labels** - Ezoic handles this
- **B) Small "Ad" label** - Above each placeholder
- **C) Page-level disclosure** - "This page contains advertisements"

**Recommendation:** Option A - Ezoic already includes disclosures in ad units

---

### 5. Should we skip ads for authenticated users?

**Context:** Could improve UX for power users.

**Options:**

- **A) Show ads to everyone** - Maximize revenue
- **B) Hide ads for logged-in users** - Better UX
- **C) Hide ads for users with saved items** - Reward engagement

**Recommendation:** Option A - authentication is new, not enough users to justify revenue loss

---

## Implementation Order

1. Create `lib/ads.ts` (foundation)
2. Create `components/ezoic-placeholder.tsx` (component)
3. Update `app/layout.tsx` (wire up centralized flag)
4. Add homepage slots (3)
5. Add Penny List slots (3 with grid injection)
6. Add SKU detail slots (2)
7. Add Guide slots (3)
8. Add Report Find slot (1)
9. Test kill switch (`NEXT_PUBLIC_EZOIC_ENABLED=false`)
10. Run Lighthouse on all key pages
11. Compare to baseline metrics
12. Update documentation
13. Open PR with before/after comparison

---

## Notes

- Ezoic scripts already integrated (Privacy/CMP + header script in [app/layout.tsx:128-149](../../app/layout.tsx#L128-L149))
- CSP headers already whitelist Ezoic domains ([next.config.js](../../next.config.js))
- [public/ads.txt](../../public/ads.txt) already exists with Ezoic entries
- This is **bridge monetization** - temporary until Mediavine approval
- Trust-first principle: NO ads above Penny List results, minimal ads on conversion pages
- Conservative start: 3-5 slots mobile, 5-8 desktop max
- Expansion only after 48-72h of stable CWV metrics

---

## Prohibited at Launch

- ❌ Popups / interstitials
- ❌ Auto-play audio
- ❌ Sticky units covering UI
- ❌ Ads above Penny List results
- ❌ Ads in middle of Report Find form
- ❌ More than 8 slots per page
- ❌ Layout shift > 0.1
- ❌ LCP degradation > 0.5s

---

**Last updated:** 2026-01-22
**Next review:** After implementation + 72h monitoring
