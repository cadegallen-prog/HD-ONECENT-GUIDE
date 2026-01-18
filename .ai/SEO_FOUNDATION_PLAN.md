# SEO Foundation Package (P0-3)

**Status:** Ready to Execute (On Hold - Lower Priority)
**Created:** 2026-01-17
**Estimated Effort:** 3-5 days of AI work
**Expected Impact:** Foundation for organic traffic growth (8-12 week timeline for Google to respond)

---

## Executive Summary

**Problem:** Zero non-branded organic clicks despite having schema markup. Position 11.6 for "home depot penny list" (page 2). 100% dependent on Facebook traffic.

**Root Cause:** Schema markup alone doesn't boost rankings. Google needs multiple signals: content depth, internal linking, authority signals, and time to crawl/index/rank.

**Solution:** Validate and fix existing schemas + strengthen internal linking + add missing schema types + minor content enhancements. This creates the foundation for organic growth without becoming a months-long content project.

**Timeline:** 2-3 weeks for Google to recrawl after deployment. 8-12 weeks to see meaningful organic traffic gains.

---

## What's Already Done (Don't Redo)

✅ FAQ schema on `/guide` (lines 76-119)
✅ HowTo schema on `/guide` (lines 34-75)
✅ Breadcrumb schemas on `/guide` and `/penny-list`
✅ WebSite + Organization schemas in root layout
✅ Article schema on `/guide`
✅ Dataset schema on `/penny-list`
✅ H1s match target keywords
✅ Meta descriptions optimized

---

## Phase 1: Schema Validation & Fixes (1 day)

### Task 1.1: Validate All Existing Schemas

**Tool:** Google Rich Results Test (https://search.google.com/test/rich-results)

**Test URLs:**
- https://www.pennycentral.com/guide
- https://www.pennycentral.com/penny-list
- https://www.pennycentral.com (homepage)
- https://www.pennycentral.com/sku/[pick-a-real-sku]

**Expected Issues:**
- Missing `datePublished` / `dateModified` on Article schema
- Missing `image` on Organization schema (currently using SVG, Google prefers raster)
- Possible FAQ schema issues (answers too short, missing required fields)

**Acceptance Criteria:**
- [ ] All schemas pass Google Rich Results Test with 0 errors
- [ ] Any warnings documented with reasoning for why they're acceptable
- [ ] Screenshot proof of validation results saved to `reports/seo/schema-validation-[date].png`

### Task 1.2: Fix Schema Errors

**Files to Modify:**
- `app/layout.tsx` (Organization schema - add proper logo image)
- `app/guide/page.tsx` (Article schema - add datePublished, dateModified)
- Any other files with schema errors

**Acceptance Criteria:**
- [ ] All errors from Task 1.1 fixed
- [ ] Revalidate in Google Rich Results Test - 0 errors
- [ ] No new TypeScript errors introduced
- [ ] All 4 gates pass (lint/build/unit/e2e)

---

## Phase 2: Add Missing Schema Types (1 day)

### Task 2.1: Add ItemList Schema to `/penny-list`

**Why:** Helps Google understand the penny list as a structured collection of items.

**File:** `app/penny-list/page.tsx`

**Schema Structure:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Home Depot Penny Items List",
  "description": "Community-reported $0.01 items at Home Depot",
  "numberOfItems": [total count from validItems],
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://www.pennycentral.com/sku/[sku]"
    },
    // Include first 10-20 items to avoid massive payload
  ]
}
```

**Acceptance Criteria:**
- [ ] ItemList schema added to `/penny-list` page
- [ ] Validates in Google Rich Results Test
- [ ] Includes top 10-20 items (not all - avoid bloat)
- [ ] All 4 gates pass

### Task 2.2: Add Product Schema to SKU Pages

**Why:** Helps Google understand individual penny items as products.

**File:** `app/sku/[sku]/page.tsx`

**Schema Structure:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[item name]",
  "image": "[product image URL]",
  "description": "[notes or fallback description]",
  "sku": "[SKU]",
  "brand": {
    "@type": "Brand",
    "name": "[brand from enrichment]"
  },
  "offers": {
    "@type": "Offer",
    "price": "0.01",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "[Home Depot product URL]"
  }
}
```

