# Implementation Plan: AdSense Recovery - Guide Atomization + E-E-A-T Hub

**Plan ID:** `adsense-recovery-guide-atomization`
**Created:** 2026-02-03
**Status:** Approved - Ready for Implementation
**Source File:** `C:\Users\cadeg\.claude\plans\virtual-wibbling-knuth.md`

---

## Project Vision

Transform the site from "utility with content" into a "publication with tools" by atomizing the comprehensive guide into targeted, indexable chapters and establishing an authoritative E-E-A-T hub.

**Result:** Sitemap grows from 12 URLs to 22 URLs, demonstrating publication quality to Google AdSense reviewers.

---

## Goal

Split the monolithic 5,913-word guide (`components/GuideContent.tsx`) into 6 separate, indexable pages, and create 4 new E-E-A-T pages.

## Done Means

### Functional Requirements

- ✅ 6 new guide pages accessible at `/guide/*` routes
- ✅ 4 new E-E-A-T pages accessible at root routes
- ✅ All pages have unique, SEO-optimized metadata
- ✅ Guide pages have prev/next navigation
- ✅ Guide landing page (`/guide`) becomes table of contents
- ✅ All 10 new pages added to sitemap
- ✅ Sitemap URL count: 22 (was 12)

### Quality Gates

- ✅ `npm run lint` - 0 errors
- ✅ `npm run build` - successful
- ✅ `npm run test:unit` - all passing
- ✅ `npm run test:e2e` - all passing

---

## Approved Design Decisions

1. **FAQ Placement:** Move FAQ entirely to `/faq`, remove from `/guide` (avoids duplication)
2. **Glossary Linking:** Link only major terms (ZMA, penny item, clearance cadence)
3. **Timestamps:** Omit "Last Updated" timestamps (content is evergreen)
4. **Sitemap Priority:** Tiered: FAQ (0.8) > How We Verify (0.7) > Resources/Glossary (0.6)
5. **Comments:** No comments on guide sub-pages initially

---

# EXPLICIT CONTENT EXTRACTION MAP

## Source File: `components/GuideContent.tsx`

**Total Lines:** 1575
**Total Word Count:** ~5,913 words

### Required Imports (Copy to ALL section components)

```typescript
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, Search, ShoppingCart, Store, XCircle } from "lucide-react"
```

---

## Page 1: `/guide/clearance-lifecycle`

**Estimated Words:** ~2,750
**SEO Target Keyword:** "home depot clearance lifecycle"

### Content to Extract

| Section                 | Source Lines  | Section ID            | H2 Title                                |
| ----------------------- | ------------- | --------------------- | --------------------------------------- |
| II. Clearance Lifecycle | Lines 61-271  | `clearance-lifecycle` | "Understanding the Clearance Lifecycle" |
| II-A. Timeline          | Lines 276-368 | `clearance-timeline`  | "Clearance Cadence Timeline"            |
| II-B. Visual Labels     | Lines 373-507 | `visual-labels`       | "Visual Label Recognition"              |
| II-C. Overhead Hunting  | Lines 512-596 | `overhead-hunting`    | "Overhead Hunting"                      |

### Exact JSX Boundaries

```
START: Line 61 → <section id="clearance-lifecycle" className="scroll-mt-28">
END: Line 596 → </section> (end of overhead-hunting section)
```

**Copy Lines 61-596 (inclusive) from GuideContent.tsx**

### Metadata for This Page

```typescript
export const metadata: Metadata = {
  title: "Understanding the Clearance Lifecycle at Home Depot | Penny Central",
  description:
    "Learn how Home Depot's clearance markdown sequence works. Master the .00 → .06 → .03 → penny progression and spot items before they hit $0.01.",
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/guide/clearance-lifecycle",
    title: "Understanding the Clearance Lifecycle at Home Depot",
    description:
      "Master the clearance cadences, price endings, and visual label recognition to predict penny items.",
  },
}
```

### Navigation

