# Implementation Plan: Driving Habitual Traffic to Penny Central

**Created:** Dec 15, 2025
**Status:** Ready for Implementation
**Current Sprint:** Sprint 1 - Visual Engagement

---

## Summary

**Goal:** Convert one-time visitors into daily habitual users through visual engagement, fresh daily content, and verified penny finds.

**Key Decisions (Based on User Input):**
- **Quantity field:** Keep in database, hide from public display
- **Product images:** Web scraping Home Depot by SKU
- **Image hosting:** Vercel Blob Storage (free tier: 1GB)
- **Verification system:** Admin-controlled verified badges leveraging your 1000+ SKU history
- **Implementation:** Claude builds 95%, user provides direction

---

## Phase 1: Visual Engagement (Highest Priority)

### Task 1.1: Home Depot Product Image Scraper

**What:** Fetch product images from Home Depot website by SKU

**Technical Approach:**
```
1. Create lib/scrape-hd-image.ts
2. URL pattern: https://www.homedepot.com/p/[SKU]
3. Scrape og:image meta tag (product thumbnail)
4. Cache images to Vercel Blob Storage (free 1GB tier)
5. Fallback: Generic placeholder image
```

**Files to Create/Modify:**
- `lib/scrape-hd-image.ts` - NEW: Scraper function
- `lib/image-cache.ts` - NEW: Vercel Blob caching layer
- `lib/fetch-penny-data.ts` - MODIFY: Add image fetching to data pipeline

**Rate Limiting:** 1 request per second to avoid blocking

---

### Task 1.2: Hide Quantity from Display (Keep in Database)

**What:** Remove quantity from UI, retain in data layer for future analytics

**Files to Modify:**
- `components/penny-list-card.tsx` - Remove quantity display
- `components/penny-list-card-compact.tsx` - Remove quantity display
- `app/report-find/page.tsx` - Keep field but make optional/less prominent
- `lib/fetch-penny-data.ts` - Keep quantity in PennyItem type (no change)

---

### Task 1.3: Display Product Images in Penny List

**What:** Show scraped product images prominently in card view

**Files to Modify:**
- `components/penny-list-card.tsx` - Add image display with lazy loading
- `components/penny-list-card-compact.tsx` - Add thumbnail
- `app/penny-list/page.tsx` - Pass image URLs to components

**UI Design:**
- Card view: Large image at top (like Pinterest)
- Table view: Small thumbnail in first column
- Loading state: Skeleton placeholder
- Error state: Generic HD product placeholder

---

## Phase 2: Daily Fresh Content (Habitual Traffic Driver)

### Task 2.1: "Today's Penny Finds" Homepage Section

**What:** Prominent section showing items added in last 24-48 hours

**Files to Create/Modify:**
- `app/page.tsx` - Add "Today's Finds" section after hero
- `components/todays-finds.tsx` - NEW: Component to display recent items
- `lib/fetch-penny-data.ts` - Add function to filter by date

**UI Design:**
- Horizontal scrollable carousel on mobile
- Grid on desktop (3-4 items)
- Shows: Image, item name, state badges, "X hours ago"
- CTA: "See all penny finds →"

---

### Task 2.2: "Last Updated" Timestamp

**What:** Show users when data was last refreshed (builds trust + freshness signal)

**Files to Modify:**
- `app/penny-list/page.tsx` - Add timestamp header
- `lib/fetch-penny-data.ts` - Return fetch timestamp

---

## Phase 3: Verified Penny Items System

### Task 3.1: Admin Verification Badge System

**What:** Add "Verified" status to penny items you personally confirm

**Data Model Addition:**
```typescript
interface PennyItem {
  // existing fields...
  verified: boolean;          // Is this admin-verified?
  verifiedDate?: string;      // When was it verified?
  verifiedSource?: string;    // "personal_purchase" | "facebook" | "internal_tool"
}
```

**Files to Create/Modify:**
- `lib/fetch-penny-data.ts` - Add verified fields to type
- `components/penny-list-card.tsx` - Add verified badge UI
- `components/penny-list-filters.tsx` - Add "Verified only" toggle
- `data/verified-skus.json` - NEW: List of admin-verified SKUs

**Verification Data File (you populate this):**
```json
{
  "1234567890": {
    "verified": true,
    "verifiedDate": "2024-12-15",
    "source": "personal_purchase"
  }
}
```

**About Old Data (6+ months):**
- Still valuable! Shows historical penny patterns
- Add "First reported: X months ago" to show longevity
- Items verified long ago that are STILL being found = high confidence
- Consider "Evergreen" badge for items with 6+ month track record

---

### Task 3.2: Bulk Import Your 1000+ SKU History

**What:** Create import script to load your personal purchase history

**Files to Create:**
- `scripts/import-verified-skus.ts` - NEW: Import script
- `data/verified-skus.json` - NEW: Verified SKU database

**Process:**
1. You provide CSV/JSON of your purchase history (SKU, date, item name)
2. Script formats and imports to verified-skus.json
3. These automatically get "Verified" badge in penny list

---

## Phase 4: SEO Expansion (Long-term Traffic)

### Task 4.1: Individual SKU Pages

**What:** Create /sku/[id] pages for massive SEO surface area

**Files to Create:**
- `app/sku/[id]/page.tsx` - NEW: Dynamic SKU page
- `app/sku/[id]/layout.tsx` - NEW: SEO metadata

