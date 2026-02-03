# Prune Index - 2026-02-03

This snapshot moved low-signal docs from active paths into archive-first storage.

## Why this snapshot exists

- Reduce context noise for AI sessions.
- Keep canonical read order focused on current source-of-truth docs.
- Preserve every removed doc for deterministic recovery.

## Archived files by group

### Root docs

- `ANALYTICS_FIX_REPORT.md`
- `APPLY_MIGRATIONS.md`
- `COMPLETED_ENHANCEMENTS.md`
- `LAUNCH_NOTES.md`
- `SCRAPING_IMPROVEMENT_PLAN.md`
- `SEO_DEEP_DIVE.md`
- `SESSION-START-TEMPLATE.md`
- `STORE_FINDER_NOTES.md`
- `STRATEGIC-THINKING.md`
- `SUPABASE_EGRESS_OPTIMIZATION.md`
- `UPSTREAM_AI_BRIEF.md`

### `.ai` docs

- `.ai/ANALYTICS_MAP.md`
- `.ai/EXECUTION_REPORT_2026-01-16.md`
- `.ai/FORMAT_LINTING.md`
- `.ai/HANDOFF_ADSENSE_RECOVERY.md`
- `.ai/PAGES-OVERHAUL-PLAN.md`
- `.ai/RUFF_MIGRATION.md`
- `.ai/SENTRY_ALERTS_ISSUE.md`
- `.ai/impl/adsense-recovery-guide-atomization.md`
- `.ai/impl/ezoic-placeholders.md`
- `.ai/plans/penny-card-systematic-hierarchy.md`

### `docs` + skills

- `docs/ARCHIVE-AUDIT-SUMMARIES.md`
- `docs/COLOR-SYSTEM-IMPLEMENTATION.md`
- `docs/DARK-MODE-REMEDIATION-REPORT.md`
- `docs/SKU-IMPORT-WORKFLOW.md`
- `docs/skills/add-quality-gate.md`
- `docs/skills/debug-prettier-eslint-failures.md`
- `docs/skills/fix-failing-pre-commit-hooks.md`
- `docs/skills/investigate-github-actions-qa-failures.md`

### Reports + prompts

- `reports/hang-audit.md`
- `reports/MY_LIST_PHASE_2_TEST_REPORT.md`
- `scripts/prompts/landing-2025-12-05_04-46-16.md`

## Restore commands

- Restore one file:
  - `git mv archive/docs-pruned/2026-02-03/<original-path> <original-path>`
- Restore many files from this snapshot:
  - move each needed file back with the same relative path rule above

## Notes

- This is archive-first, not deletion.
- Do not add archived docs back to canonical read order unless explicitly approved.
