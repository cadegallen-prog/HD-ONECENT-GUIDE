# PennyCentral Foundation Plan (Tokens + Templates)

Goal: unify design tokens + page templates across **all routes** without scope creep, while improving stability and audit coverage for the Penny List + Report a Find loop.

## Step 1 — Lock Token Source of Truth

Work:

- Align `app/globals.css` tokens to `docs/DESIGN-SYSTEM-AAA.md` (names + semantics)
- Audit and remove/alias “extra” token names in components (identify, then standardize)

Stop point verification:

- `npm run build`
- `npm run lint`
- `npm run test:unit`

## Step 2 — Define Canonical Layout Primitives

Work:

- Introduce a minimal set of shared layout components (server-first where possible): page shell, section wrapper, prose wrapper, CTA block
- Decide whether to adopt/replace `components/page-templates.tsx` (currently unused and uses non-standard token names)

Stop point verification:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`

## Step 3 — Migrate Core Loop Pages First

Target routes (highest product leverage):

- `/penny-list`
- `/report-find`
- `/store-finder`
- `/guide`
- `/` (homepage entry points)

Work:

- Replace raw Tailwind colors with tokenized classes (no visual redesign; just token unification)
- Standardize page headers/CTAs/layout spacing via the canonical primitives from Step 2

Stop point verification:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm run lint:colors` (aim for fewer warnings)

## Step 4 — Migrate Remaining Content Routes

Target routes:

- `/about`, `/cashback`, `/resources`, `/faq`, `/facts-vs-myths`, `/digital-pre-hunt`, `/checkout-strategy`, `/clearance-lifecycle`, `/in-store-strategy`, `/internal-systems`, `/responsible-hunting`, `/what-are-pennies`, `/sku/[sku]`, `/trip-tracker`, `/admin/dashboard`

Work:

- Standardize per-page structure using the canonical primitives
- Eliminate raw Tailwind colors flagged by `npm run lint:colors`

Stop point verification:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`

## Step 5 — Navigation + IA Consistency

Work:

- Ensure Navbar + Footer + Command Palette all include the core loop destinations: Penny List, Report a Find, Store Finder, Guide
- Ensure anchor links in the command palette point to real sections (no dead hashes)

Stop point verification:

- `npm run build`
- `npm run lint`
- `npm run test:e2e`

## Step 6 — Expand Audit Coverage (Axe/Contrast/Lighthouse)

Work:

- Expand `checks/routes.json` to include all user-visible routes (or the top set by traffic + core loop)
- Make audit scripts consistently use `BASE_URL` and document a 2-terminal workflow (server + audits)

Verification:

- Terminal A: `npm run dev`
- Terminal B:
  - `$env:BASE_URL='http://localhost:3001'; npm run check-axe`
  - `$env:BASE_URL='http://localhost:3001'; npm run check-contrast`
  - `$env:BASE_URL='http://localhost:3001'; pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/run-audit.ps1`

