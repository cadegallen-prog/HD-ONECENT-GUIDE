# Penny List Card Redesign - Master Plan

> **Status:** Planning
> **Created:** 2026-01-04
> **Last Updated:** 2026-01-04
> **Owner:** Cade + Claude

---

## Why This Document Exists

After 30-40 hours of incremental 1-2% changes that failed to produce meaningful improvement, we're taking a different approach: **plan comprehensively before executing anything**.

This document captures:
- The problem we're solving
- The North Star we're designing toward
- Every design decision and its rationale
- Implementation batches with specific code changes
- Success criteria

**Nothing gets built until this plan is solid.**

---

## CRITICAL: Read The North Star First

> **Before making ANY design decisions, read `.ai/CONTEXT.md` section "The North Star (Read This First)".**
>
> Key points that MUST guide all decisions:
> 1. **Report counts and state distribution are CORE VALUE, not clutter**
> 2. **The flywheel depends on contributions** - Report Find must be prominent
> 3. **We serve 4 user phases:** Research, Hunt, Discover, Contribute - all must be served
> 4. **We complement Facebook, not compete** - we show what FB structurally cannot

If any design decision conflicts with these principles, stop and reconsider.

---

## Problem Statement

The penny list cards are cluttered and visually flat despite containing valuable information. 30-40 hours of incremental 1-2% changes have failed because they addressed symptoms, not root causes. The design needs a cohesive overhaul that:

1. Preserves the **core value proposition** (aggregated community intel: report counts, state distribution, recency)
2. Improves **visual hierarchy** so users can scan quickly
3. Expands the **color system** for better differentiation
4. Removes **redundancy** without hiding important data
5. Keeps **contribution friction low** (Report Find button prominent)

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Barcode modal content | Shows retail price (strikethrough) → $0.01 | Dopamine hit - "wow it's $40 but now a penny" |
| Saved indicator | Filled heart on cards in user's list | Easy to see what's already in hunt list |
| Mobile action buttons | Icons only (no text labels) | 90% of traffic is mobile, save vertical space |
| Card expand trigger | Chevron at bottom | Cards already navigate on click - can't conflict |
| Trust bar icons | Lucide icons | Already using Lucide throughout, consistent |
| State pills limit | User's state first + top 2 others | "My State" already in localStorage, relevance wins |
| Saved items sort | Same as main list (for now) | Keep scope tight, can add later |
| Expand animation | Slide down in-place | 4-5 lines of info doesn't need modal/sheet |

---

## Implementation Batches

### Batch 1: Information Architecture & Card Restructure

**Goal:** Remove redundancy, establish clear visual zones

**Remove:**
| Element | Reason |
|---------|--------|
| "PENNY PRICE" label | Everyone knows it's $0.01 |
| "Save $X.XX (100% off)" calculation | Redundant - savings is obvious |
| Duplicate price displays | Shown in multiple places |

**New Card Structure:**
```
┌─────────────────────────────────────────────────────┐
│ HEADER: Freshness indicator + Status (if any)      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [IMAGE]    PRODUCT NAME (prominent)               │
│  (100px)    Brand (subtle)                         │
│             SKU: 123456 [copy]                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ TRUST BAR: "12 reports · 5 states" | [state pills] │
├─────────────────────────────────────────────────────┤
│ ACTIONS: [Report Find] [Save] [HD Link] [Barcode] [▼] │
└─────────────────────────────────────────────────────┘
│ EXPANDABLE: Retail price, model, UPC, full states  │
└─────────────────────────────────────────────────────┘
```

**Files:** `components/penny-list-card.tsx`

---

### Batch 2: Color System Expansion

**Goal:** Add blue/slate for informational elements, keep green for actions/money only

**CSS Variables to Add (globals.css after line 91):**
```css
/* INFORMATIONAL COLORS - for trust signals */
--info-primary: #3b82f6;      /* Blue - report counts, links */
--info-secondary: #64748b;    /* Slate - secondary info, state pills */
--info-bg: #eff6ff;           /* Light blue - info backgrounds */
--bg-trust-bar: #f0f9ff;      /* Trust bar background */

/* Dark mode */
--info-primary: #60a5fa;
--info-secondary: #94a3b8;
--info-bg: #1e3a5f;
--bg-trust-bar: #0c2340;
```

**Color Assignment:**
| Element | Color | Reason |
|---------|-------|--------|
| Report Find button | Green (--cta-primary) | Primary action, flywheel |
| Save button (filled) | Green | Active state |
| Report count | Blue (--info-primary) | Trust signal |
| State pills | Slate bg (--info-secondary) | Geographic info |
| Date/freshness | Slate text | Temporal info |
| HD Link | Blue | External link |
| Price ($0.01) | Green | Money = green |

**Files:** `app/globals.css`, `tailwind.config.ts`, `components/penny-list-card.tsx`

---

### Batch 3: Trust Bar Design

**Goal:** Dedicated, visually distinct zone for community signals

**Design:**
```
┌─────────────────────────────────────────────────────┐
│ 👥 12 reports  ·  📍 5 states  ·  [TX] [CA] [FL] +2 │
└─────────────────────────────────────────────────────┘
```

- Light blue/slate background tint
- Lucide icons: `Users` for reports, `MapPin` for states
- State pills: User's state first (if in list), then top 2 by count, then "+N more"
- Consistent placement across all cards

**Icons to Import:**
```tsx
import { ChevronDown, Users, MapPin } from "lucide-react"
```

**Files:** `components/penny-list-card.tsx`

---

### Batch 4: Action Bar Design

**Goal:** Consistent actions, mobile-optimized, prominent Report Find

