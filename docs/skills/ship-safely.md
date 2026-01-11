# Ship Safely

Use this when you're getting ready to commit, verify, and ship.

## Small, Safe Commits

- Work on the current `main`-based flow (repo uses main-only).
- Keep changes focused; avoid unrelated refactors.
- Prefer multiple small commits over one large change.

## Required Verification (before claiming done)

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
```

If UI changed, capture Playwright screenshots (light/dark, mobile/desktop).

## Smoke Tests (manual quick checks)

- Home page: `/` (`app/page.tsx`).
- Penny List: `/penny-list` (cards, filters, data render).
- Report Find: `/report-find` (form loads).
- Store Finder: `/store-finder` (map renders).

## Rollback Notes

- Deploys happen from `main` (Vercel auto-deploys on push).
- If a change breaks production, restore the previous commit on `main` and push to re-deploy the last known good state.
