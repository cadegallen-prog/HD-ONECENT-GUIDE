# Skill: Archive-First Prune (Docs + Scripts)

Use this when AI context is noisy due to deprecated, duplicate, or single-use docs/scripts.

## Goal

Reduce bloat without destructive deletes by moving low-signal files to archive snapshots that preserve exact restore paths.

## Safety Rules

- **Archive first, never hard delete** in the first pass.
- Keep restore deterministic with `git mv` path parity.
- Do not move files referenced by:
  - `package.json` scripts
  - active workflows (`.github/workflows/*`)
  - canonical startup docs (`README.md`, `.ai/START_HERE.md`, `AGENTS.md`)
- Update memory docs after each prune batch:
  - `.ai/SESSION_LOG.md`
  - `.ai/STATE.md`
  - `.ai/BACKLOG.md` (if priorities shifted)

## Inventory Commands

```bash
# tracked markdown + scripts volume
 git ls-files "*.md" | measure
 git ls-files "scripts/*" "scripts/**/*" | measure

# evidence-based prune audit (recommended)
 npm run prune:audit

# quick low-reference scan (manual pattern)
 rg -n "<filename>" -S --glob '!archive/**'
```

## Archive Locations

- Docs: `archive/docs-pruned/<snapshot-date>/...`
- Scripts: `archive/scripts-pruned/<snapshot-date>/...`
- Media: `archive/media-pruned/<snapshot-date>/...`

Each snapshot must include:

- `INDEX.md` with moved files and restore examples
- policy reminder (cold storage, no default reads)

## Restore Pattern

```bash
# restore one file
 git mv archive/docs-pruned/<snapshot-date>/<old-path> <old-path>

# same pattern for scripts-pruned
```

## Verification

After prune batches, run:

```bash
npm run ai:verify -- test
```

This confirms active app/tooling still passes all 4 gates.
