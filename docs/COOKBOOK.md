# Development Cookbook
Short recipes for common tasks. If you add a repeatable script, document it here and keep the repo tidy.

## Setup & Run
- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Build: `npm run build` then `npm run start`

## Quality Checks
- Lint: `npm run lint` (fix touched files; legacy pages have unescaped quotes to clean)
- E2E: `npm run test:e2e`

## Add a Page
```tsx
// app/example/page.tsx
export default function Example() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Example</h1>
      <p className="text-lg text-muted-foreground">Content goes here.</p>
    </main>
  )
}
```
Verify at `/example`.

## Data Updates
- Cadences/FAQ/recent finds live in `data/*.json`. Keep entries factual; replace placeholders before publishing.

## Cleanup Policy
- Delete one-off test scripts/assets after use.
- Move durable commands into package scripts or document them here.
- Keep docs limited to the canonical set noted in `README.md`.

## Refresh Store Data (Places API)
- Script: `node scripts/fetch-home-depot-places.js` (uses `GOOGLE_PLACES_API_KEY` from `.env.local`; request caps are built-in to control spend).
- Output: `data/home-depot-stores.json` (git-ignored). Fields include `hoursFetchedAt`/`hoursLastChangedAt` and `services`.
- Known gaps: some stores may be missing hours/services if Places does not return them.
- Caution: API spend—keep caps low; to fill gaps, run a small Places Details backfill only on the specific missing IDs (not a full sweep).
- After generation: spot-check counts and missing fields; do not stage the JSON. The Store Finder consumes it via `app/store-finder/page.tsx`.
