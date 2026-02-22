# Skill: Memory Integrity Trend Reporting

Use this when you need a weekly, fail-closed trend snapshot for autonomy hardening.

## What this covers

- checkpoint pass-rate trend (target: `>= 95%`)
- integrity-score trend (target: `>= 95%`)
- weekly artifact generation for handoffs and audits

## Commands

Run weekly default window:

```bash
npm run ai:memory:trend
```

Run wider backfill window:

```bash
npm run ai:memory:trend:30
```

## Artifacts

- Run ledger: `reports/memory-integrity/checkpoint-history.jsonl`
- Weekly summary: `reports/memory-integrity-weekly/<YYYY-MM-DD>/summary.md`
- Weekly metrics JSON: `reports/memory-integrity-weekly/<YYYY-MM-DD>/metrics.json`

## Fail-closed behavior

- Command exits non-zero when there is no history data for the selected window.
- In strict mode (default), command exits non-zero when weekly pass-rate or average integrity falls below target.
- Use `--no-strict` only for diagnostics when you need artifact output without blocking the lane.

## Usage notes

- History is seeded from existing context packs to bootstrap trend visibility.
- Backfilled entries may miss failed checkpoints that produced no context pack; treat them as baseline, not full failure history.
