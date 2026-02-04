# Media Prune Snapshot — 2026-02-04-pass2

Goal: quarantine large, legacy image artifacts that add noise and git weight without being used in the current test/tooling flow.

## Moved Into Cold Storage

- `reports/playwright/baseline/**` (legacy Playwright snapshot baseline images; current tests attach screenshots to the Playwright report instead of snapshot comparisons)
- `screenshots/**` (legacy proof screenshots; no longer written by tests)

## Restore Examples

```bash
git mv archive/media-pruned/2026-02-04-pass2/reports/playwright/baseline reports/playwright/baseline
git mv archive/media-pruned/2026-02-04-pass2/screenshots screenshots
```
