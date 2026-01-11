# Repo Map (Authoritative)

Use this as the high-level map of **where things live**.

## Core App (Next.js App Router)
- `app/` — Routes, layouts, API handlers.
  - `app/page.tsx` — Home page.
  - `app/penny-list/page.tsx` — Penny List UI.
  - `app/report-find/page.tsx` — Report a Find form.
  - `app/sku/[sku]/page.tsx` — SKU detail pages.
  - `app/store-finder/page.tsx` — Store Finder UI.
  - `app/guide/page.tsx` — Penny Guide content.
  - `app/api/**/route.ts` — API routes (see `app/api/`).
  - `app/sitemap.ts` + `app/robots.ts` — SEO metadata.
  - `app/globals.css` — Design tokens + global styles (fragile).

## Shared UI + Components
- `components/` — Shared UI and page sections.
  - `components/penny-list-*.tsx` — Penny List cards, filters, table, client shell.
  - `components/navbar.tsx` / `components/footer.tsx` — Global layout.
  - `components/GuideContent.tsx` — Guide content blocks.
  - `components/store-map.tsx` — Store Finder map (fragile).
  - `components/ui/` — shadcn/ui primitives.

## Data + Business Logic
- `lib/` — Utilities, data fetching, validation.
  - `lib/fetch-penny-data.ts` — Penny list data fetch.
  - `lib/penny-list-query.ts` / `lib/penny-list-utils.ts` — Penny list helpers.
  - `lib/sku.ts` — SKU rules (single source of truth).
  - `lib/stores.ts` + `lib/us-states.ts` — Store Finder data helpers.
  - `lib/home-depot.ts` — Home Depot URL helpers.
  - `lib/supabase/` — Supabase client/server helpers.

## Static Data + Assets
- `data/` — Store JSON, example inputs, seed data.
  - `data/home-depot-stores.json` — Store Finder dataset.
- `public/` — Images, OG assets, static files.
  - `public/og/` — Static OG PNGs.

## Tests + Tooling
- `tests/` — Playwright tests.
- `playwright.config.ts` — E2E configuration.
- `scripts/` — One-off utilities, enrichment, AI tooling.
  - `scripts/ai-verify.ts` / `scripts/ai-proof.ts` — Verification helpers.
  - `scripts/generate-og-images-playwright.ts` — Regenerate OG images.

## Ops + Config
- `package.json` — Scripts and dependencies.
- `next.config.js`, `tailwind.config.ts`, `tsconfig.json` — Core config.
- `sentry.*.config.ts`, `instrumentation*.ts` — Observability.

## Documentation + Memory
- `docs/` — Product + technical docs (design system, data flows, guides).
- `.ai/` — Session memory, constraints, verification rules.
- `AGENTS.md` / `SKILLS.md` — Agent rules and quick references.
