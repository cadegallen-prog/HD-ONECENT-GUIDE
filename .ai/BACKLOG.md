# Backlog (AI‑Driven, Ordered)

**Last updated:** Dec 16, 2025
Keep this list short and ruthless (≤10 items).
Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Propose approach in plain English
4. Implement + test
5. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

---

## Completed Recently

- **Dec 15, 2025:** Strategic plan created for driving habitual traffic (visual engagement, verification system, SEO expansion)
- **Dec 12, 2025:** Updated `.ai/PENNY_LIST_PLAN.md` to reflect Phase 1 shipped.
- **Dec 12, 2025:** CI (`.github/workflows/quality.yml`) now runs lint + Playwright smoke with fixtures.
- **Dec 16, 2025:** Added curated `/verified-pennies` route (image-first grid + search + brand filtering) and updated homepage/nav to prioritize Verified + Penny List; clarified “Verified” definition and cleaned up remaining raw Tailwind palette colors.

---

## P0 — Do Next (Sprint 1: Visual Engagement)

### 1. **Enrich Community Reports with Verified Images**

    - **Why:** Gets the Pinterest effect without scraping or new infra.
    - **What:** When `/penny-list` items lack a user photo, look up SKU in `data/verified-pennies.json` and use its `imageUrl` as a fallback.
    - **Done means:**
       - No scraping added
       - `/penny-list` shows images for items that exist in the curated verified dataset
       - Placeholder only when neither user photo nor verified dataset image exists
       - Build/lint/test pass
    - **Files:** MODIFY: `lib/fetch-penny-data.ts` (and any UI components that render the image)

### 2. **Hide Quantity from Display (Keep in Database)**

- **Why:** Quantity is unverifiable noise; real value is "SKU found in X states on Y dates"
- **What:** Remove quantity from all public-facing UI, retain in database for future analytics
- **Done means:**
  - Quantity removed from penny-list cards and table
  - Quantity field still in submission form but optional/less prominent
  - PennyItem type unchanged (keeps quantity field)
  - Build/lint/test pass
- **Files:** MODIFY: `components/penny-list-card.tsx`, `components/penny-list-card-compact.tsx`, `app/report-find/page.tsx`

### 3. **Display Product Images in Penny List**

- **Why:** Makes browsing addictive, easier to identify items visually
- **What:** Show scraped images prominently in card/table views
- **Done means:**
  - Card view: Large image at top (Pinterest-style)
  - Table view: Small thumbnail in first column
  - Lazy loading for performance
  - Skeleton loading state
  - Fallback placeholder for missing images
  - Build/lint/test pass
- **Files:** MODIFY: `components/penny-list-card.tsx`, `components/penny-list-card-compact.tsx`, `app/penny-list/page.tsx`

---

## P2 — Optional / If Needed (Higher Risk)

### **Home Depot Product Image Scraper (Deferred)**

- **Why:** Only worth it if curated + user-provided images aren’t enough.
- **What:** Fetch images by SKU and cache them (rate-limited, stable, non-flaky).
- **Note:** Scraping is higher risk (flaky, ToS-sensitive, maintenance); prefer curated datasets first.

---

## P1 — Sprint 2 (Fresh Content & Verification)

### 4. **"Today's Penny Finds" Homepage Section**

- **Why:** Daily fresh content = daily visits. Homepage should show what's new immediately.
- **What:** Prominent section showing items added in last 24-48 hours
- **Done means:**
  - Homepage has "Today's Finds" section after hero
  - Horizontal carousel (mobile) / grid (desktop)
  - Shows: image, item name, state badges, "X hours ago"
  - CTA: "See all penny finds →"
- **Files:** NEW: `components/todays-finds.tsx` | MODIFY: `app/page.tsx`, `lib/fetch-penny-data.ts`

### 5. **Verification Badge System**

- **Why:** Add credibility without fragmenting data
- **What:** Admin-controlled "Verified by Penny Central" badges on items Cade personally confirms
- **Done means:**
  - PennyItem type has `verified`, `verifiedDate`, `verifiedSource` fields
  - Verified badge UI in cards
  - "Verified only" filter option
  - `data/verified-skus.json` file for Cade to populate
  - Verification enriches existing crowdsourced list (not separate list)
- **Files:** NEW: `data/verified-skus.json` | MODIFY: `lib/fetch-penny-data.ts`, `components/penny-list-card.tsx`, `components/penny-list-filters.tsx`

### 6. **Bulk Import Verified SKU History**

- **Why:** Leverage Cade's 1000+ SKU purchase history for instant credibility
- **What:** Import script to load Cade's historical data
- **Done means:**
  - `scripts/import-verified-skus.ts` script created
  - Cade can provide CSV/JSON of SKU, date, item name
  - Script formats and writes to `data/verified-skus.json`
  - Items automatically get verified badge
- **Files:** NEW: `scripts/import-verified-skus.ts`

---

## P2 — Sprint 3 (SEO Expansion - Long-term Traffic)

### 7. **Individual SKU Pages**

- **Why:** Every SKU = unique page = massive SEO surface area (could 10x organic traffic)
- **What:** `/sku/[id]` dynamic pages
- **Done means:**
  - Dynamic route: `/sku/1234567890`
  - Page shows: product image, item name, all reports, state map, tier, verified badge
  - SEO optimized title/description
  - "Report this SKU" CTA
  - Related items section
- **Files:** NEW: `app/sku/[id]/page.tsx`, `app/sku/[id]/layout.tsx`

### 8. **State Landing Pages**

- **Why:** Geographic SEO targeting ("florida home depot penny items")
- **What:** `/pennies/[state]` pages
- **Done means:**
  - State-specific pages (e.g., `/pennies/florida`)
  - Auto-filtered to show only that state's items
  - State map with HD locations
  - "X items found in Florida this week" stat
  - SEO optimized
- **Files:** NEW: `app/pennies/[state]/page.tsx`

---

## P3 — Later / Only If Metrics Justify

### 9. **"Last Updated" Timestamp**

- **Why:** Builds trust, shows freshness
- **What:** Display when penny list data was last refreshed
- **Files:** MODIFY: `app/penny-list/page.tsx`, `lib/fetch-penny-data.ts`

### 10. **Image Upload to Submission Form**

- **Why:** User-generated images = authenticity + social proof
- **What:** Optional photo upload for receipts/products
- **Done means:** Cloudinary/Uploadthing integration, moderation before public display
- **Files:** MODIFY: `app/report-find/page.tsx`, NEW: image upload API

### 11. **Optional moderation gate**

- Add "Approved" column in Sheet and filter server‑side.
- Only do this if spam/junk exceeds ~10%.

---

## Full Implementation Plan

**See:** `~/.claude/plans/sprightly-mixing-anchor.md` for complete technical details

**Strategic Goal:** Convert one-time visitors into daily habitual users

**Key Metrics to Track:**

- Returning visitors % (Goal: 30%+ in 6 months)
- Pages per session (Goal: 5+)
- Community submissions (Goal: 10+ per day)
- Organic search traffic (Goal: 2x in 6 months)
