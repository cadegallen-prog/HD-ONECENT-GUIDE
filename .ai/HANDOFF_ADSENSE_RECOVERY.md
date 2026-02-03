# HANDOFF: AdSense/Monumetric Recovery Implementation

**Date:** Feb 3, 2026
**Status:** Plan approved, ready for execution
**Timeline:** 2-4 weeks (target AdSense reapplication: Feb 28 - Mar 3)

---

## TL;DR

**Problem:** AdSense rejected site Feb 2 for "Low Value Content." This blocks Monumetric MCM approval (same Google standards).

**Root Cause:** Site looks like a "utility/tool" (SKU database with some content) rather than a "content publication" (editorial site with tools).

**Solution:** Transform into content-first publication via guide atomization + E-E-A-T pages.

**Plan File:** `C:\Users\cadeg\.claude\plans\virtual-wibbling-knuth.md`

---

## Current State

### What's Been Fixed ✅

- Sitemap pruned from 900 to 12 URLs (Feb 2)
- SKU pages noindex'd (800+ pages)
- State pages noindex'd (50 pages)
- GSC sitemap resubmitted

### What's Still Broken ❌

- Only 12 indexed pages (too "light" for publication)
- 5,913-word guide counts as ONE URL
- Site perceived as "utility" not "publication"
- E-E-A-T signals weak

### Critical Research (ChatGPT Deep Research)

**Finding #1:** AdSense approval IS required for Monumetric

> "If your site's not approved, you will be unable to monetize the site… irrespective of the type of demand."

**Finding #2:** The site looks like a "utility," not a "publication"

> "Even though you do have a 4,000-word guide, the overall site might still appear to their reviewers as primarily a 'utility' page with less narrative content."

**Finding #3:** Wait 2-4 weeks before reapplying (not Feb 5-7)

> "Experts recommend waiting about 2–4 weeks before re-submitting your AdSense application."

---

## The Implementation Plan

### Phase 1: Immediate (Today)

**1.1 Email Monumetric**
Send email from plan file (lines 46-71) notifying them of AdSense rejection and corrective actions.

**1.2 Document Baseline**

- Screenshot GSC index status
- Record current sitemap URL count
- Note indexed vs. excluded counts

---

### Phase 2: Guide Atomization (Feb 3-7)

**Goal:** Split monolithic guide into 6-7 separate, indexable pages.

#### Files to Create

```
app/guide/clearance-lifecycle/page.tsx     (~2,750 words from sections II, II-A, II-B, II-C)
app/guide/digital-pre-hunt/page.tsx        (~1,100 words from sections III, III-A)
app/guide/in-store-strategy/page.tsx       (~1,200 words from sections IV, V)
app/guide/inside-scoop/page.tsx            (~450 words from section VI)
app/guide/fact-vs-fiction/page.tsx         (~400 words from section VII)
app/guide/responsible-hunting/page.tsx     (~713 words from sections VIII, IX)
```

**Note:** Directory structure already exists! These are placeholder folders waiting for `page.tsx` files.

#### Source Content

All content lives in: `components/GuideContent.tsx`

**Section breakdown:**

- Lines 16-56: Section I (Introduction)
- Lines 59-273: Section II + subsections (Clearance Lifecycle)
- Lines 599-862: Section III + subsection (Digital Tools)
- Lines 863-1028: Section IV (In-Store Hunting)
- Lines 1029-1147: Section V (Checkout)
- Lines 1148-1236: Section VI (Inside Scoop)
- Lines 1237-1340: Section VII (Fact vs Fiction)
- Lines 1341-1403: Section VIII (Responsible Hunting)
- Lines 1404-1513: Section IX (Conclusion)

#### Implementation Steps

1. **Extract sections into components**
   - Create `components/guide/sections/` directory
   - Create component files: `ClearanceLifecycle.tsx`, `DigitalPreHunt.tsx`, etc.
   - Copy relevant JSX from `GuideContent.tsx`
   - Keep styling classes intact

2. **Create page files**
   - Each route gets a `page.tsx` with:
     - Metadata (title, description, OG tags)
     - Breadcrumb schema
     - Article schema
     - Section component import
     - Navigation (prev/next)

3. **Update guide landing page**
   - `app/guide/page.tsx` becomes TOC/overview
   - Remove `<GuideContent />`, replace with navigation grid
   - Link to all 6 sub-pages

4. **Create navigation components**
   - `components/guide/GuideNav.tsx` - Prev/Next buttons
   - `components/guide/GuideTOC.tsx` - Table of contents sidebar

5. **Update sitemap**
   - `app/sitemap.ts` - Add 6 new guide URLs
   - Priority: 0.8 (slightly lower than main guide)
   - Change frequency: monthly

---

### Phase 3: E-E-A-T Pages (Feb 7-10)

**Goal:** Add 4 trust/authority pages.

#### Files to Create

```
app/faq/page.tsx              (~800 words - expand FAQ from guide, add more Q&As)
app/how-we-verify/page.tsx    (~500 words - explain community reporting process)
app/resources/page.tsx        (~400 words - curated links to HD app, tools, community)
app/glossary/page.tsx         (~600 words - define penny hunting terms)
```

#### Content Guidelines

**`/faq`**

- Move FAQ section from `app/guide/page.tsx` (lines 184-232)
- Expand with 5-10 additional questions:
  - "How often do penny items appear?"
  - "Can I resell penny items?"
  - "What's the best time to hunt?"
  - "Do all HD stores have penny items?"
  - "Is this allowed by Home Depot?"
  - etc.

**`/how-we-verify`**

- Explain the community reporting process
- Describe moderation/verification steps
- Mention Facebook group as source
- Show transparency about data freshness