```typescript
<GuideNav
  prev={{ label: "Guide Overview", href: "/guide" }}
  next={{ label: "Digital Pre-Hunt", href: "/guide/digital-pre-hunt" }}
/>
```

---

## Page 2: `/guide/digital-pre-hunt`

**Estimated Words:** ~1,100
**SEO Target Keyword:** "home depot penny item app"

### Content to Extract

| Section                    | Source Lines  | Section ID            | H2 Title                                     |
| -------------------------- | ------------- | --------------------- | -------------------------------------------- |
| III. Pre-Hunt Intelligence | Lines 601-704 | `digital-tools`       | "Pre-Hunt Intelligence: Using Digital Tools" |
| III-A. Verify Penny Status | Lines 709-860 | `verify-penny-status` | "How to Verify Penny Status In-Store"        |

### Exact JSX Boundaries

```
START: Line 601 → <section id="digital-tools" className="scroll-mt-28">
END: Line 860 → </section> (end of verify-penny-status section)
```

**Copy Lines 601-860 (inclusive) from GuideContent.tsx**

### Metadata for This Page

```typescript
export const metadata: Metadata = {
  title: "Digital Pre-Hunt: Find Penny Items Before You Go | Penny Central",
  description:
    "Use the Home Depot app and website to identify potential penny items before visiting. Learn the signals that indicate an item may be $0.01.",
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/guide/digital-pre-hunt",
    title: "Digital Pre-Hunt: Find Penny Items Before You Go",
    description:
      "Scout potential penny items using the Home Depot app before heading to the store.",
  },
}
```

### Navigation

```typescript
<GuideNav
  prev={{ label: "Clearance Lifecycle", href: "/guide/clearance-lifecycle" }}
  next={{ label: "In-Store Strategy", href: "/guide/in-store-strategy" }}
/>
```

---

## Page 3: `/guide/in-store-strategy`

**Estimated Words:** ~1,200
**SEO Target Keyword:** "how to find penny items home depot"

### Content to Extract

| Section               | Source Lines    | Section ID         | H2 Title                            |
| --------------------- | --------------- | ------------------ | ----------------------------------- |
| IV. In-Store Hunting  | Lines 865-1026  | `in-store-hunting` | "In-Store Penny Hunting Strategies" |
| V. Checkout Challenge | Lines 1031-1145 | `checkout`         | "The Checkout Challenge"            |

### Exact JSX Boundaries

```
START: Line 865 → <section id="in-store-hunting" className="scroll-mt-28">
END: Line 1145 → </section> (end of checkout section)
```

**Copy Lines 865-1145 (inclusive) from GuideContent.tsx**

### Metadata for This Page

```typescript
export const metadata: Metadata = {
  title: "In-Store Penny Hunting Strategies & Checkout Tips | Penny Central",
  description:
    "Where to find penny items in Home Depot stores and how to get them through checkout. Learn the self-checkout method and what to do if stopped.",
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/guide/in-store-strategy",
    title: "In-Store Penny Hunting Strategies & Checkout Tips",
    description:
      "Master the in-store hunt: where to look, how to verify, and how to checkout successfully.",
  },
}
```

### Navigation

```typescript
<GuideNav
  prev={{ label: "Digital Pre-Hunt", href: "/guide/digital-pre-hunt" }}
  next={{ label: "Inside Scoop", href: "/guide/inside-scoop" }}
/>
```

---

## Page 4: `/guide/inside-scoop`

**Estimated Words:** ~450
**SEO Target Keyword:** "home depot penny item policy"

### Content to Extract

| Section          | Source Lines    | Section ID            | H2 Title                                |
| ---------------- | --------------- | --------------------- | --------------------------------------- |
| VI. Inside Scoop | Lines 1150-1234 | `internal-operations` | "The Inside Scoop: Internal Operations" |

### Exact JSX Boundaries

```
START: Line 1150 → <section id="internal-operations" className="scroll-mt-28">
END: Line 1234 → </section>
```

