# Prune Index - 2026-02-03 (Pass 2)

Archive-first pass focused on additional low-signal docs not in the canonical read path.

## Archived docs

- `.ai/ROUTER.md`
- `.ai/SECURITY_AUTOMATION_FIXES.md`
- `.ai/SENTRY_SUPPRESSION_RULES.md`
- `.ai/SKU_CONTENT_ANALYSIS.md`
- `SUPABASE_CRITICAL_FIXES.md`
- `docs/ELEVATION-SYSTEM-VISUAL-GUIDE.md`
- `docs/how-to-enrich-penny-list-from-json.md`

## Restore rule

Use repo-relative restore via `git mv`.

Example:

- `git mv archive/docs-pruned/2026-02-03-pass2/docs/how-to-enrich-penny-list-from-json.md docs/how-to-enrich-penny-list-from-json.md`

## Policy

- These docs are intentionally removed from active context.
- Only restore on explicit request from Cade.
