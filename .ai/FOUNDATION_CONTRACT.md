# Foundation Contract

Purpose: working agreement for layout + styling consistency across every route in `ROUTE-TREE.txt`. Keep changes scoped to tokens and primitives; avoid globals churn.

## Token Rules
- Source of truth: `app/globals.css` + `docs/DESIGN-SYSTEM-AAA.md`. Do not add or change tokens without explicit approval.
- Use tokenized Tailwind colors (`text-text-primary`, `bg-card`, `bg-elevated`, `border-border`, `text-muted`, `text-secondary`, `text-foreground`, `bg-background`, `text-cta` variants via `text-[var(--cta-primary)]` only if no mapped class).
- Status/CTA: use `text-success|warning|error|info` or `bg-[var(--status-*)]` sparingly; only one primary CTA per viewport.
- Spacing: 8pt grid (`p-2/4/6/8`, `gap-2/4/6`, `section-padding`/`section-padding-sm`). Minimum body text 16px; minimum touch target 44x44px; never use text <12px.
- Dark mode: rely on existing CSS variables; no hard-coded dark mode colors.

## Allowed Tailwind Usage
- Prefer variable-backed utilities from `tailwind.config.ts` (`bg-card`, `text-text-*`, `border-border`, `bg-elevated`, `text-muted`, `bg-page`).
- Avoid raw palette classes (slate/stone/zinc/emerald/etc.) unless mapped to tokens; if an exception is unavoidable, document rationale and align to AAA contrast.
- Typography: use the type scale classes in `globals.css` (`text-body`, `.text-h2`, etc.) or Tailwind base sizes (>= `text-base`) with 1.5+ line-height.
- Motion: respect `prefers-reduced-motion`; keep transitions <= 200ms using existing duration tokens.

## Layout Primitives
- Containers: `container-narrow` (max-w-4xl) and `container-wide` (max-w-7xl) for page alignment.
- Sections: `section-padding` / `section-padding-sm` for vertical rhythm; avoid bespoke padding.
- Cards/Callouts: reuse `value-explainer`, `callout-*`, `card-interactive`, `btn-*` patterns from `globals.css` before inventing new wrappers.
- Tables: use `.line-clamp-2-table` for clamping; prefer `table`/`th`/`td` styling patterns from `globals.css`.

## Nav & IA Rules
- Core loop must always be reachable: `/penny-list`, `/report-find`, `/store-finder`, `/guide` present in navbar, footer quick links, and command palette.
- Affiliate safety: `/go/*` remain plain `<a>` with `target="_blank" rel="noopener noreferrer"`; never wrap in `next/link` or prefetch.
- IA consistency: follow `ROUTE-TREE.txt` for coverage; if a new route is added/removed, regenerate `ROUTE-TREE.txt` and update relevant nav/footer/palette links.
- Avoid new accent colors or nav chrome; keep link underlines and focus rings visible.

## Regression Gates (must run after meaningful change)
1) `npm run build`
2) `npm run lint`
3) `npm run test:unit`
4) `npm run test:e2e`
Record results in SESSION_LOG; add contrast/axe runs when touching UI.