**Copy Lines 1150-1234 (inclusive) from GuideContent.tsx**

### Metadata for This Page

```typescript
export const metadata: Metadata = {
  title: "Inside Scoop: How Home Depot Penny Items Work Internally | Penny Central",
  description:
    "Understand the ZMA process, employee policies, FIRST phones, and why management cares about penny items. The insider perspective on how it all works.",
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/guide/inside-scoop",
    title: "Inside Scoop: How Home Depot Penny Items Work Internally",
    description: "The insider perspective: ZMA, employee rules, and why penny items exist.",
  },
}
```

### Navigation

```typescript
<GuideNav
  prev={{ label: "In-Store Strategy", href: "/guide/in-store-strategy" }}
  next={{ label: "Fact vs Fiction", href: "/guide/fact-vs-fiction" }}
/>
```

---

## Page 5: `/guide/fact-vs-fiction`

**Estimated Words:** ~400
**SEO Target Keyword:** "home depot penny item myths"

### Content to Extract

| Section              | Source Lines    | Section ID        | H2 Title                              |
| -------------------- | --------------- | ----------------- | ------------------------------------- |
| VII. Fact vs Fiction | Lines 1239-1338 | `fact-vs-fiction` | "Research Deep Dive: Fact vs Fiction" |

### Exact JSX Boundaries

```
START: Line 1239 → <section id="fact-vs-fiction" className="scroll-mt-28">
END: Line 1338 → </section>
```

**Copy Lines 1239-1338 (inclusive) from GuideContent.tsx**

### Metadata for This Page

```typescript
export const metadata: Metadata = {
  title: "Penny Item Myths: Fact vs Fiction | Penny Central",
  description:
    "Separate penny hunting facts from fiction. What's true about Home Depot penny items and what's just rumor? The definitive guide to community intel.",
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/guide/fact-vs-fiction",
    title: "Penny Item Myths: Fact vs Fiction",
    description: "What's real and what's rumor? The truth about Home Depot penny items.",
  },
}
```

### Navigation

```typescript
<GuideNav
  prev={{ label: "Inside Scoop", href: "/guide/inside-scoop" }}
  next={{ label: "Responsible Hunting", href: "/guide/responsible-hunting" }}
/>
```

---

## Page 6: `/guide/responsible-hunting`

**Estimated Words:** ~713
**SEO Target Keyword:** "penny hunting tips"

### Content to Extract

| Section                   | Source Lines    | Section ID            | H2 Title                       |
| ------------------------- | --------------- | --------------------- | ------------------------------ |
| VIII. Responsible Hunting | Lines 1343-1401 | `responsible-hunting` | "Responsible Penny Hunting"    |
| IX. Conclusion            | Lines 1406-1511 | `conclusion`          | "Conclusion: Tips for Success" |

### Exact JSX Boundaries

```
START: Line 1343 → <section id="responsible-hunting" className="scroll-mt-28">
END: Line 1511 → </section> (end of conclusion section)
```

**Copy Lines 1343-1511 (inclusive) from GuideContent.tsx**

**Note:** Do NOT include the "Start Hunting CTA" section (Lines 1516-1571) - this stays on the landing page.

### Metadata for This Page

```typescript
export const metadata: Metadata = {
  title: "Responsible Penny Hunting: Tips for Long-Term Success | Penny Central",
  description:
    "Penny hunting best practices: respect store employees, use community resources wisely, and know when to walk away. Tips for beginners and veterans.",
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/guide/responsible-hunting",
    title: "Responsible Penny Hunting: Tips for Long-Term Success",
    description:
      "Best practices for penny hunting: stay respectful, stay strategic, stay in the game.",
  },
}
```

### Navigation

```typescript
<GuideNav
  prev={{ label: "Fact vs Fiction", href: "/guide/fact-vs-fiction" }}
  next={{ label: "View Penny List", href: "/penny-list" }}
/>
```

---

# INTRODUCTION SECTION (Special Handling)

