# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-01-22 - Copilot - Penny List Bottom Pagination

**Goal:** Fix mobile UX issue where users have to scroll all the way back to the top to navigate to the next page. Add bottom pagination controls with "Page X of Y" indicator.

**Status:** ✅ Complete + verified (all 4 gates: lint/build/unit/e2e)

### Problem

- Pagination controls only appeared at the top of the penny list
- Users scrolling through 25-100 items would reach what looked like the end
- Had to scroll all the way back up to access page 2
- Particularly bad on mobile where lists can be very long

### Changes

- **`components/penny-list-client.tsx`:**
  - Added comment marker for "Top pagination controls" (existing controls)
  - Added new bottom pagination section after the results (card grid or table)
  - Bottom pagination only shows when `total > 0 && pageCount > 1`
  - Features:
    - "Showing X to Y of Z items" summary text
    - Previous/Next buttons with arrow indicators (← →)
    - "Page X of Y" indicator (larger, more prominent than top)
    - Auto-scroll to top on page change (`window.scrollTo({ top: 0, behavior: "smooth" })`)
    - 44px min-height for mobile tap targets
    - Border-top separator for visual clarity

### UX Improvements

1. **No more scroll-back frustration** - Users can immediately navigate to next page
2. **Clear page context** - "Page X of Y" shows progress through results
3. **Item count feedback** - "Showing 1 to 50 of 237 items" provides context
4. **Smooth scroll-to-top** - Navigating to next page brings user back to top smoothly
5. **Mobile-first** - All buttons meet 44px minimum tap target requirement

### Verification

- **Lint:** ✅ 0 errors, 0 warnings
- **Build:** ✅ Compiled successfully
- **Unit:** ✅ All tests passing
- **E2E:** ✅ 100 tests passing

Full verification: `reports/verification/2026-01-22T07-33-39/summary.md`

### Impact

Mobile users will no longer get "stuck" at the bottom of long result lists. The bottom pagination makes it immediately obvious there are more pages and provides one-tap navigation without scrolling.

---

## 2026-01-22 - Copilot - Global SEO & Indexing Fix: Canonical Tags

**Goal:** Fix Google Search Console issue where `/penny-list` is "Crawled - currently not indexed" due to missing canonical tag. Consolidate authority on new URL, ignore old redirects.

**Status:** ✅ Complete + verified (all 4 gates: lint/build/unit/e2e)

### Changes

- **`lib/canonical.ts` (new):** Created canonical URL utilities
  - `CANONICAL_BASE = "https://www.pennycentral.com"`
  - `getCanonicalUrl(pathname, searchParams?)` → generates self-referencing canonical URLs
  - `getCanonicalLinkElement(pathname, searchParams?)` → HTML string helper (unused for now)

- **`app/layout.tsx`:** Updated root metadata
  - Added import: `import { CANONICAL_BASE } from "@/lib/canonical"`
  - Updated `metadataBase` to use `CANONICAL_BASE` constant
  - Added `alternates.canonical` to metadata config
  - Next.js automatically renders as `<link rel="canonical" href="https://www.pennycentral.com" />` in `<head>`

- **`app/penny-list/page.tsx`:** Updated page metadata
  - Added import: `import { getCanonicalUrl } from "@/lib/canonical"`
  - Added `alternates.canonical: getCanonicalUrl("/penny-list")` to metadata
  - Renders as: `<link rel="canonical" href="https://www.pennycentral.com/penny-list" />`

- **`app/sku/[sku]/page.tsx`:** Updated dynamic page metadata
  - Added import: `import { getCanonicalUrl } from "@/lib/canonical"`
  - Updated `generateMetadata()` to include `alternates.canonical: getCanonicalUrl(\`/sku/${sku}\`)`
  - Each SKU page renders its own self-referencing canonical (e.g., `/sku/12345`)

### How It Works

The root layout provides a fallback canonical (`/`). Dynamic pages override with their own via the `alternates.canonical` metadata field. Next.js automatically renders each as a proper `<link rel="canonical" ... />` tag in the page `<head>`.

- `/` → `<link rel="canonical" href="https://www.pennycentral.com" />`
- `/penny-list` → `<link rel="canonical" href="https://www.pennycentral.com/penny-list" />`
- `/sku/12345` → `<link rel="canonical" href="https://www.pennycentral.com/sku/12345" />`
- `/guide` → Inherits root canonical (no override yet; can add if needed)

### Verification

- **Lint:** ✅ 0 errors, 0 warnings (fixed trailing whitespace in canonical.ts)
- **Build:** ✅ Compiled successfully
- **Unit:** ✅ All tests passing
- **E2E:** ✅ 100 tests passing

Full verification: `reports/verification/2026-01-22T06-53-56/summary.md`

### Impact

Google Search Console will now see the canonical tag on all pages. Within a few days to a few weeks, Google will:

1. Recognize `/penny-list` as the canonical version
2. Stop showing "Crawled - currently not indexed" message
3. Consolidate ranking signals to the new URL
4. Ignore old redirected URLs in favor of `/penny-list`

---

## 2026-01-21 - Codex - SKU page: prioritize reports/states above related (mobile-first)

**Goal:** Fix SKU detail page UX regression: "Where it was found" was below Related, and outbound Home Depot CTA visually competed with "Report this find".
**Status:** ✅ Complete + verified (lint/build/unit/e2e)

### Changes

- `app/sku/[sku]/page.tsx`:
  - Move "Where it was found" section above "Related penny items".
  - Make "Report this find" the primary CTA; demote "View on Home Depot" to secondary styling.
  - Add inline state chips (with counts) under "Community Reports" so the summary pays off immediately.
  - Restore "New to Penny Hunting?" as a properly boxed card (`block w-full`, `bg-[var(--bg-card)]`).

### Proof

- Verification bundle: `reports/verification/2026-01-21T22-17-23/summary.md`
- SKU screenshots (Playwright): `reports/verification/sku-related-items-chromium-mobile-light.png`, `reports/verification/sku-related-items-chromium-mobile-dark.png`
