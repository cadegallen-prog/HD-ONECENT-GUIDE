# Docs Prune Snapshot — 2026-02-04-pass1

Goal: remove low-signal, non-runtime exports/logs/artifacts from the active repo surface area (archive-first; deterministic restore).

## Moved Into Cold Storage

- `dev-server.log` (legacy local dev server output)
- `events/monetization-decision-review-2026-02-11.ics` (calendar invite artifact)
- `vercel_list.json`, `vercel_logs.json` (legacy/empty Vercel exports)
- `$file`, `$filePath` (accidental tracked artifacts)
- `https___www.pennycentral.com_-Coverage-2026-02-02/**` (coverage export CSVs)
- `https___www.pennycentral.com_-Performance-on-Search-2026-02-02/**` (search performance export CSVs)

## Restore Examples

```bash
# restore a single file
git mv archive/docs-pruned/2026-02-04-pass1/dev-server.log dev-server.log

# restore a directory snapshot
git mv archive/docs-pruned/2026-02-04-pass1/https___www.pennycentral.com_-Coverage-2026-02-02 https___www.pennycentral.com_-Coverage-2026-02-02
```
