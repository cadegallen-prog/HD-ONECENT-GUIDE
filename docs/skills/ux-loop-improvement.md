# ux-loop-improvement

## When to use

Use this when Cade asks to improve user flow quality across the core PennyCentral loop: `Penny List -> SKU page -> Report a Find -> return visit`.

## Goal

Increase returning-visitor habit and high-quality submissions without adding feature bloat.

## Fast workflow (core-loop first)

1. Map the exact user path on mobile first, then desktop.
2. Find friction points in this order:
   - Navigation confusion
   - CTA clarity
   - Form friction
   - Trust/confidence messaging
3. Propose no more than 3 scoped changes tied to one of these outcomes:
   - Faster list scanning
   - Higher report completion quality
   - Clearer "what to do next"
4. Reject changes that do not improve the core loop.

## PennyCentral quality checks

- Prioritize `/penny-list`, `/sku/[sku]`, `/report-find`, `/guide`.
- Keep touch targets >= 44x44px.
- Keep mobile-first behavior as source of truth.
- Keep copy action-based and concrete (avoid vague language).
- Preserve trust wording (no hype, no guarantee language).

## Verification lane

- Always run: `npm run verify:fast`
- Run for route/form/API/UI flow changes: `npm run e2e:smoke`
- For UI edits, capture proof screenshots + console log.

## Founder-safe output format

- What changed in the user flow
- Why this reduces friction
- What to watch after launch (specific behavior/metric)
- What Cade should do next (or `No action needed`)