**Lines 18-56** contain Section I: Introduction. This content should be:

- Added to the `/guide` landing page as the overview
- OR added to `/guide/clearance-lifecycle` as a preamble

**Recommended:** Add to landing page as overview text.

---

# E-E-A-T PAGES (New Content Required)

These pages require **new content creation**, not extraction from existing files.

## Page 7: `/faq`

**Target Words:** ~800
**SEO Target Keyword:** "home depot penny items faq"

### Source Content

- Move existing FAQ from `app/guide/page.tsx` lines 184-232
- Add 5-10 NEW questions:

**New FAQ Questions to Write:**

1. "How often do penny items appear?" - Answer: Varies by store, usually weekly batch drops
2. "Can I resell penny items?" - Answer: Legally yes, but ethically debated in community
3. "What's the best time to hunt?" - Answer: Early morning, mid-week, after seasonal changeovers
4. "Do all Home Depot stores have penny items?" - Answer: Yes, but quantity varies by store/region
5. "Is buying penny items allowed by Home Depot?" - Answer: Not prohibited for customers, but not intended
6. "How do I know if an item will penny soon?" - Answer: Price endings (.03, .02), old tag dates, "unavailable" online
7. "What happens if an employee takes my penny item?" - Answer: Nothing you can do, move on
8. "Can I use coupons on penny items?" - Answer: Usually no, $0.01 floor price
9. "Why do some stores never have penny items?" - Answer: Better inventory management, more aggressive pulling
10. "What's the most expensive penny item ever found?" - Answer: Community stories vary, $500+ items reported

### Schema

Use FAQPage schema (copy pattern from existing guide page lines 76-117)

---

## Page 8: `/how-we-verify`

**Target Words:** ~500
**SEO Target Keyword:** "penny central verification"

### Content to Write

**Section 1: Our Data Sources**

- Primary: Community reports via `/report-find` form
- Secondary: Facebook groups (Penny Shoppers, Home Depot Penny Hunters)
- Tertiary: Reddit r/HomeDepot clearance threads

**Section 2: Verification Process**

- Every submission includes: SKU, state, purchase date
- Moderators cross-reference with known penny drops
- Duplicate reports increase confidence score
- Old reports (>7 days) flagged as potentially stale

**Section 3: Freshness & Accuracy**

