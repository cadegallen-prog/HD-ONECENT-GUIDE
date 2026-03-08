# Sidebar Evaluation for PennyCentral

> **Status:** READ-ONLY analysis. No code changes.
> **Date:** 2026-03-06
> **Purpose:** Determine whether PennyCentral should add a sidebar for desktop ad placements.

---

## Section 1: Current Layout

### Single-Column Architecture

PennyCentral uses a single-column, centered layout on all viewports. The architecture is defined in `components/page-templates.tsx`, which exports a `PageShell` component as the primary page wrapper.

**PageShell max-width constraints** (line 38-42):

- `narrow`: `max-w-4xl` (896px)
- `default`: `max-w-5xl` (1024px)
- `wide`: `max-w-6xl` (1152px)

Content is horizontally centered with `mx-auto` and padded with `px-4 sm:px-6` (line 62). There is no `<aside>` element, no grid layout, and no two-column pattern anywhere in the codebase. A grep for `aside`, `sidebar`, and `two-col` across all `.tsx`, `.ts`, and `.css` files returned zero layout-related matches -- only ad slot naming references in documentation files.

**Source:** `components/page-templates.tsx:38-66`, confirmed by `PLAN_AUDIT_AND_CORRECTED_PLAN.md` claim B5: "No sidebar DOM structure exists -- TRUE."

### Root Layout Structure

The root layout (`app/layout.tsx:318`) renders:

```
<main id="main-content" className="min-h-screen">
  {children}
  <Footer />
</main>
```

No guide-specific layout exists -- `app/guide/layout.tsx` does not exist. All pages flow through the root layout, which is a simple Navbar -> main -> Footer stack.

**Source:** `app/layout.tsx:295-334`, glob for `app/guide/**/layout.tsx` returned no results.

### Where Gutters/Whitespace Exist on Desktop

On a typical 1920px desktop monitor:

- With `max-w-5xl` (1024px default), there is approximately **448px of whitespace on each side** of the content column.
- With `max-w-6xl` (1152px wide), there is approximately **384px on each side**.
- With `max-w-4xl` (896px narrow), there is approximately **512px on each side**.

These gutters are empty -- no content, no ads, no structural elements. The only thing currently utilizing these gutters is Monumetric's pillar ad (see Section 2).

**Source:** Calculated from `page-templates.tsx:38-42` max-width values against standard desktop viewports.

### CSS: No Existing Sidebar or Aside Styles

A search of `app/globals.css` (1100+ lines) for `aside`, `sidebar`, or `two-col` returned zero matches. There are no pre-built sidebar styles, grid layouts for sidebars, or aside-specific CSS rules.

**Source:** Grep of `app/globals.css` for sidebar/aside patterns.

---

## Section 2: Pillar Ads (No Layout Change Needed)

### How Pillar Ads Work

Monumetric's "pillar" ad type injects content **after the `<body>` element** and uses `position: fixed` or `position: absolute` to float in the viewport gutters -- the whitespace flanking the content column. This does NOT require any sidebar DOM element.

> "Some ad networks place a position: fixed or position: absolute ad that floats on the left side of the screen regardless of your layout. This is sometimes called a Rail Ad or Skin Ad."
> -- Deep research report (1), "Mobile-first best practices" section

> "Monumetric's pillar ad (which IS active on desktop) inserts 'AFTER body' -- it floats in viewport gutters without any sidebar element."
> -- `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Critical Finding #4 (line 97)

### Current Pillar Ad Status

The March 4, 2026 email from Monumetric's implementation team confirms:

- **Left Pillar: ACTIVE on Desktop**, inserting AFTER body.
- Slot UUID: `785d6c5a-f971-4fa0-887e-fe0db38eadfd`

This is one of the ad types that IS currently serving. No code changes were needed to enable it -- Monumetric handles injection entirely on their side.

**Source:** `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, claim A3 (line 22): "Left Pillar ACTIVE on Desktop, inserting AFTER body -- TRUE."

### What to Ask Monumetric to Enable/Verify

1. **Verify pillar is actually rendering.** The pillar is listed as "ACTIVE" in their March 4 config, but no visual verification has been done via Playwright or browser inspection to confirm it renders in the gutters.
2. **Ask about Right Pillar.** Only "Left Pillar" is mentioned. A right pillar could double gutter ad inventory without any code changes.
3. **Confirm pillar is not conflicting with content.** On narrower desktop viewports (1024-1280px), the content column plus gutters may be too narrow for pillar ads. Ask if Monumetric has a minimum viewport width threshold for pillar display.

