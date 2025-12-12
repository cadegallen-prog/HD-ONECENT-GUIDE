# PennyCentral Baseline Audit

Date: 2025-12-12  
Scope: Entire route tree in `ROUTE-TREE.txt` + shared components in `COMPONENT-TREE.txt`  
Guardrails: No redesigns / no styling refactors; only gate/tooling wiring + build/test blockers.

## Baseline Build Health

Commands run (local):

- `npm install` (note: `npm ci` failed on Windows with `EPERM` unlink against `node_modules/bufferutil/*.node`)
- `npm run build` ✅
- `npm run lint` ✅
- `npm run test:unit` ✅
- `npm run test:e2e` ✅ (required updating Playwright snapshots for `/penny-list`)

## Gate Wiring (BASE_URL)

Goal: no audit scripts hardcode ports; dev runs on `3001`.

Status:

- `npm run check-axe` now reads `BASE_URL` (and otherwise infers the dev/start port from `package.json`)
- `npm run check-contrast` now reads `BASE_URL` (and otherwise infers the dev/start port from `package.json`)
- `scripts/run-audit.ps1` (Lighthouse) now reads `BASE_URL` (and otherwise infers the dev/start port from `package.json`)

Docs updated: `SCRIPTS-AND-GATES.txt`.

## Route Coverage

Legend:

- Rendering: `SSG` = prerendered/static, `SSR` = server-rendered on demand, `CSR` = client page, `API` = route handler
- Heavy client JS: `High` typically means map/chart/form-heavy client pages (Leaflet / RHF / large tables)
- Shared templates: `RootLayout` = `app/layout.tsx` (Navbar/Footer/Theme/Command Palette); `StoreFinderLayout` = `app/store-finder/layout.tsx`

| Route | Rendering | Heavy Client JS | Shared Templates / Notes |
| --- | --- | --- | --- |
| `/` | SSG (server) | Low | RootLayout |
| `/_not-found` | SSG (server) | Low | RootLayout |
| `/about` | SSG (server) | Low | RootLayout; uses `SupportAndCashbackCard` |
| `/admin/dashboard` | CSR (client page) | Medium | RootLayout; admin UI |
| `/api/admin/submissions` | API | n/a | Route handler |
| `/api/stores` | API | n/a | Route handler |
| `/api/submit-find` | API | n/a | Route handler |
| `/cashback` | SSG (server) | Low | RootLayout; uses `SupportAndCashbackCard` |
| `/checkout-strategy` | SSG (server) | Low | RootLayout |
| `/clearance-lifecycle` | SSG (server) | Medium | RootLayout; client chart (`ClearanceLifecycleChart`) |
| `/digital-pre-hunt` | SSG (server) | Low | RootLayout |
| `/facts-vs-myths` | SSG (server) | Low | RootLayout |
| `/faq` | SSG (server) | Low | RootLayout |
| `/go/befrugal` | SSR (dynamic) | n/a | Route handler (redirect/outbound flow) |
| `/guide` | SSG (server) | Medium | RootLayout; large client component (`GuideContent`) |
| `/in-store-strategy` | SSG (server) | Low | RootLayout |
| `/internal-systems` | SSG (server) | Low | RootLayout |
| `/penny-list` | SSR (dynamic) | High | RootLayout; server fetch + heavy client UI (`PennyListClient`) |
| `/report-find` | CSR (client page) | High | RootLayout; RHF form + validation |
| `/resources` | SSG (server) | Low | RootLayout; uses `ResourcesSupportCtas` |
| `/responsible-hunting` | SSG (server) | Low | RootLayout |
| `/sku/[sku]` | SSR (dynamic) | Medium | RootLayout; server fetch + client helpers (`copy-sku-button`) |
| `/store-finder` | CSR (client page) | High | RootLayout + StoreFinderLayout; Leaflet map (dynamic import) |
| `/trip-tracker` | CSR (client page) | High | RootLayout; local state/storage patterns |
| `/what-are-pennies` | SSG (server) | Low | RootLayout |

## Component Inventory (Shared)

Key shared components (non-exhaustive) and where they show up:

- `components/navbar.tsx`: global nav in `app/layout.tsx`
- `components/footer.tsx`: global footer in `app/layout.tsx`
- `components/command-palette-provider.tsx` + `components/command-palette.tsx`: global in `app/layout.tsx`
- `components/theme-provider.tsx` + `components/theme-toggle.tsx`: theme state + UI
- `components/penny-list-client.tsx`, `components/penny-list-table.tsx`, `components/penny-list-filters.tsx`: `/penny-list`
- `components/store-map.tsx`: dynamically imported by `/store-finder`
- `components/clearance-lifecycle-chart.tsx`: `/clearance-lifecycle`
- `components/resources-support-ctas.tsx`: `/resources`
- `components/SupportAndCashbackCard.tsx`: `/about`, `/cashback`, `/guide`
- `components/page-templates.tsx`: present but currently unused; also references non-standard token names (`--bg-primary`, `--bg-card`, etc.)

## Design System Drift (Identify Only)

Source of truth:

- Tokens in `app/globals.css`
- Spec in `docs/DESIGN-SYSTEM-AAA.md`

Drift signals (no fixes applied here):

- `npm run lint:colors` reports 47 warnings (examples):
  - `app/cashback/page.tsx` uses `slate-*` text colors
  - `app/admin/dashboard/page.tsx` uses `bg-blue-50`, `text-blue-*`
  - `app/report-find/page.tsx` uses `bg-blue-*`, `text-blue-*`
  - `components/GuideContent.tsx` uses `text-blue-700`
  - `components/penny-list-client.tsx` uses `bg-blue-100`, `bg-slate-100`, `text-slate-600`
- Additional raw Tailwind color usage found (examples):
  - `components/footer.tsx` uses `text-zinc-*` and `text-white`
  - `app/penny-list/page.tsx` uses `bg-zinc-100 dark:bg-zinc-800`
  - `components/penny-list-table.tsx` uses `bg-zinc-*`, `text-emerald-*`, etc.

## Navigation Consistency (Core Loop)

Core flows to verify: Penny List → Report a Find → Store Finder → Guide.

- Navbar: includes `/penny-list`, `/report-find`, `/store-finder`, `/guide` ✅
- Footer quick links: includes `/penny-list`, `/report-find`, `/store-finder`, `/guide` ✅
- Command palette: includes `/guide`, `/store-finder`, `/trip-tracker`, `/resources`, `/about` but does not include `/penny-list` or `/report-find` ⚠️

## Quality Gates Status

Existing scripts (see `package.json` + `SCRIPTS-AND-GATES.txt`):

- Build: `npm run build` ✅
- Lint: `npm run lint` ✅
- Unit tests: `npm run test:unit` ✅
- E2E tests: `npm run test:e2e` ✅
- Color drift scanner: `npm run lint:colors` ⚠️ (warnings only)
- Axe audit: `npm run check-axe` (requires server running at `BASE_URL`)
- Contrast audit: `npm run check-contrast` (requires server running at `BASE_URL`)
- Lighthouse audits: `pwsh ... scripts/run-audit.ps1` (requires server running at `BASE_URL`)

Gaps / follow-ups (tracked for the foundation plan):

- Audit route coverage is partial: `checks/routes.json` includes only `["/","/penny-list","/store-finder","/about"]`
- Axe/contrast/lighthouse are not currently run as part of the main build/test flow
- `npm ci` can be flaky on Windows if a native module binary is locked; `npm install` works reliably

