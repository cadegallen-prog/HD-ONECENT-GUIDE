# Skill: Feature → Files (common starting points)

Use this to jump straight to the right file(s) for common changes.

## Penny List (browse + filters + cards)

- Page shell: `app/penny-list/page.tsx`
- Client logic + data fetch: `components/penny-list-client.tsx`
- Filters UI: `components/penny-list-filters.tsx`
- Card UI: `components/penny-list-card.tsx`
- Table UI: `components/penny-list-table.tsx`
- Query/formatting helpers: `lib/penny-list-query.ts`, `lib/penny-list-utils.ts`
- API route (if server response changes): `app/api/penny-list/route.ts`

## Report a Find (form + submission)

- Form page: `app/report-find/page.tsx`
- Server handler: `app/api/submit-find/route.ts`
- Validation helpers: `lib/sku.ts`, `lib/validations.ts`
- Prefill helpers: `lib/report-find-link.ts`

## SKU detail page

- Page: `app/sku/[sku]/page.tsx`
- Link + metadata helpers: `lib/home-depot.ts`
- Shared item card: `components/list-item-card.tsx`
- Thumbnail rendering: `components/penny-thumbnail.tsx`

## Store Finder

- Page: `app/store-finder/page.tsx`
- Map component (fragile): `components/store-map.tsx`
- Store data: `data/stores/store_directory.master.json`
- API route: `app/api/stores/route.ts`
- Store constants/helpers: `lib/stores.ts`, `lib/states.ts`

## Guide / editorial content

- Page: `app/guide/page.tsx`
- Main content: `components/GuideContent.tsx`

## SEO / metadata

- Sitemap/robots: `app/sitemap.ts`, `app/robots.ts`
- OG images: `app/api/og/route.tsx`, `public/og/*.png`
- OG generator script: `scripts/generate-og-images-playwright.ts`

## Navigation / layout

- Global layout: `app/layout.tsx`
- Navbar/footer: `components/navbar.tsx`, `components/footer.tsx`
- Theme: `components/theme-provider.tsx`, `components/theme-toggle.tsx`