**`/resources`**

- Link to Home Depot app (official)
- Link to Store Finder tool (internal)
- Link to Trip Tracker (internal)
- Link to Facebook community
- Link to r/HomeDepot clearance threads
- Explain cashback options

**`/glossary`**

- Define terms: ZMA, penny item, clearance cadence, markdown, SKU, internet number, UPC, endcap, etc.
- Cross-link to guide sections
- SEO-friendly definitions

---

### Phase 4: Page Enhancements

**`app/about/page.tsx`**

- Add author bio section
- Explain "Why I built this"
- Credentials/experience with penny hunting
- Show E-E-A-T (Experience, Expertise)

**`app/penny-list/page.tsx`** (via `components/penny-list-client.tsx`)

- Add introductory paragraph above the table
- Explain what the list is, how it's sourced, how to use it

**`app/page.tsx` (homepage)**

- Ensure clear editorial voice
- Not just tool links - explain the mission

---

### Phase 5: Verification (Feb 10-14)

**Build Check**

```bash
npm run build
```

Must pass without errors.

**Sitemap Check**

```bash
curl https://www.pennycentral.com/sitemap.xml | grep -c "<url>"
```

Expected: 22-25 (was 12)

**Page Rendering**

- Visit each new URL in browser
- Check mobile responsiveness
- Test navigation between guide sections
- Verify all images/tables render

**GSC Submission**

- Submit updated sitemap
- Request indexing for new pages
- Monitor "Pages" report

---

### Phase 6: Wait Period (Feb 14-28)

**Do NOT reapply yet.** Google needs 2-4 weeks to:

1. Recrawl the site
2. Index new pages
3. Process noindex tags on thin pages
4. Update quality signals

**During wait:**

- Monitor GSC daily
- Watch for "Indexed" status on new pages
- Confirm "Excluded by noindex" on thin pages

---

### Phase 7: Reapplication (Feb 28 - Mar 3)

**Prerequisites:**

- ✅ New guide pages indexed in GSC
- ✅ E-E-A-T pages indexed in GSC
- ✅ Sitemap shows 22-25 URLs
- ✅ At least 2 weeks since changes

**Reapply via AdSense dashboard**

- Expect 1-2 week review
- If approved: notify Monumetric
- If rejected: analyze reason, iterate

---

## Success Metrics

| Metric                       | Before | Target   |
| ---------------------------- | ------ | -------- |
| Indexed pages                | 12     | 22-25    |
| "Not indexed" pages          | 787    | <50      |
| Guide URLs                   | 1      | 7        |
| E-E-A-T pages                | 3      | 7+       |
| Total words on indexed pages | ~8,000 | ~15,000+ |

---

## Key Files Reference

**Source Content:**

- `components/GuideContent.tsx` - All guide sections (5,913 words)

**To Create (10 files):**

- `app/guide/clearance-lifecycle/page.tsx`
- `app/guide/digital-pre-hunt/page.tsx`
- `app/guide/in-store-strategy/page.tsx`
- `app/guide/inside-scoop/page.tsx`
- `app/guide/fact-vs-fiction/page.tsx`
- `app/guide/responsible-hunting/page.tsx`
- `app/faq/page.tsx`
- `app/how-we-verify/page.tsx`
- `app/resources/page.tsx`
- `app/glossary/page.tsx`

**To Modify:**

- `app/guide/page.tsx` - Convert to TOC/landing
- `app/sitemap.ts` - Add 10 new URLs
- `app/about/page.tsx` - Add author bio

**To Create (Components):**

- `components/guide/GuideNav.tsx`
- `components/guide/GuideTOC.tsx`
- `components/guide/sections/*.tsx`

---

## Documentation References

- **Full plan:** `C:\Users\cadeg\.claude\plans\virtual-wibbling-knuth.md`
- **SKU analysis:** `.ai/SKU_CONTENT_ANALYSIS.md`
- **Monetization status:** `.ai/topics/MONETIZATION.md`
- **AdSense fix details:** `.ai/ADSENSE_NEXT_STEPS.md`
- **Learning #11:** `.ai/LEARNINGS.md` (sitemap bloat)

---

## Timeline at a Glance

| Date   | Milestone                            |
| ------ | ------------------------------------ |
| Feb 3  | Email Monumetric + start atomization |
| Feb 7  | Guide atomization complete           |
| Feb 10 | E-E-A-T pages complete               |
| Feb 14 | Deploy + verify + submit to GSC      |
| Feb 28 | Reapply to AdSense                   |
| Mar 17 | Expected approval (if successful)    |

---

## First Steps for New Agent

1. **Read the full plan:** `C:\Users\cadeg\.claude\plans\virtual-wibbling-knuth.md`
2. **Send Monumetric email** (template in plan, lines 46-71)
3. **Start with guide atomization** (Phase 2)
4. **Create one page first** (e.g., `/guide/clearance-lifecycle`) as template for others
5. **Test build after each page** to catch issues early

---

## Owner Context

**Cade cannot code.** He relies on you to:

- Make technical decisions
- Verify changes work correctly
- Explain outcomes in plain English
- Catch mistakes proactively

**His role:**

- Grant permissions
- Make business decisions
- Run `/verify` and `/doctor` commands
- Provide feedback on UX/content

---

## Critical Success Factors

1. **All new pages must have substantial content** (400+ words minimum)
2. **Metadata must be unique** for each page (titles, descriptions)
3. **Navigation must work** between guide sections
4. **Build must pass** before deploy
5. **Wait 2-4 weeks** before reapplying (don't rush)

---

**Status:** Ready to execute. Start with Phase 1 (email Monumetric), then Phase 2 (guide atomization).