**Layout:**
```
Mobile:  [🔔] [❤️] [🏠] [📱] [▼]
Desktop: [🔔 Report] [❤️ Save] [🏠 HD] [📱 Scan] [▼ More]
```

**Button Hierarchy:**
1. **Report Find** - Primary green button (most important for flywheel)
2. **Save/List** - Heart icon, filled when saved
3. **HD Link** - Icon button, text on desktop only
4. **Barcode** - Icon button, opens modal
5. **Expand** - Chevron, rotates 180° when expanded

**Barcode Modal Enhancement:**
Add to BarcodeModalProps:
```tsx
productName: string        // Show product name for confirmation
retailPrice: number | null // Show ~~$42.97~~ → $0.01 for dopamine hit
```

**Files:** `components/penny-list-card.tsx`, `components/barcode-modal.tsx`

---

### Batch 5: Save/List Feature Polish

**Goal:** Ensure save feature is prominent and usable

**Requirements:**
- Visible in action bar as heart icon
- Filled heart when item is saved (visible while browsing full list)
- Clear feedback animation on tap
- Easy access to saved list (My Lists in nav or filter)

**Note:** AddToListButton is already well-implemented with:
- Bookmark/BookmarkCheck icon toggle
- Saved state with green highlight
- List picker dropdown for multiple lists
- Smart add (auto-handles 0 or 1 list)
- Toast confirmation with "View list" action

**Files:** `components/penny-list-card.tsx`, saved list view components

---

## Code-Level Implementation Details

### Lines to REMOVE in penny-list-card.tsx (Batch 1)
- Lines 213-218: "PENNY PRICE" label and $0.01 display
- Lines 226-230: "Save {formattedSavings} ({savingsPercent}% off)"

### Current State Pills Logic (lines 79-83)
```tsx
// Current
const topLocations = locationEntries.slice(0, 4)

// Change to: Prioritize user's state
const myState = localStorage.getItem("penny-list-state")
// If myState in locations, show first, then top 2 others
```

### Trust Bar Pattern
```tsx
<div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-[var(--bg-trust-bar)] text-sm">
  <Users className="w-4 h-4 text-[var(--info-secondary)]" />
  <span className="text-[var(--info-primary)] font-medium">{totalReports} reports</span>
  <span className="text-[var(--text-muted)]">·</span>
  <MapPin className="w-4 h-4 text-[var(--info-secondary)]" />
  <span className="text-[var(--info-primary)] font-medium">{stateCount} states</span>
  <div className="flex gap-1 ml-1">
    {displayedStates.map(state => (
      <span key={state} className="pill-sm">{state}</span>
    ))}
    {remainingStates > 0 && <span className="text-xs text-[var(--text-muted)]">+{remainingStates}</span>}
  </div>
</div>
```

### Action Bar Pattern (Mobile)
```tsx
<div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-default)]">
  <Button variant="primary" size="sm" className="flex-1">
    <PlusCircle className="w-4 h-4" />
    <span className="sr-only sm:not-sr-only sm:ml-1.5">Report</span>
  </Button>
  <AddToListButton sku={item.sku} itemName={item.name} variant="icon" />
  <a href={homeDepotUrl} className="icon-button">
    <ExternalLink className="w-4 h-4" />
    <span className="sr-only">Home Depot</span>
  </a>
  <button onClick={() => setIsBarcodeOpen(true)} className="icon-button">
    <Barcode className="w-4 h-4" />
    <span className="sr-only">Scan</span>
  </button>
  <button onClick={() => setExpanded(!expanded)} className="icon-button">
    <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
    <span className="sr-only">{expanded ? 'Less' : 'More'}</span>
  </button>
</div>
```

### Expandable Section Pattern
```tsx
<div
  className={`overflow-hidden transition-all duration-200 ease-out ${
    expanded ? 'max-h-48 opacity-100 pt-3' : 'max-h-0 opacity-0'
  }`}
>
  {/* Retail price strikethrough, model, UPC, full state breakdown */}
</div>
```

---

## Success Criteria

After implementation, the penny list should:

1. **Pass the 5-second test:** User in-store can identify if an item is on the list within 5 seconds
2. **Show community value:** Report counts and state distribution are immediately visible
3. **Encourage contribution:** Report Find button is prominent and inviting
4. **Support personal lists:** Save feature is easy to use, saved items easy to access
5. **Look cohesive:** Cards have clear visual zones, consistent color usage, no redundancy
6. **Provide barcode access:** 1-2 clicks to scannable barcode with dopamine-hit pricing

---

## Implementation Order

1. **Batch 1** - Information architecture (remove redundancy, establish zones)
2. **Batch 2** - Color system (add blue/slate, assign purposes)
3. **Batch 3** - Trust bar (dedicated zone for community signals)
4. **Batch 4** - Action bar (consistent button placement, barcode enhancement)
5. **Batch 5** - Save/List polish (ensure prominent, easy to use)

Each batch builds on the previous. Complete one before starting the next.

---

## What This Plan Does NOT Include

- Major layout changes (grid columns, card dimensions) - defer to after content is right
- Filtering/sorting changes - current system works
- Data structure changes - not needed
- New features beyond what exists - focus on polish

---

## Files to Modify

| File | Batch | Changes |
|------|-------|---------|
| `app/globals.css` | 2 | Add info color tokens |
| `tailwind.config.ts` | 2 | Expose new CSS variables |
| `components/penny-list-card.tsx` | 1-5 | Full restructure |
| `components/penny-list-card.tsx` (Compact) | 1-5 | Align with new design |
| `components/barcode-modal.tsx` | 4 | Add product name + price comparison |
