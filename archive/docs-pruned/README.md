# Pruned Docs Archive

This folder stores documentation moved out of active workflow to reduce noise.

## Policy

- Archive is **cold storage**: agents should not read from here during normal sessions.
- Do not reintroduce archived docs unless explicitly requested by you (Cade).
- Keep archive paths stable so restores are deterministic.

## Restore rule

Every archive snapshot mirrors original repo-relative paths under its date folder.

- Example restore:
  - `git mv archive/docs-pruned/2026-02-03/docs/SKU-IMPORT-WORKFLOW.md docs/SKU-IMPORT-WORKFLOW.md`

After restoring, update:

- `.ai/STATE.md`
- `.ai/SESSION_LOG.md`
- any canonical index that should reference the restored doc
