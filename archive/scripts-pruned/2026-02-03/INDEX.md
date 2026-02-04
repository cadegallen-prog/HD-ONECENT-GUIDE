# Script Prune Index - 2026-02-03

Archive-first pass for unreferenced / single-use scripts not wired into current package scripts, workflows, or canonical docs.

## Archived scripts

- `scripts/analyze-results.js`
- `scripts/backup-tables.js`
- `scripts/capture-console-logs.js`
- `scripts/capture-store-finder-proof.ts`
- `scripts/check-enrichment-status.ts`
- `scripts/check-penny-columns.ts`
- `scripts/check-recent-submissions.ts`
- `scripts/create-og-template.mjs`
- `scripts/csv-to-penny-json.py`
- `scripts/enrich-penny-list.py`
- `scripts/generate-pwa-icons.ts`
- `scripts/generate-stores.js`
- `scripts/install-codex-config.ps1`
- `scripts/install-codex-config.sh`
- `scripts/integrate-scrape.ts`
- `scripts/legacy/merge-verified-backup.py`
- `scripts/optimize-top-skus.js`
- `scripts/prepare-og-background.mjs`
- `scripts/run-migration.js`
- `scripts/screenshot-new-palette.ts`
- `scripts/setup-dev.ps1`
- `scripts/show-console-errors.js`
- `scripts/show-contrast-issues.js`
- `scripts/show-failed-audits.js`
- `scripts/snapshot-og-images.mjs`
- `scripts/top-skus.js`
- `scripts/verify-migration.js`
- `scripts/view-wizard-history.ps1`

## Why this set

- No direct package.json script entry.
- No workflow dependency.
- No active canonical doc dependence.

## Restore rule

Move back the exact file path you need.

Example:

- `git mv archive/scripts-pruned/2026-02-03/scripts/verify-migration.js scripts/verify-migration.js`