**Page Content:**
- Large product image
- Item name, SKU, department/category
- Report history: "Found in 12 states since Oct 2024"
- State map showing where reported
- Tier badge (Very Common / Common / Rare)
- Verified badge (if applicable)
- "Report this item" CTA
- Related penny items

**SEO Value:**
- URL: `/sku/1234567890`
- Title: "SKU 1234567890 | Husky LED Work Light - Penny Item | Penny Central"
- Targets: "1234567890 penny", "husky led work light one cent"

---

### Task 4.2: State Landing Pages

**What:** Create /[state] pages for geographic SEO

**Files to Create:**
- `app/pennies/[state]/page.tsx` - NEW: State-specific page

**Page Content:**
- "Penny Items in Florida" headline
- Items filtered to that state
- State-specific store finder
- "X items found in Florida this week"

**SEO Value:**
- URL: `/pennies/florida`
- Targets: "florida home depot penny items", "penny items florida"

---

## Implementation Order

### Sprint 1 (Current - Visual Engagement)
1. [ ] Task 1.1: HD Product Image Scraper
2. [ ] Task 1.2: Hide quantity from display
3. [ ] Task 1.3: Display images in penny list

### Sprint 2 (Next - Fresh Content & Verification)
4. [ ] Task 2.1: "Today's Finds" homepage section
5. [ ] Task 2.2: "Last Updated" timestamp
6. [ ] Task 3.1: Verification badge system
7. [ ] Task 3.2: Import your SKU history

### Sprint 3 (Future - SEO Expansion)
8. [ ] Task 4.1: Individual SKU pages
9. [ ] Task 4.2: State landing pages

---

## Files Summary

### New Files to Create:
- `lib/scrape-hd-image.ts` - HD image scraper
- `lib/image-cache.ts` - Vercel Blob caching
- `components/todays-finds.tsx` - Homepage section
- `data/verified-skus.json` - Admin-verified SKUs
- `scripts/import-verified-skus.ts` - Import script
- `app/sku/[id]/page.tsx` - SKU detail pages
- `app/pennies/[state]/page.tsx` - State pages

### Files to Modify:
- `lib/fetch-penny-data.ts` - Add image fetching, verification
- `components/penny-list-card.tsx` - Add image, remove quantity, add verified badge
- `components/penny-list-card-compact.tsx` - Same updates
- `components/penny-list-filters.tsx` - Add "Verified only" filter
- `app/page.tsx` - Add "Today's Finds" section
- `app/penny-list/page.tsx` - Add timestamp, pass images
- `app/report-find/page.tsx` - Make quantity optional

---

## Technical Notes

### HD Image Scraping Approach:
- Primary: Fetch `https://www.homedepot.com/p/[SKU]` and extract `og:image` meta tag
- Alternative: Use HD search API if direct SKU URL fails
- Cache strategy: Store in Vercel Blob with 30-day expiry
- Fallback: Orange HD logo placeholder image

### Vercel Blob Storage (Free Tier):
- 1GB storage included
- Average product image: ~50KB
- Capacity: ~20,000 product images
- No additional cost needed initially

### Rate Limiting for Scraping:
- 1 request per second max
- Batch fetch during build time when possible
- On-demand fetch for new submissions
- Cache aggressively to minimize requests

---

## Success Metrics

Track these to measure impact:
1. **Returning visitors %** - Goal: 30%+ within 6 months
2. **Pages per session** - Goal: 5+ pages
3. **Community submissions** - Goal: 10+ per day
4. **Organic search traffic** - Goal: 2x in 6 months

---

## Strategic Context

**Why This Plan:**
- Visual engagement (Pinterest-style) is #1 priority - text-only browsing is boring
- Don't fragment data - verification badges enrich existing list
- Individual SKU pages = massive SEO opportunity (could 10x organic traffic)
- Quantity field is unverifiable noise - real value is "found in X states on Y dates"

**Habit Loop We're Building:**
1. **Cue:** Morning coffee or before heading to Home Depot
2. **Routine:** Check Penny Central for today's finds in my state
3. **Reward:** Visual browsing (images) + "ooh I saw that at my store!" dopamine hit

**To Strengthen This Loop:**
- Make reward MORE visual (product images)
- Make reward MORE immediate (homepage "Today's Finds")
- Make cue MORE automatic (future: email notifications, saved searches)

---

## For AI Agents

**Next Session Should Start With:**
```
GOAL: Implement Sprint 1, Task 1 - Home Depot Product Image Scraper
WHY: Visual browsing is 10x more engaging than text-only lists
DONE MEANS:
- lib/scrape-hd-image.ts created (fetch HD product page, extract og:image)
- lib/image-cache.ts created (Vercel Blob caching layer)
- lib/fetch-penny-data.ts modified (add image fetching to pipeline)
- Rate limiting: 1 req/sec max
- Fallback to placeholder on error
- Build/lint/test pass
```

**Important Constraints:**
- Don't create separate verified list - use badges on unified list
- Quantity field: hide from UI, keep in database
- Use Vercel Blob Storage (free tier) - no paid services
- All 4 quality gates must pass: lint, build, test:unit, test:e2e

**See Also:**
- `.ai/BACKLOG.md` - Prioritized task breakdown
- `.ai/STATE.md` - Current project state
- `.ai/SESSION_LOG.md` - Planning session details
