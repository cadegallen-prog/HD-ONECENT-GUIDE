# color-typography-aaa

## When to use

Use this when Cade asks for color palette updates, typography improvements, contrast/accessibility cleanup, or consistency checks against the PennyCentral design system.

## Goal

Protect readability and brand consistency by enforcing token-based color usage and typography hierarchy at WCAG AAA targets.

## Color and type workflow

1. Inventory changed styles/classes.
2. Replace raw palette values with approved tokens.
3. Validate text hierarchy:
   - `--text-primary` for headlines
   - `--text-secondary` for body
   - `--text-muted` for metadata
4. Validate size floors:
   - Body text >= 16px
   - Metadata never below 12px
5. Validate contrast on intended surfaces.

## Hard constraints

- Never introduce raw Tailwind color classes.
- Do not change token values in `app/globals.css` without explicit approval.
- Use `docs/DESIGN-SYSTEM-AAA.md` as the color/typography source of truth.
- Preserve dark-mode readability and light-mode hierarchy separation.

## Verification lane

- `npm run lint:colors`
- `npm run verify:fast`
- `npm run e2e:smoke` for route/UI changes
- Run contrast checks when surface/text relationships changed

## Founder-safe output format

- What was non-compliant before
- What token-based fix was applied
- Contrast/readability result summary
- What Cade should do next (or `No action needed`)
