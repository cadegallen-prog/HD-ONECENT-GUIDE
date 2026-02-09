# Guide Restructure — Gap Analysis & Prioritized Roadmap

> Generated: 2026-02-08  
> Context: Transcript analysis + live codebase audit  
> Status: Monumetric MCM / GAM domain approval pending re-review

---

## 1. COMPLETED (What's Finalized & Shipped)

### Guide Architecture (Done)

- [x] **Single-page → 7 chapters + hub** — Restructure from one 5,000-word page to 8 separate routes is complete
- [x] **Guide hub** (`/guide`) — 222 lines, ~839 rendered words, includes:
  - "How to use this guide" section
  - "Why this guide format works" section (3 paragraphs of original content)
  - Triage tracks (4 experience-level entry points)
  - Chapter TOC grid with improved hover states
  - "Execution standards" section
  - "Essential Tools" links (Penny List, Report a Find, Store Finder, Support)
- [x] **7 chapter pages** — All exist and render with meaningful content:
  - `/what-are-pennies` — ~986 words
  - `/clearance-lifecycle` — ~1,548 words
  - `/digital-pre-hunt` — ~1,266 words
  - `/in-store-strategy` — ~1,386 words
  - `/inside-scoop` — ~1,212 words
  - `/facts-vs-myths` — ~1,248 words
  - `/faq` — ~2,972 words
- [x] **Chapter navigation** — All 7 chapters have Next/Previous chapter links
- [x] **Prose styling** — All chapters use `prose` / `guide-article` classes

### UI Polish Pass (Done)

- [x] **CTA button fix** — "Start Chapter 1" now uses `variant="primary"` correctly
- [x] **TOC hover states** — Card hover now includes `bg-hover`, `shadow-card-hover`, icon color flip, badge contrast change, focus-visible ring
- [x] **Duplicate "Quick Links"** — Hub bottom section renamed to "Essential Tools" to avoid collision with footer "Quick Links"
- [x] **Internal jargon removed** — "Hub monetization gate (Phase 2 decision)" and similar phrases removed from user-facing content

### Schema / SEO Foundations (Partial — Done)

- [x] **Organization JSON-LD** in `layout.tsx` (global)
- [x] **WebSite JSON-LD** with SearchAction in `layout.tsx` + `page.tsx` (homepage)
- [x] **Organization schema** on `/about` page with ContactPoint, founder, areaServed
- [x] **BreadcrumbList** on `/sku/[sku]`, `/penny-list`, `/store-finder`, `/report-find`
- [x] **ItemList schema** on `/penny-list`
- [x] **FAQPage schema** on `/faq`
- [x] **ads.txt** — Present, 750+ lines, includes Monumetric + Google AdSense DIRECT line
- [x] **Sitemap** — `app/sitemap.ts` exists
- [x] **robots.ts** — Exists

### Homepage Content Depth (Done)

- [x] **"How Penny Hunting Works"** — Expanded from ~80 words to ~350+ words across 4 steps with explanatory paragraphs
- [x] **"Why this site is structured this way"** section added
- [x] **Schema** — WebSite + Organization JSON-LD present

### Penny List SEO (Partial — Done)

- [x] **Methodology section** — 300+ word "How to interpret and use this list" added at page bottom
- [x] **ItemList + BreadcrumbList schema** present
- [x] **SSR content** — Main list data rendered server-side

### Essential Pages (Done)

- [x] **About** — ~653 words, Organization schema, founder info, ContactPoint
- [x] **Contact** — ~238 words (borderline — see gaps)
- [x] **Privacy Policy** — Exists
- [x] **Terms of Service** — Exists

---

## 2. INCOMPLETE / GAPS (Discussed But Never Built)

### P0 — Critical for GAM Approval

