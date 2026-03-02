# Root-Level Orphans & Stale Docs (2026-03-01)

## Test Files (Never Referenced)

- `test-analytics-after.mjs`, `test-analytics-before.mjs`, `test-navigation.mjs`
  - No imports or references anywhere in codebase
  - Not in package.json scripts
  - Orphaned test runners from old workflow

## Auto-Generated Doc Snapshots (Out of Date)

- `COMPONENT-TREE.txt`, `ROUTE-TREE.txt`, `SCRIPTS-AND-GATES.txt`
  - Listed archived/moved components (theme-toggle, skeleton, etc.)
  - Not maintained; not a source of truth
  - IDE/git tools provide live views better than static snapshots

## Duplicate Context Docs

- `PENNYCENTRAL_MASTER_CONTEXT.md`
  - Content duplicates canonical governance docs in `.ai/` and root READMEs
  - Removed to avoid stale copies

## Rationale

These files clutter the root and `git log` output without providing value. They were archived (not deleted) so history is preserved and they can be restored if needed.
