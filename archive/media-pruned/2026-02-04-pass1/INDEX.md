# Media Prune Index - 2026-02-04 (Pass 1)

Archive-first pass for large, non-production media artifacts that were bloating repo surface area and AI context.

## Archived paths

- `PICTURES_PENNY_CENTRAL/**`
- `.ai/analytics/**`
- `reports/manual-testing/**`
- `reports/palette-screenshots/**`
- `reports/verification/*.png`
- `Home Depot One Cent Items.pdf`

## Notes

- These assets were not referenced by app code, workflows, or canonical startup docs.
- Production assets remain in `public/` and Playwright baselines remain in `reports/playwright/baseline/`.

## Restore rule

Restore by moving back to the original repo-relative paths.

Examples:

- `git mv archive/media-pruned/2026-02-04-pass1/PICTURES_PENNY_CENTRAL PICTURES_PENNY_CENTRAL`
- `git mv \"archive/media-pruned/2026-02-04-pass1/Home Depot One Cent Items.pdf\" \"Home Depot One Cent Items.pdf\"`
