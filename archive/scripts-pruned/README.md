# Pruned Scripts Archive

Archive-first storage for scripts removed from active workflow.

## Policy

- Scripts here are **cold storage** and should not be used by default.
- Keep restore explicit and intentional.
- Do not reference these scripts from active npm scripts/workflows.

## Restore

Restore by moving a script back to its original path.

Example:

- `git mv archive/scripts-pruned/2026-02-03/scripts/analyze-results.js scripts/analyze-results.js`