**Source:** `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Part 5 "Ask Monumetric" Packet; `pennycentral.com_config.txt` slot inventory (line 389-394).

---

## Section 3: True Sidebar (Layout Change Required)

### What It Would Require Architecturally

Adding a true sidebar would require changes to several foundational files:

1. **`components/page-templates.tsx`** -- The `PageShell` component would need a new layout mode (e.g., `layout?: "single" | "sidebar"`) that wraps content in a CSS Grid or Flexbox two-column structure at the `lg:` breakpoint.

2. **New component: `GuideChapterLayout` or `SidebarShell`** -- A wrapper that provides the sidebar column with content (TOC, ads, related links).

3. **`app/globals.css`** -- New responsive grid/flex rules for the two-column layout, including:
   - Sidebar width (typically 300px for standard ad sizes like 300x250)
   - Sticky behavior for the sidebar (`position: sticky; top: ...`)
   - Collapse rules below `lg:` breakpoint

4. **Individual page files** -- Any page using the sidebar layout would need to pass sidebar content or opt into the new layout mode.

**Estimated scope:** 5-8 files modified, new component(s) created. This touches `PageShell`, which is used by every page on the site.

**Source:** `components/page-templates.tsx` (current single-column architecture), `P3-P8-comprehensive-summary.md` P8 section (line 147-174).

### Impact on Existing Pages

- **All pages use PageShell.** Changing its layout structure is a site-wide change. Even if new layout is opt-in (e.g., `layout="sidebar"` prop), the component's CSS must not break the existing single-column default.
- **Guide chapters** are the most natural fit for a sidebar (TOC, reading progress), but they would need individual updates to pass sidebar content.
- **Homepage, penny-list, FAQ** have no natural sidebar content. Adding a sidebar just for ads on these pages would look empty or forced.
- **SKU pages** (hundreds of product detail pages) could theoretically use a sidebar for related products, but this is a significant design decision.

**Source:** `components/page-templates.tsx:60-66` (PageShell renders all pages), `P3-P8-comprehensive-summary.md` Option B analysis (line 158).

### Impact on Mobile (Must Collapse)

- **85-90% of PennyCentral's traffic is mobile** (penny shoppers using phones in-store).
- A sidebar MUST collapse completely on mobile. This means the sidebar is invisible to the vast majority of users.
- Any engineering effort on a sidebar benefits only the ~10-15% of desktop users.
- Mobile users should see zero layout changes -- the sidebar must be hidden below `lg:` breakpoint.

**Source:** Deep research report (2), line 125: "Given your traffic is 85-90% mobile..." `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, line 194: "80-90% of traffic is mobile. Every decision should prioritize mobile UX."

### Design System Implications

- The design system (`docs/DESIGN-SYSTEM-AAA.md`, `app/globals.css`) has no sidebar tokens, grid definitions, or two-column patterns.
- New CSS custom properties would be needed (e.g., `--sidebar-width`, `--sidebar-bg`).
- Must use CSS variable tokens only -- no raw Tailwind color utilities per project rules.
- The `guide-article` class (used by `Prose variant="guide"`) sets `w-full mx-auto` -- this would need adjustment to work within a two-column grid context.

**Source:** `components/page-templates.tsx:217` (Prose guide variant), `CLAUDE.md` styling rules.

---

## Section 4: Recommendation

### Pillar-First Approach (Recommended)

**Do not build a sidebar for ad purposes.** The evidence overwhelmingly supports a pillar-first approach:

1. **Pillar ads already work without any code changes.** The Left Pillar is ACTIVE on desktop per the March 4 email. Monumetric handles injection entirely on their side.

2. **Sidebar slots being disabled is a Monumetric config decision, not a layout problem.** The three sidebar slot UUIDs exist (`5f725bea-...`, `c243b456-...`, `b3dc56d1-...`) but Monumetric chose "Not being inserted" for all three. Building an `<aside>` element will not cause Monumetric to enable these slots.

   > "The sidebar slots being 'Not being inserted' is a Monumetric-side configuration decision, not a DOM structure problem."
   > -- `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Critical Finding #4 (line 98)

3. **The audience is mobile-heavy.** A sidebar is invisible to 85-90% of users. Engineering effort should focus on mobile ad optimization (in-content placement, mobile sticky anchor) rather than desktop-only layout changes.

4. **The site is young and content-light.** With 7 guide chapters and a handful of core pages, there is insufficient content to justify a sidebar. A TOC sidebar might be worth it as a UX improvement later, but not for ad revenue.

### What Goes in the Monumetric Email

Include this in the next Monumetric communication (already drafted as question M5 in `PLAN_AUDIT_AND_CORRECTED_PLAN.md`):

> "Our site uses a single-column layout. We see that the Left Pillar is active and inserting AFTER body. The three sidebar slots (Top/Middle/Sticky) are listed as 'Not being inserted.' Is this because our layout lacks a sidebar element, or is it a configuration choice on your end? Would adding an `<aside>` element change anything, or are pillar ads the correct format for our single-column design?"

Additionally ask:

- Whether a Right Pillar can be enabled alongside the Left Pillar.
- What minimum viewport width is required for pillar ads to display.

**Source:** `PLAN_AUDIT_AND_CORRECTED_PLAN.md`, Part 5, question M5 (line 171).

### Whether Sidebar Is Worth the Engineering Effort

**Not for ads. Possibly for UX, but not now.**

| Factor                  | Assessment                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Ad revenue impact       | None. Sidebar DOM does not enable sidebar ads. Pillar ads work without it.                                         |
| UX value for desktop    | Moderate for guide chapters (TOC). Low for other pages.                                                            |
| Engineering cost        | Medium-high (5-8 files, touches PageShell which every page uses).                                                  |
| Risk                    | Medium (PageShell is foundational; changes can break all pages).                                                   |
| Audience benefit        | Only 10-15% of users (desktop).                                                                                    |
| Priority vs. other work | Low. Mobile ad optimization, responsive foundations, and UX redesign are all higher priority per `.ai/BACKLOG.md`. |

**Verdict:** Defer sidebar work. If Cade later wants a guide chapter TOC as a UX feature (Option C from P3-P8 summary), it can be scoped independently of ad strategy. For ad revenue, focus the Monumetric email on confirming pillar status, requesting Right Pillar, and getting additional slot UUIDs for in-content placement distribution.

**Sources:** `P3-P8-comprehensive-summary.md` P8 section (line 147-174), `PLAN_AUDIT_AND_CORRECTED_PLAN.md` Critical Finding #4 (line 91-101), deep research report (1) control mapping table (line 176-188), deep research report (2) line 112-113.