- Data is crowd-sourced, not official
- "Usually updated within about 5 minutes" = when community reports
- Accuracy depends on reporter honesty
- Regional variations exist (what's penny in Texas may not be in California)

**Section 4: What We Don't Do**

- We don't scrape Home Depot's systems
- We don't guarantee any item will be available
- We don't verify every report manually

---

## Page 9: `/resources`

**Target Words:** ~400
**SEO Target Keyword:** "home depot penny hunting resources"

### Content to Write

**Section 1: Official Home Depot Tools**

- Home Depot App (iOS/Android) - set your store, search SKUs
- Home Depot Website - check inventory status
- Pro Xtra App - for pro account holders

**Section 2: Penny Central Tools (Internal Links)**

- `/penny-list` - Live community penny list
- `/store-finder` - Find Home Depot locations
- `/trip-tracker` - Track your hunting trips
- `/report-find` - Report your finds
- `/guide` - Complete penny hunting guide

**Section 3: Community Resources (External Links)**

- Facebook: Penny Shoppers (private group)
- Facebook: Home Depot Penny Hunters
- Reddit: r/HomeDepot (clearance threads)
- Reddit: r/Flipping (resale discussion)

**Section 4: Cashback & Savings**

- Rakuten (link: `/go/rakuten`) - cashback on HD purchases
- Honey - browser extension for coupons
- Ibotta - receipt scanning for cashback

---

## Page 10: `/glossary`

**Target Words:** ~600
**SEO Target Keyword:** "home depot clearance terms"

### Terms to Define

| Term                             | Definition                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| **Penny Item**                   | Merchandise marked down to $0.01 in Home Depot's internal system                             |
| **ZMA (Zero Margin Adjustment)** | The internal process that reduces an item's system value to nearly zero                      |
| **Clearance Cadence**            | The predictable sequence of markdowns items follow before pennying                           |
| **Price Ending**                 | The cents portion of a clearance price (.00, .06, .03, .04, .02) that signals markdown stage |
| **SKU**                          | Stock Keeping Unit - Home Depot's internal product identifier                                |
| **UPC**                          | Universal Product Code - the manufacturer's barcode                                          |
| **Internet Number**              | Home Depot's online product identifier (different from SKU)                                  |
| **FIRST Phone**                  | The orange handheld device employees use to scan inventory                                   |
| **Zebra Device**                 | Alternative name for the handheld scanner employees use                                      |
| **Clearance Endcap (EC)**        | End-of-aisle display for clearance items (being phased out)                                  |
| **Overhead**                     | Storage shelves above the aisles where old inventory hides                                   |
| **Yellow Tag**                   | The clearance price label (don't scan this - scan the UPC)                                   |
| **Self-Checkout (SCO)**          | The preferred checkout method for penny items                                                |
| **Keeper Item**                  | A decoy item added to your cart to look normal at checkout                                   |
| **No Home**                      | Items in overhead that no longer have a shelf location                                       |
| **Seasonal Changeover**          | When stores transition inventory (spring→summer, etc.) - prime penny time                    |

### Cross-Link Pattern

Link major terms to relevant guide sections:

- "Clearance Cadence" → `/guide/clearance-lifecycle`
- "Price Ending" → `/guide/clearance-lifecycle#clearance-timeline`
- "ZMA" → `/guide/inside-scoop`

---

# FILES TO CREATE

## New Page Files (10 total)

```
app/guide/clearance-lifecycle/page.tsx
app/guide/digital-pre-hunt/page.tsx
app/guide/in-store-strategy/page.tsx
app/guide/inside-scoop/page.tsx
app/guide/fact-vs-fiction/page.tsx
app/guide/responsible-hunting/page.tsx
app/faq/page.tsx
app/how-we-verify/page.tsx
app/resources/page.tsx
app/glossary/page.tsx
```

## New Component Files (2 navigation + 6 section components)

```
components/guide/GuideNav.tsx
components/guide/GuideTOC.tsx
components/guide/sections/ClearanceLifecycle.tsx
components/guide/sections/DigitalPreHunt.tsx
components/guide/sections/InStoreStrategy.tsx
components/guide/sections/InsideScoop.tsx
components/guide/sections/FactVsFiction.tsx
components/guide/sections/ResponsibleHunting.tsx
```

---

# FILES TO MODIFY

## 1. `app/guide/page.tsx`

**Changes:**

1. Remove `import { GuideContent } from "@/components/GuideContent"`
2. Remove `<GuideContent />` from the JSX
3. Keep the Introduction section (Section I) as overview text
4. Add `<GuideTOC />` component showing chapter grid
5. Keep the "Start Hunting CTA" section (lines 1516-1571 from GuideContent.tsx)
6. REMOVE the existing FAQ section (move to `/faq`)
7. Update metadata to reflect "overview" nature

## 2. `app/sitemap.ts`

**Add these 10 entries:**

```typescript
// Guide sub-pages
{ url: `${baseUrl}/guide/clearance-lifecycle`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
{ url: `${baseUrl}/guide/digital-pre-hunt`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
{ url: `${baseUrl}/guide/in-store-strategy`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
{ url: `${baseUrl}/guide/inside-scoop`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
{ url: `${baseUrl}/guide/fact-vs-fiction`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
{ url: `${baseUrl}/guide/responsible-hunting`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },

// E-E-A-T pages
{ url: `${baseUrl}/faq`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
{ url: `${baseUrl}/how-we-verify`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
{ url: `${baseUrl}/resources`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
{ url: `${baseUrl}/glossary`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
```

## 3. `app/about/page.tsx`

**Add author bio section:**

- "About the Creator" heading
- Brief story: why Penny Central was built
- Experience with penny hunting
- E-E-A-T credentials

## 4. `components/GuideContent.tsx`

**Option A (Recommended):** Keep file intact, create new section components that import from it
**Option B:** Delete after all section components are created and working

---

# PAGE TEMPLATE

Every new guide page follows this pattern:

```typescript
import type { Metadata } from "next"
import { [SectionComponent] } from "@/components/guide/sections/[SectionName]"
import { GuideNav } from "@/components/guide/GuideNav"
import { PageHeader, PageShell, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "[Page Title] | Penny Central",
  description: "[120-160 char description]",
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/guide/[slug]",
    title: "[Page Title]",
    description: "[OG description]",
    images: [{ url: "/api/og?page=guide-[slug]", width: 1200, height: 630 }],
  },
}

export default function [PageName]Page() {
  return (
    <PageShell width="wide">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pennycentral.com" },
              { "@type": "ListItem", position: 2, name: "Guide", item: "https://www.pennycentral.com/guide" },
              { "@type": "ListItem", position: 3, name: "[Page Title]", item: "https://www.pennycentral.com/guide/[slug]" },
            ],
          }),
        }}
      />

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "[Page Title]",
            description: "[Description]",
            url: "https://www.pennycentral.com/guide/[slug]",
            author: { "@type": "Organization", name: "Penny Central" },
            publisher: {
              "@type": "Organization",
              name: "Penny Central",
              logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
            },
          }),
        }}
      />

      <PageHeader
        title="[Page Title]"
        subtitle="[Subtitle description]"
        primaryAction={{ label: "Check Penny List", href: "/penny-list" }}
        align="left"
      />

      <Section>
        <[SectionComponent] />
      </Section>

      <Section>
        <GuideNav
          prev={{ label: "[Prev Label]", href: "/guide/[prev-slug]" }}
          next={{ label: "[Next Label]", href: "/guide/[next-slug]" }}
        />
      </Section>
    </PageShell>
  )
}
```

---

# IMPLEMENTATION SEQUENCE

## Phase 1: Create Section Components (Extract Content)

**Order:**

1. Create `components/guide/sections/` directory
2. Create `ClearanceLifecycle.tsx` - Copy lines 61-596 from GuideContent.tsx
3. Create `DigitalPreHunt.tsx` - Copy lines 601-860
4. Create `InStoreStrategy.tsx` - Copy lines 865-1145
5. Create `InsideScoop.tsx` - Copy lines 1150-1234
6. Create `FactVsFiction.tsx` - Copy lines 1239-1338
7. Create `ResponsibleHunting.tsx` - Copy lines 1343-1511

**Verification:** `npm run lint && npm run build`

## Phase 2: Create Navigation Components

1. Create `components/guide/GuideNav.tsx`
2. Create `components/guide/GuideTOC.tsx`

**Verification:** `npm run lint && npm run build`

## Phase 3: Create Guide Pages

**Order (follow dependency):**

1. `app/guide/clearance-lifecycle/page.tsx`
2. `app/guide/digital-pre-hunt/page.tsx`
3. `app/guide/in-store-strategy/page.tsx`
4. `app/guide/inside-scoop/page.tsx`
5. `app/guide/fact-vs-fiction/page.tsx`
6. `app/guide/responsible-hunting/page.tsx`

**Verification after each:** `npm run build` + manual browser check

## Phase 4: Update Guide Landing Page

1. Modify `app/guide/page.tsx`
2. Remove GuideContent import
3. Add GuideTOC component
4. Remove FAQ section (moving to standalone page)
5. Keep Introduction and CTA sections

**Verification:** `npm run build` + check `/guide` renders correctly

## Phase 5: Create E-E-A-T Pages

**Order:**

1. `app/faq/page.tsx` - Move FAQ from guide, expand with new questions
2. `app/how-we-verify/page.tsx` - New content about verification process
3. `app/resources/page.tsx` - Curated links to tools and communities
4. `app/glossary/page.tsx` - Define penny hunting terminology

**Verification after each:** `npm run build` + manual browser check

## Phase 6: Update Sitemap

1. Add 10 new URLs to `app/sitemap.ts`

**Verification:** `npm run build && curl http://localhost:3000/sitemap.xml | grep -c "<url>"` → Should be 22

## Phase 7: Update About Page

1. Add author bio section to `app/about/page.tsx`

**Verification:** `npm run build`

## Final Verification

```bash
npm run lint        # 0 errors
npm run build       # successful
npm run test:unit   # all passing
npm run test:e2e    # all passing
```

---

# NAVIGATION MAP

```
/guide (landing)
  ├── /guide/clearance-lifecycle (prev: /guide, next: digital-pre-hunt)
  ├── /guide/digital-pre-hunt (prev: clearance-lifecycle, next: in-store-strategy)
  ├── /guide/in-store-strategy (prev: digital-pre-hunt, next: inside-scoop)
  ├── /guide/inside-scoop (prev: in-store-strategy, next: fact-vs-fiction)
  ├── /guide/fact-vs-fiction (prev: inside-scoop, next: responsible-hunting)
  └── /guide/responsible-hunting (prev: fact-vs-fiction, next: /penny-list)

/faq (standalone)
/how-we-verify (standalone)
/resources (standalone)
/glossary (standalone)
```

---

# SITEMAP FINAL STATE (22 URLs)

```
https://www.pennycentral.com                          (priority: 1.0)
https://www.pennycentral.com/penny-list               (priority: 0.9)
https://www.pennycentral.com/guide                    (priority: 0.9)
https://www.pennycentral.com/guide/clearance-lifecycle (priority: 0.8)
https://www.pennycentral.com/guide/digital-pre-hunt   (priority: 0.8)
https://www.pennycentral.com/guide/in-store-strategy  (priority: 0.8)
https://www.pennycentral.com/guide/inside-scoop       (priority: 0.8)
https://www.pennycentral.com/guide/fact-vs-fiction    (priority: 0.8)
https://www.pennycentral.com/guide/responsible-hunting (priority: 0.8)
https://www.pennycentral.com/store-finder             (priority: 0.8)
https://www.pennycentral.com/clearance-lifecycle      (priority: 0.8)
https://www.pennycentral.com/faq                      (priority: 0.8)
https://www.pennycentral.com/how-we-verify            (priority: 0.7)
https://www.pennycentral.com/report-find              (priority: 0.7)
https://www.pennycentral.com/trip-tracker             (priority: 0.7)
https://www.pennycentral.com/resources                (priority: 0.6)
https://www.pennycentral.com/glossary                 (priority: 0.6)
https://www.pennycentral.com/cashback                 (priority: 0.6)
https://www.pennycentral.com/about                    (priority: 0.5)
https://www.pennycentral.com/contact                  (priority: 0.5)
https://www.pennycentral.com/support                  (priority: 0.4)
https://www.pennycentral.com/privacy-policy           (priority: 0.3)
```

---

# ROLLBACK PLAN

If any phase breaks the build:

1. `git revert HEAD` - Revert last commit
2. Investigate error
3. Fix locally and test
4. Re-commit

Emergency rollback (full revert):

```bash
git log --oneline -10  # Find commit before changes
git revert HEAD~N      # Revert N commits
```

---

# SUCCESS METRICS

| Metric              | Before | After    |
| ------------------- | ------ | -------- |
| Sitemap URLs        | 12     | 22       |
| Guide URLs          | 1      | 7        |
| E-E-A-T pages       | 3      | 7        |
| Total indexed words | ~8,000 | ~15,000+ |

---

**Status:** Plan complete. Ready for implementation by any agent.

**Handoff:** This plan is self-contained and explicit enough for Google Gemini 3 Pro or any other agentic coder to execute without ambiguity.
