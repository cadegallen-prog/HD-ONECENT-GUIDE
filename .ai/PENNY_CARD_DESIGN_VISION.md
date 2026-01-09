# Penny Card Design Vision

**Status:** Active design direction for penny-list-card redesign
**Audience:** All AI agents (Claude Code, Copilot Chat, Codex, etc.)
**Date:** 2026-01-09

---

## Core Philosophy

**The card serves a multi-phase user journey:**

1. **Research Phase:** Image + item name answer "what is this?"
2. **Valuation Phase:** Penny price + retail + savings show "is this worth it?"
3. **Verification Phase:** SKU + metadata build confidence in the find
4. **Action Phase:** Report/save/barcode enable the user to act

Everything must support this flow on mobile devices in <5 seconds.

---

## Information Hierarchy (Priority Order)

### Tier 1: Visual Recognition (Image)
- **Most important element**
- 72×72px (full display, no padding/shading)
- Tells 80% of the story immediately
- User makes "do I care?" decision here

### Tier 2: Confirmation (Item Name + Brand)
- **Brand:** Small, muted (secondary context)
- **Item Name:** 1–2 lines, truncated (confirms image)
- Together these validate: "Yes, this is what I thought it was"

### Tier 3: Motivation (Price Block)
- **Penny Price + Retail:** Side by side showing the delta
- **Savings Amount:** Bold, prominent (dopamine trigger)
- Example: `$0.01 → ~~$135.38~~ | Save $135.37`
- ~~Removed~~ Big "$0.01" label and "Penny" label — implicit from context

### Tier 4: Confidence (Metadata)
- **SKU:** More prominent than currently (not muted)
- **Last Seen:** Recency signal
- **Locations + Reports:** Validity signal ("seen in 3 states, 5 reports")

### Tier 5: Action (Buttons)
- **Primary:** Report Find (full-width, high contrast)
- **Secondary:** View on Home Depot (outlined, with external-link icon)
- **Tertiary:** Barcode (chip, only if data exists)
- **Always Available:** Favorite heart (top-right corner, outline/filled toggle)

---

## Design Principles

### 1. Nothing Overshadows the Image
- Image is the primary storyteller
- All other elements are supporting cast
- Price should reinforce the image, not dominate it

### 2. Mobile-First Spacing
- Tight enough to be scannable (5 seconds max)
- Loose enough to avoid cognitive overload
- Clear visual groupings between sections

### 3. Containers & Visual Grouping
- **Decide per section:** Does it need a container (background/border)?
  - Price block: Yes (high importance, visual isolation)
  - SKU: Possibly (elevation to match importance tier)
  - Metadata: Probably not (supporting info, can be inline)
- Containers should create rhythm, not clutter

### 4. Color & Contrast Strategy
- **Image:** Clean border, no inner shadow
- **Item Name:** Primary text color, bold weight for scanability
- **Brand:** Muted, smaller, secondary color
- **SKU:** More prominent than current (increase weight or color saturation)
- **Prices:**
  - Penny price: Standard weight
  - Retail price: Strikethrough (clear visual cue)
  - Savings: Bold, color-coded (success green or emphasis color)
- **Metadata:** Muted text, smaller font (supporting info)
- **Actions:** Standard button contrast per design system

### 5. Font Sizing & Weight Hierarchy
- Use weight + size to control visual priority
- Ensure mobile readability (minimum 12px, usually 14px+)
- Clear distinction between sections

### 6. Hover & Interactivity States
- Card itself: subtle lift or shadow change
- Buttons: clear hover states per design system
- Heart icon: filled/outline toggle with immediate feedback
- Ensure all tap targets ≥ 44×44px for mobile

---

## Visual User Journey (What They See in Order)

1. **Glance at image** → "Is this a product I care about?"
   - If no → scroll past
   - If yes → continue to name

2. **Read item name + brand** → "Is this exactly what I think it is?"
   - If no → scroll past
   - If yes → continue to prices

