# Skill: Ship Safely (small commits + verification + rollback)

## Workflow (main-only)

1. `git pull origin main`
2. Make the smallest possible change.
3. Run verification (below).
4. Commit with a clear message.
5. Push `main`.

**Never** force-push or rewrite history.

## Required verification

Run all four quality gates:

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
```

If you touched colors/styles, also run:

```bash
npm run lint:colors
```

Related scripts (fast/full): `npm run qa:fast`, `npm run qa:full`.

## UI changes = Playwright proof

- Required for any UI/UX change.
- Artifacts go to `reports/playwright/**` (see `playwright.config.ts`).

## Smoke checks (manual)

Hit the core loop quickly after changes:

- `/penny-list`
- `/report-find`
- `/sku/[sku]` (use a known SKU from `ROUTE-TREE.txt`)
- `/store-finder`

## Rollback plan (safe)

- **Preferred:** `git revert <commit_sha>`
- This keeps history intact and is safe for `main`.

## Proof + memory updates

- Update `.ai/SESSION_LOG.md` (and `.ai/STATE.md` if meaningful work).
- Paste test outputs when claiming “done”.
