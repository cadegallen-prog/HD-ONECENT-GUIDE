# Skill: Repo Map (authoritative "where things live")

## App routes (Next.js App Router)

- **Home:** `app/page.tsx`
- **Penny List:** `app/penny-list/page.tsx`
- **Report a Find:** `app/report-find/page.tsx`
- **SKU detail pages:** `app/sku/[sku]/page.tsx`
- **Store Finder:** `app/store-finder/page.tsx`
- **Trip Tracker:** `app/trip-tracker/page.tsx`
- **Guide:** `app/guide/page.tsx` (content in `components/GuideContent.tsx`)
- **Resources:** `app/resources/page.tsx`
- **Auth + Lists:** `app/auth/**`, `app/login/page.tsx`, `app/lists/**`
- **SEO + crawlers:** `app/sitemap.ts`, `app/robots.ts`

## API routes

- **Submit find:** `app/api/submit-find/route.ts`
- **Penny list feed:** `app/api/penny-list/route.ts`
- **Stores API:** `app/api/stores/route.ts`
- **OG images:** `app/api/og/route.tsx`
- **Affiliate redirect:** `app/go/rakuten/route.ts` (legacy: `app/go/befrugal/route.ts` redirects)

## Shared components (UI + feature logic)

- **Penny List UI:** `components/penny-list-client.tsx`, `components/penny-list-card.tsx`,
  `components/penny-list-table.tsx`, `components/penny-list-filters.tsx`
- **List actions:** `components/penny-list-action-row.tsx`, `components/add-to-list-button.tsx`,
  `components/share-button.tsx`
- **Store Finder map:** `components/store-map.tsx` (fragile)
- **Layout + nav:** `components/navbar.tsx`, `components/footer.tsx`, `components/page-templates.tsx`
- **Theme + analytics:** `components/theme-provider.tsx`, `components/theme-toggle.tsx`,
  `components/analytics-session.tsx`
- **shadcn/ui primitives:** `components/ui/**`

## Data + business logic

- **Penny List queries:** `lib/penny-list-query.ts`, `lib/penny-list-utils.ts`
- **SKU validation:** `lib/sku.ts`
- **Home Depot links:** `lib/home-depot.ts`
- **Report Find link helpers:** `lib/report-find-link.ts`
- **Supabase clients:** `lib/supabase/*`
- **Stores dataset:** `data/stores/store_directory.master.json`

## Docs & runbooks

- **Design system:** `docs/DESIGN-SYSTEM-AAA.md`
- **Crowdsource/Supabase:** `docs/CROWDSOURCE-SYSTEM.md`, `docs/supabase-rls.md`
- **Store Finder notes:** `docs/STORE-FINDER.md`
- **AI/system rules:** `AGENTS.md`, `.ai/*`

## Scripts & tooling

- **Verification:** `scripts/ai-verify.ts`, `scripts/ai-proof.ts`, `scripts/ai-doctor.ts`
- **Data pipeline:** `scripts/export-pennycentral-json.ts`, `scripts/validate-scrape-json.ts`,
  `scripts/scrape-to-enrichment-csv.ts`, `scripts/enrichment-diff.ts`
- **OG image generation:** `scripts/generate-og-images-playwright.ts`

## Tests & reports

- **Playwright + unit tests:** `tests/**`
- **Playwright artifacts:** `reports/playwright/**`

## Static assets

- **Public files:** `public/**` (including OG images in `public/og/*.png`)
