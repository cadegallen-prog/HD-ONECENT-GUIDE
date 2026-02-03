# UI_DESIGN

## CURRENT STATUS

- ✅ Penny List card redesign frozen (Jan 5, 2026)
- ✅ Color system converged: Light mode forest green (#15803d) + Dark mode emerald green (#43A047)
- ✅ Mobile action bar deployed (filters + sort bottom sheets)
- ✅ Responsive image sizing (list 64px, detail 600px, related 400px)
- ✅ Card density optimized (tight padding, identifiers always visible, max 4 state pills)
- ✅ All WCAG AAA contrast ratios verified
- **Status:** No new card changes expected until retention metrics improve

---

## LOCKED DECISIONS

- **Card layout:** Brand subordinate to image, SKU chip visible, "$0.01" hero price retained, recency (calendar) top-right
- **State indicators:** Max 4 muted pills + single "X reports total" line (no redundant counts)
- **Actions:** Save (icon-only, secondary), Report/Share/HD links (bottom bar on mobile)
- **Colors:** Use CSS variables only (no raw Tailwind hex)
  - Primary CTA: `var(--color-brand-primary)` (green)
  - Savings text: `var(--color-success)` (green)
  - Trust row: muted text only (no colored chips)
- **Responsive:** Mobile first, breakpoints at 640px (md), 1024px (lg)
- **Typography:** Inline info-style trust row (smaller, condensed)
- **Image fallback:** `-64_400` for list, `-64_600` for detail, falls back to `-64_1000` if both fail
- **No wireframes:** All specs in `.ai/PENNY-LIST-REDESIGN.md` (locked, reference only)

---

## OPEN QUESTIONS

None (design is frozen pending retention improvements).

---

## NEXT ACTIONS

1. **Monitor mobile CTR on cards**
   - Weekly check: Compare Penny List CTR vs. Detail page CTR
   - Goal: Card density doesn't hurt conversion

2. **Collect user feedback**
   - If >5% report confusion about state pills, revisit design
   - If >10% report card layout preference for table, evaluate hybrid

3. **Consider future: Card view → Table toggle**
   - Design for future (no implementation yet)
   - Wireframe: table with same columns (SKU, State, Last Seen, Actions)
   - Defer until retention analysis complete

4. **Accessibility audit (annual)**
   - Rerun Lighthouse + Axe + manual keyboard nav
   - Focus on card interaction order and screen reader labels

---

## POINTERS

- **Frozen spec:** `.ai/PENNY-LIST-REDESIGN.md` (18 KB, full layout/typography/fallback spec)
- **Old vision (archived):** `archive/docs-pruned/2026-02-03-pass3/.ai/PENNY_CARD_DESIGN_VISION.md` (pre-redesign context)
- **Color system:** `.ai/CONSTRAINTS.md` (CSS variable names + ratios)
- **Component code:** `components/penny-list-client.tsx` (card rendering)
- **Related pages:** `/guide` (visual label recognition section added Jan 9)
- **No implementation plan yet** (design is stable, no pending changes)

---

## Archive References

- `archive/docs-pruned/2026-02-03-pass3/.ai/PENNY_CARD_DESIGN_VISION.md` - Old vision doc (kept for historical reference, not active)