3. **See penny price + retail + savings** → "Is this deal good?"
   - Example: `$0.01 ~~$135.38~~ Save $135.37`
   - If no deal → scroll or tap "View on Home Depot"
   - If good deal → continue to verify

4. **Check SKU** → "Can I find/buy this?"
   - Reference for in-store lookup
   - Can tap barcode to verify UPC

5. **Review metadata** → "Is this a reliable find?"
   - Last seen: 1 day ago ✓
   - Seen in 3 states · 5 reports ✓
   - Builds confidence

6. **Take action** → Choose path:
   - **Option A:** Tap "Report Find" (primary — I found this!)
   - **Option B:** Tap "View on Home Depot" (want more info first)
   - **Option C:** Tap heart to save (personal in-store list)
   - **Option D:** Tap "Barcode" (verify UPC in store)

---

## What NOT to Do

- ❌ Don't make big "$0.01" price overshadow other elements
- ❌ Don't use "Penny" label (it's redundant context)
- ❌ Don't mute the SKU too much (it's Tier 4, not Tier 5)
- ❌ Don't add containers everywhere (creates visual chaos)
- ❌ Don't ignore mobile layout (this must work on 375px width)
- ❌ Don't make Report button compete with heart or other elements
- ❌ Don't truncate item names at arbitrary spots (respect word boundaries)
- ❌ Don't require horizontal scrolling for any content

---

## Card Data Structure

```
┌─────────────────────────────────┐
│ [Image] [Brand]           [♡]   │  ← Tier 1 + favorite
│ [72px]  [Item Name]             │
│         [1-2 lines, truncated]   │
│         [SKU]                    │
├─────────────────────────────────┤
│ $0.01 ~~$135.38~~ | Save $135.37│  ← Tier 3 (price block)
├─────────────────────────────────┤
│ Last seen: 1 day ago            │  ← Tier 4 (metadata)
│ Seen in 3 states · 5 reports    │
├─────────────────────────────────┤
│ [Report Find (Full Width)]       │  ← Tier 5 (primary action)
│ [View on HD] [Barcode]          │  ← Secondary + Tertiary
└─────────────────────────────────┘
```

---

## Next Steps (For Planning Session)

When moving to card redesign planning, address:

1. **Price Container Design**
   - Should it have a background/border?
   - How to emphasize "Save $135.37" without overwhelming?
   - Font sizes for penny price vs retail vs savings?

2. **SKU Prominence**
   - Current: too muted
   - Should it have a container/background?
   - Font weight increase? Color emphasis?

3. **Metadata Layout**
   - "Last seen" + "Seen in X states · Y reports" — how to group?
   - Should they be separate lines or combined?
   - Font size and color treatment?

4. **Mobile Responsive**
   - Card width: 100% of container (typically 335px on mobile)
   - How do buttons stack on very small screens?
   - Barcode visibility (only if data exists — how to handle)?

5. **Heart Icon Interaction**
   - Top-right positioning exact placement?
   - Outline vs filled states
   - Toast/tooltip feedback: "Added to Favorites" or "Removed from Favorites"?

6. **Hover & Interactive States**
   - Card-level hover effect (subtle lift?)?
   - Button hover states per design system?
   - Heart hover animation?

---

## Constraints & Guardrails

- **Report button must dominate** (primary action)
- **Image must never be smaller than text** (maintain hierarchy)
- **All text must be readable at 12px minimum** (accessibility)
- **Card must render in <5 seconds on mobile** (performance)
- **Colors must comply with design system** (use CSS variables only, no raw Tailwind)
- **Maintain mobile-first approach** (design for 375px first, scale up)

---

## Questions for Clarification (When Planning)

If ambiguity arises during planning, refer back to the hierarchy:
- "Does this element help the user reach their action faster?"
- "Does this compete with image prominence?"
- "Is this mobile-readable and tap-able?"
- "Does this fit the information hierarchy?"