| #   | Gap                                        | Impact                                                 | Detail                                                                                                                                                                                            |
| --- | ------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **No JSON-LD on 6 of 7 guide chapters**    | HIGH — Bot sees them as unstructured content           | Only `/faq` has schema. Chapters 1–6 need `Article` schema with `author`, `datePublished`, `dateModified`, `publisher`, `headline`, `description`. This is the single biggest E-E-A-T signal gap. |
| G2  | **No BreadcrumbList on any guide page**    | HIGH — "Site Behavior: Navigation" flag risk           | `/guide` hub and all 7 chapters are missing breadcrumb structured data. Penny-list, store-finder, and report-find have it — guide does not.                                                       |
| G3  | **No `loading.tsx` anywhere**              | MEDIUM — Hydration "blank screen" during SSR/streaming | Google bot may see blank content during React hydration. Every major route group should have a loading.tsx with skeleton content.                                                                 |
| G4  | **No `<AdSlot />` placeholder components** | HIGH — CLS will spike when Monumetric adds in ads      | When ads go live, they'll pop into the layout causing Cumulative Layout Shift. Ad-reserved `<div>` with `min-height` and labeled "Advertisement" is needed now.                                   |

### P1 — High-Value, Discussed but Not Implemented

| #   | Gap                                                    | Impact                                                                                  | Detail                                                                                                                                                        |
| --- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G5  | **No sidebar on desktop**                              | MEDIUM — Dead space on wide screens, missed internal link density                       | Transcript recommends a sticky sidebar (`col-span-4`) with "Popular Posts," "How to Use," etc. Currently every guide chapter is single-column `max-w-[68ch]`. |
| G6  | **No "Related Chapters" grid at chapter bottoms**      | MEDIUM — Dead-end pages, low internal link density                                      | `/sku/[sku]` pages have it. Guide chapters only have Prev/Next navigation. Google wants 2–3 related links per page minimum.                                   |
| G7  | **No Author Bio component**                            | MEDIUM — E-E-A-T: expertise signal missing                                              | Transcript specifically calls for `<Bio />` linking to About page. No implementation exists.                                                                  |
| G8  | **No "Last Updated" visible timestamp on guide pages** | MEDIUM — "Dead/abandoned site" signal                                                   | Hub has a small "Updated February 2026" badge, but individual chapters have no visible date. Google values freshness signals.                                 |
| G9  | **Guide hub word count still thin**                    | LOW-MEDIUM — ~839 words in source, but effective rendered words are lower due to markup | Transcript recommended 600+ for hub. Currently adequate but at the lower boundary — could be flagged if the bot strips UI chrome.                             |

### P2 — Discussed, Lower Priority

| #   | Gap                                                          | Impact                                                    | Detail                                                                                                                            |
| --- | ------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| G10 | **No ItemList schema on guide hub**                          | LOW — Hub is a navigation page, not a list page           | But wrapping chapters as an `ItemList` or `CollectionPage` would tell Google "this is a structured collection, not thin content." |
| G11 | **No `Article` datePublished/dateModified in page metadata** | LOW — Metadata exists in `<head>` but not in JSON-LD      | Redundancy helps; bots sometimes only parse one.                                                                                  |
| G12 | **Command palette had dead hash-link targets**               | DONE — Fixed in last session, pointing to real routes now |

---

## 3. UX / TECHNICAL DEBT — Mobile-First Weaknesses (70% Mobile Audience)

