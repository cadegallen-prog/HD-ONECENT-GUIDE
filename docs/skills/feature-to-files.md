# Feature → Starting Files

Use this when you know **what** to change but not **where** to start.

| Feature/Change | Start Here (exact files) |
| --- | --- |
| Home page updates | `app/page.tsx` |
| Penny List UI | `app/penny-list/page.tsx`, `components/penny-list-card.tsx`, `components/penny-list-client.tsx`, `components/penny-list-filters.tsx`, `components/penny-list-table.tsx` |
| Penny List data fetch | `lib/fetch-penny-data.ts`, `lib/penny-list-query.ts`, `lib/penny-list-utils.ts`, `app/api/penny-list/route.ts` |
| Report a Find form + submit | `app/report-find/page.tsx`, `app/api/submit-find/route.ts`, `lib/sku.ts`, `lib/validations.ts` |
| SKU detail pages | `app/sku/[sku]/page.tsx`, `lib/penny-list-query.ts`, `lib/home-depot.ts` |
| Store Finder UI + map | `app/store-finder/page.tsx`, `components/store-map.tsx`, `components/store-map.css` |
| Store data | `data/home-depot-stores.json`, `lib/stores.ts`, `scripts/generate-stores.js` |
| Guide content | `app/guide/page.tsx`, `components/GuideContent.tsx` |
| Trip Tracker | `app/trip-tracker/page.tsx` |
| Resources page | `app/resources/page.tsx`, `components/resources-support-ctas.tsx` |
| Cashback page | `app/cashback/page.tsx`, `components/SupportAndCashbackCard.tsx` |
| SEO + sitemap | `app/sitemap.ts`, `app/robots.ts` |
| OG images | `app/api/og/route.tsx`, `public/og/`, `scripts/generate-og-images-playwright.ts` |
| Analytics toggles | `lib/analytics.ts`, `instrumentation-client.ts`, `instrumentation.ts` |
| Auth/list pages | `app/auth/`, `app/login/`, `app/lists/` |
| Design tokens + global styles | `app/globals.css` (fragile; approval required) |
