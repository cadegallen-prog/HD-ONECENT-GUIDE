# Script Prune Index - 2026-02-03 (Pass 3)

Archive-first pass for one-off/low-reference script artifacts.

## Archived scripts

- `scripts/normalize-image-urls.ts`

## Notes

- Script was not wired into package scripts/workflows and had a single historical reference.
- Generated scrape JSON and Python bytecode were confirmed as untracked/ignored local artifacts; they were not part of repo history in this pass.

## Restore rule

- `git mv archive/scripts-pruned/2026-02-03-pass3/<original-path> <original-path>`