| #   | Issue                                                                                   | Severity                  | Detail                                                                                                                                                                                                                                          |
| --- | --------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | **TOC grid is 3-column on large screens, but the jump to 1-column on mobile is abrupt** | LOW                       | Currently `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. The progression is reasonable, but the 1-column mobile cards are tall and require a lot of scrolling. Consider a compact "accordion" or "list" variant for mobile instead of full cards. |
| M2  | **No sticky "Jump to top" or floating chapter nav on mobile**                           | MEDIUM                    | On a 1,500-word chapter page, mobile users have to scroll back up to find Prev/Next or the chapter list. A sticky bottom bar or floating "back to hub" button would reduce friction.                                                            |
| M3  | **Hub triage section cards don't have enough tap-target differentiation**               | LOW                       | The 4 triage cards (sm:grid-cols-2) look similar to the 7 chapter cards. On mobile they all run together. Consider a visual break (different background shade, or numbered instead of card format).                                             |
| M4  | **Methodology section on /penny-list renders below the fold**                           | MEDIUM (AdSense-relevant) | The 300+ word SEO section is at the page bottom. Google bot crawls top-down; mobile users never see it. Consider a short "About this list" accordion above the data grid (visible, but collapsed).                                              |
| M5  | **No touch-target audit done**                                                          | MEDIUM                    | Transcript mentions 44×44px minimum (Google: 48px). The Prev/Next chapter links, triage cards, and utility links haven't been verified against this threshold on small screens.                                                                 |
| M6  | **Large vertical padding gaps on mobile**                                               | LOW-MEDIUM                | Some sections use `py-12` or `py-7` which on a 375px viewport creates noticeable "empty space" that the GAM bot may flag. Needs a responsive audit (`py-6 sm:py-8 lg:py-12` pattern).                                                           |
| M7  | **No `prefers-reduced-motion` audit for guide hover/transition animations**             | LOW                       | TOC cards have `transition-all duration-200`. Accessibility requirement per your own design system.                                                                                                                                             |

---

## 4. ADSENSE / GAM RISK — "Thin Utility" or "Scraped Content" Flags

| #   | Route                         | Risk Level       | Why It's Risky                                                                                                                                                                                     | Fix                                                                        |
| --- | ----------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| A1  | **`/guide` hub**              | MEDIUM           | ~839 source words but mostly links/navigation — a bot may see this as a "link directory" page, not substantive content                                                                             | Add 100–150 more words of original narrative OR add visible Article schema |
| A2  | **`/what-are-pennies`**       | LOW              | ~986 words — above the 400-word threshold, SSR rendered, has prose styling. Needs schema to lock in quality signal.                                                                                | Add Article JSON-LD                                                        |
| A3  | **`/clearance-lifecycle`**    | LOW              | ~1,548 words — strongest chapter. Just needs schema.                                                                                                                                               | Add Article JSON-LD + Breadcrumb                                           |
| A4  | **`/digital-pre-hunt`**       | LOW              | ~1,266 words — good depth.                                                                                                                                                                         | Add Article JSON-LD + Breadcrumb                                           |
| A5  | **`/in-store-strategy`**      | LOW              | ~1,386 words — good depth.                                                                                                                                                                         | Add Article JSON-LD + Breadcrumb                                           |
| A6  | **`/inside-scoop`**           | LOW-MEDIUM       | ~1,212 words — content is strong but touches on internal HD operations. Make sure nothing reads like "insider leaks" which Google may flag.                                                        | Review tone, add Article JSON-LD                                           |
| A7  | **`/facts-vs-myths`**         | LOW              | ~1,248 words — naturally high-quality debunking content.                                                                                                                                           | Add Article JSON-LD + Breadcrumb                                           |
| A8  | **`/faq`**                    | VERY LOW         | ~2,972 words + FAQPage schema already. Strongest page.                                                                                                                                             | Just add Breadcrumb                                                        |
| A9  | **`/penny-list`**             | MEDIUM           | The interactive data grid is excellent for users but the SSR text (methodology section) is below the fold. If the bot doesn't scroll/render the full page, it sees a table with minimal narrative. | Add above-fold summary (50–80 words) + keep bottom methodology             |
| A10 | **`/contact`**                | MEDIUM           | Only ~238 words. Google specifically checks Contact pages.                                                                                                                                         | Expand to 300+ words minimum, add contact form or clearer structure        |
| A11 | **`/sku/[sku]` pages (800+)** | LOW              | Already `noindex, follow` — correctly handled. Won't count against quality score.                                                                                                                  | No action needed                                                           |
| A12 | **All guide chapters**        | HIGH (aggregate) | Zero chapters have Article schema. To Google, these are "untyped web pages" instead of "authored articles by an expert." This is the #1 aggregate risk.                                            | Batch-add Article JSON-LD to all 7                                         |

---

## 5. PRIORITIZED ROADMAP

### Phase 1 — GAM Approval Hardening (Do First)

_Estimated effort: 2–3 sessions_

1. **Add Article JSON-LD to all 7 guide chapters** (G1)
   - `@type: Article`, `headline`, `author`, `datePublished`, `dateModified`, `publisher` with Organization reference
   - Template once, replicate across 7 files

2. **Add BreadcrumbList schema to `/guide` hub + all 7 chapters** (G2)
   - Pattern: `Home > Guide > [Chapter Title]`
   - Already proven on `/penny-list`, `/store-finder` — replicate pattern

3. **Add visible "Last Updated" date to each chapter** (G8)
   - Small badge like the hub has — `<time datetime="...">Updated February 2026</time>`

4. **Expand `/contact` page to 300+ words** (A10)
   - Add FAQ, response time expectations, links to community

5. **Add above-fold summary paragraph on `/penny-list`** (A9, M4)
   - 50–80 words before the data grid, explaining what the list is
   - Keep the existing methodology section at the bottom

### Phase 2 — CLS Prevention & Ad Readiness

_Estimated effort: 1–2 sessions_

6. **Create `<AdSlot />` placeholder component** (G4)
   - `min-height: 250px`, labeled "Advertisement", distinct background
   - Place in guide chapters (between sections) and penny-list page
   - Prevents CLS when Monumetric injects ads

7. **Add `loading.tsx` to major route groups** (G3)
   - `/guide/`, `/penny-list/`, `/sku/[sku]/`, `/report-find/`
   - Simple skeleton with text blocks so the bot never sees a blank page

8. **Responsive padding audit** (M6)
   - Convert fixed `py-12`/`py-7` to `py-6 sm:py-8 lg:py-12` pattern
   - Ensure no section creates >20vh of empty space on mobile

### Phase 3 — Content Authority & Internal Link Density

_Estimated effort: 2 sessions_

9. **Add Author Bio component** (G7)
   - Links to `/about` page
   - Include on all guide chapters
   - Reinforces E-E-A-T "Expertise" signal

10. **Add "Related Chapters" grid at bottom of each chapter** (G6)
    - 2–3 related chapter cards below the Next/Prev navigation
    - Increases internal link density and eliminates dead-end feeling

11. **Desktop sidebar for guide chapters** (G5)
    - Sticky sidebar on `lg:` breakpoint with TOC, "Quick Links," and "Report a Find" CTA
    - Fills dead space, adds structural depth for the crawler

### Phase 4 — Mobile UX Polish

_Estimated effort: 1 session_

12. **Add floating "Back to Guide" button on mobile** (M2)
    - Sticky bottom bar with hub link + next chapter link
    - Only visible on mobile after scrolling past first section

13. **Touch-target audit** (M5)
    - Verify all interactive elements are ≥44×44px on mobile
    - Fix any that fail

14. **`prefers-reduced-motion` audit** (M7)
    - Ensure `transition-all` respects user preference

---

## 6. QUICK WINS (Can Do Right Now, <30 min each)

| Win                               | Files                          | Impact                                 |
| --------------------------------- | ------------------------------ | -------------------------------------- |
| Add Article JSON-LD template      | All 7 chapter `page.tsx` files | HIGH — biggest E-E-A-T signal          |
| Add BreadcrumbList to guide pages | All 8 guide `page.tsx` files   | HIGH — fixes navigation signal         |
| Add `<time>` badge to chapters    | All 7 chapter templates        | MEDIUM — freshness signal              |
| Expand `/contact`                 | `app/contact/page.tsx`         | MEDIUM — passes essential page check   |
| Above-fold penny-list summary     | `app/penny-list/page.tsx`      | MEDIUM — fixes thin-content perception |

---

## Key Insight

The guide content is strong (7,000+ words across 7 chapters, all SSR-rendered, all original). **The gap isn't content quality — it's schema markup and structural signals.** Google's bot doesn't "read" your guide like a human does. It needs JSON-LD to know these are authored articles, breadcrumbs to know they're organized, and timestamps to know they're maintained. Phase 1 alone addresses the highest-probability GAM rejection reasons without requiring any new content writing.