**Acceptance Criteria:**
- [ ] Product schema added to all SKU pages
- [ ] Validates in Google Rich Results Test
- [ ] Uses enrichment data when available
- [ ] Falls back gracefully when data is missing
- [ ] All 4 gates pass

---

## Phase 3: Strengthen Internal Linking (1 day)

### Task 3.1: Add Contextual Links in GuideContent

**File:** `components/GuideContent.tsx`

**Links to Add:**
1. In "Introduction" section: Link "community" to `/penny-list`
2. In "Clearance Lifecycle" section: Link "check the penny list" to `/penny-list`
3. In "Digital Pre-Hunt" section: Link "Store Finder" to `/store-finder`
4. In "In-Store Strategy" section: Link "report a find" to `/report-find`
5. In "Checkout Strategy" section: Link "share with the community" to `/report-find`

**Acceptance Criteria:**
- [ ] 5+ contextual links added within guide content (not just nav/footer)
- [ ] Links use descriptive anchor text (not "click here")
- [ ] Links open in same tab (internal navigation)
- [ ] All 4 gates pass

### Task 3.2: Add Contextual Links on Homepage

**File:** `app/page.tsx`

**Links to Add:**
1. In "How It Works" section: Link "Learn the Cycle" to `/guide#clearance-lifecycle`
2. In "How It Works" section: Link "Scout First" to `/store-finder`
3. In hero section: Add "Not sure where to start? Read the guide" link

**Acceptance Criteria:**
- [ ] 3+ contextual links added within homepage content
- [ ] Links use descriptive anchor text
- [ ] All 4 gates pass

### Task 3.3: Add Breadcrumb UI Components

**Why:** Schema exists, but no visible breadcrumbs. Adding UI helps users AND reinforces site hierarchy for Google.

**Files to Modify:**
- `components/breadcrumb.tsx` (create new component)
- `app/guide/page.tsx` (add breadcrumb UI)
- `app/penny-list/page.tsx` (add breadcrumb UI)
- `app/sku/[sku]/page.tsx` (add breadcrumb UI)

**Component Spec:**
```tsx
// Small, unobtrusive breadcrumb component
// Home > Guide
// Home > Penny List
// Home > Penny List > SKU 12345
```

