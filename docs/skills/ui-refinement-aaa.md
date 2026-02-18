# ui-refinement-aaa

## When to use

Use this when Cade asks for visual polish, component cleanup, spacing/interaction fixes, or hierarchy improvements without changing product scope.

## Goal

Improve UI clarity and trust while staying inside PennyCentral's token system and WCAG AAA standards.

## Refinement checklist

1. Verify hierarchy first:
   - Primary action is visually obvious
   - Secondary actions are present but quieter
   - Metadata does not compete with key actions
2. Verify rhythm and density:
   - Use 8-pt spacing system
   - Keep dense Penny List cards readable
3. Verify interaction quality:
   - Clear focus rings
   - Keyboard reachable controls
   - Hover/focus/active parity
4. Verify mode parity:
   - Light and dark both readable
   - No contrast regressions on card surfaces
5. Verify motion accessibility:
   - Respect `prefers-reduced-motion`

## Hard constraints

- No raw Tailwind palette colors (`blue-500`, `gray-600`, etc.).
- Use existing CSS variables and design tokens.
- Do not modify `app/globals.css` without explicit approval.
- Keep semantic HTML for interactive elements.

## Verification lane

- `npm run verify:fast`
- `npm run e2e:smoke` (if route/form/API/UI-flow touched)
- `npm run lint:colors`
- Playwright screenshots for light/dark + mobile/desktop on changed routes

## Founder-safe output format

- Visual issue fixed
- Why the new version is easier to use
- Proof artifact paths (screenshots + commands)
- What Cade should validate in 60 seconds
