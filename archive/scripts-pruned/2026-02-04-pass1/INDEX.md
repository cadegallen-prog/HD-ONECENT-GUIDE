# Scripts Prune Snapshot — 2026-02-04-pass1

Goal: reduce AI/dev noise by quarantining legacy or one-off scripts that are not referenced by `package.json` scripts, GitHub workflows, or canonical docs.

## Moved Into Cold Storage

- `scripts/analyze-scrape-coverage.ts` (unused analysis helper)
- `scripts/transform-scrape.ts` (one-off transformer; not referenced elsewhere)
- `scripts/GHETTO_SCRAPER/**` (legacy scraping controller + notes)

## Restore Examples

```bash
git mv archive/scripts-pruned/2026-02-04-pass1/scripts/analyze-scrape-coverage.ts scripts/analyze-scrape-coverage.ts
git mv archive/scripts-pruned/2026-02-04-pass1/scripts/GHETTO_SCRAPER scripts/GHETTO_SCRAPER
```