**Acceptance Criteria:**
- [ ] Breadcrumb component created following design system
- [ ] Added to `/guide`, `/penny-list`, and SKU pages
- [ ] Matches existing schema structure
- [ ] Mobile-friendly (doesn't clutter small screens)
- [ ] All 4 gates pass
- [ ] Playwright screenshot proof

---

## Phase 4: Minor Content Enhancements (1-2 days)

### Task 4.1: Expand Guide with Long-Tail Keyword Sections

**File:** `components/GuideContent.tsx`

**Sections to Add:**
1. **"When Do Home Depot Penny Items Drop?"** (targets: "when do home depot penny items drop", "home depot penny schedule")
   - Content: Explain weekly markdown cycles, best days to hunt, seasonal patterns
   - 200-300 words

2. **"Best Time to Find Penny Items at Home Depot"** (targets: "best time to find penny items", "home depot clearance schedule")
   - Content: Early morning vs. evening, weekday vs. weekend, after seasonal resets
   - 200-300 words

3. **"How to Scan for Penny Items Without Looking Suspicious"** (targets: "how to scan penny items", "home depot self checkout penny items")
   - Content: Use app before going to store, self-checkout best practices, what NOT to do
   - 200-300 words

**Acceptance Criteria:**
- [ ] 3 new sections added to guide (600-900 words total)
- [ ] Each section targets specific long-tail keywords
- [ ] Content is practical and actionable (not keyword stuffing)
- [ ] Sections integrate naturally into existing guide flow
- [ ] All 4 gates pass

### Task 4.2: Update Meta Descriptions with Long-Tail Keywords

**Files to Modify:**
- `app/guide/page.tsx` (meta description)
- `app/penny-list/page.tsx` (meta description)
- `app/page.tsx` (meta description)

**Current vs. Improved:**

**Guide (current):**
> "Learn timing, what to scan, and how penny finds happen. A practical guide backed by live community experience."

**Guide (improved):**
> "Learn when Home Depot penny items drop, what to scan, and how to find $0.01 clearance items. Step-by-step guide from 50K+ community members."

**Penny List (current):**
> "Live $0.01 items reported by the community, organized by state and recency. See what's being found right now."

**Penny List (improved):**
> "Live Home Depot penny list ($0.01 items) updated daily. Filter by state, see what's being found right now, and report your finds."

**Acceptance Criteria:**
- [ ] Meta descriptions updated to include long-tail keywords
- [ ] Still under 160 characters (Google's display limit)
- [ ] Natural-sounding (not keyword stuffed)
- [ ] All 4 gates pass

---

## Phase 5: Sitemap & Indexing (0.5 days)

### Task 5.1: Update Sitemap with Priority Signals

**File:** `public/sitemap.xml`

**Priority Updates:**
```xml
<!-- High priority pages (1.0) -->
<url>
  <loc>https://www.pennycentral.com/guide</loc>
  <priority>1.0</priority>
  <changefreq>weekly</changefreq>
</url>
<url>
  <loc>https://www.pennycentral.com/penny-list</loc>
  <priority>1.0</priority>
  <changefreq>daily</changefreq>
</url>

<!-- Medium priority (0.8) -->
<url>
  <loc>https://www.pennycentral.com</loc>
  <priority>0.8</priority>
  <changefreq>daily</changefreq>
</url>
```

**Acceptance Criteria:**
- [ ] Sitemap updated with priority and changefreq signals
- [ ] All URLs accessible (no 404s)
- [ ] Sitemap validates at https://www.xml-sitemaps.com/validate-xml-sitemap.html

### Task 5.2: Submit Updated Sitemap to Google Search Console

**Manual Step (Cade):**
1. Go to Google Search Console
2. Navigate to Sitemaps section
3. Submit https://www.pennycentral.com/sitemap.xml
4. Screenshot confirmation

**Acceptance Criteria:**
- [ ] Screenshot proof of sitemap submission
- [ ] No errors in Google Search Console

---

## Decision Log

### Locked Decisions

1. ✅ **Approach:** Option B (SEO Foundation Package) - balanced effort, multiple SEO signals
2. ✅ **No new landing pages:** Avoid scope creep; focus on strengthening existing pages
3. ✅ **No external link building:** Out of scope for this phase (requires ongoing outreach)
4. ✅ **Breadcrumb UI:** Add visible breadcrumbs to match existing schema
5. ✅ **ItemList schema:** Limit to top 10-20 items to avoid bloat
6. ✅ **Content additions:** 3 new guide sections (600-900 words total) targeting long-tail keywords
7. ✅ **Timeline expectation:** 8-12 weeks to see meaningful organic traffic (2-3 weeks for Google to recrawl)

### Open Decisions

None - plan is fully specified.

---

## Structural Ambiguity Register

### Resolved Ambiguities

1. **"Should we add Product schema to every SKU page or just enriched ones?"**
   - **Resolution:** Add to all SKU pages. Use enrichment data when available, fall back to minimal schema when missing.

2. **"How many items should ItemList schema include?"**
   - **Resolution:** Top 10-20 items only. Full list would bloat payload and slow page load.

3. **"Should breadcrumb UI match the schema exactly?"**
   - **Resolution:** Yes. Schema says `Home > Guide`, UI should match.

4. **"What if Google Rich Results Test shows warnings (not errors)?"**
   - **Resolution:** Document warnings and reasoning. Only fix if warning indicates actual problem.

5. **"Should we wait 8-12 weeks to verify impact?"**
   - **Resolution:** No. Deploy immediately, but set expectation that organic traffic gains take time. Track in Google Search Console weekly.

**Status:** ✅ EMPTY (all ambiguities resolved)

---

## Acceptance Checklist

### Phase 1: Schema Validation & Fixes
- [ ] All schemas validate in Google Rich Results Test (0 errors)
- [ ] Screenshot proof saved to `reports/seo/schema-validation-[date].png`
- [ ] All 4 gates pass (lint/build/unit/e2e)

### Phase 2: Add Missing Schema Types
- [ ] ItemList schema added to `/penny-list` and validates
- [ ] Product schema added to SKU pages and validates
- [ ] Schemas tested with sample URLs
- [ ] All 4 gates pass

### Phase 3: Strengthen Internal Linking
- [ ] 5+ contextual links added to guide content
- [ ] 3+ contextual links added to homepage
- [ ] Breadcrumb UI component created and deployed to 3+ pages
- [ ] Playwright screenshot proof of breadcrumbs
- [ ] All 4 gates pass

### Phase 4: Minor Content Enhancements
- [ ] 3 new guide sections added (600-900 words total)
- [ ] Meta descriptions updated on 3 pages
- [ ] Content targets long-tail keywords naturally (not stuffed)
- [ ] All 4 gates pass

### Phase 5: Sitemap & Indexing
- [ ] Sitemap updated with priority/changefreq signals
- [ ] Sitemap validates at xml-sitemaps.com
- [ ] Screenshot proof of Google Search Console submission

### Final Verification
- [ ] All 4 gates pass (lint/build/unit/e2e)
- [ ] Deploy to production
- [ ] Verify live URLs in Google Rich Results Test
- [ ] Track in Google Search Console weekly for 8-12 weeks

---

## Files to Modify

### Phase 1
- `app/layout.tsx` (Organization schema fixes)
- `app/guide/page.tsx` (Article schema fixes)

### Phase 2
- `app/penny-list/page.tsx` (ItemList schema)
- `app/sku/[sku]/page.tsx` (Product schema)

### Phase 3
- `components/GuideContent.tsx` (contextual links)
- `app/page.tsx` (contextual links)
- `components/breadcrumb.tsx` (new file)
- `app/guide/page.tsx` (breadcrumb UI)
- `app/penny-list/page.tsx` (breadcrumb UI)
- `app/sku/[sku]/page.tsx` (breadcrumb UI)

### Phase 4
- `components/GuideContent.tsx` (new sections)
- `app/guide/page.tsx` (meta description)
- `app/penny-list/page.tsx` (meta description)
- `app/page.tsx` (meta description)

### Phase 5
- `public/sitemap.xml` (priority updates)

---

## Success Metrics (Track in Google Search Console)

**Baseline (Jan 17, 2026):**
- Organic clicks: 80 (all branded)
- Average position: 11.6 for "home depot penny list"
- Impressions: ~500/month

**Target (8-12 weeks after deployment):**
- Organic clicks: 200+ (mix of branded + non-branded)
- Average position: 6-8 for "home depot penny list"
- Impressions: 1,000+/month
- Long-tail keyword visibility: 10+ keywords in top 20

**Track Weekly:**
- Impressions (should increase first)
- CTR (should improve as position improves)
- Average position (should decrease = higher ranking)
- Clicks (should increase last)

---

## Notes for Future Agent

**When to Execute:**
- After higher-priority tasks (submissions, retention) are complete
- When Cade says "let's tackle SEO now"
- Estimated timeline: 3-5 days of work spread over 1-2 weeks

**What NOT to Do:**
- Don't add external link building (out of scope)
- Don't create new landing pages (scope creep)
- Don't expect instant results (Google needs 8-12 weeks)
- Don't skip validation steps (schema errors hurt more than help)

**Dependencies:**
- Google Search Console access (Cade)
- Playwright MCP for screenshots
- All 4 quality gates must pass

**Reference:**
- This plan: `.ai/SEO_FOUNDATION_PLAN.md`
- North Star: `.ai/CONTEXT.md`
- Verification: `.ai/VERIFICATION_REQUIRED.md`
- Critical Rules: `.ai/CRITICAL_RULES.md`
