# Skill: Google GA4 + GSC Local Archive (Additive History)

**When to use:** You need repeatable, local, additive exports from Google Analytics 4 (GA4) and Google Search Console (GSC) for trend analysis, audits, or AI-assisted optimization.

## Goal

Create a timestamped analytics snapshot on every run and append an index entry so history is preserved locally over time.

## Prerequisites

1. `.env.local` contains:
   - `GA4_PROPERTY_ID`
   - `GSC_SITE_URL`
2. Authentication is configured with either:
   - OAuth refresh token env vars (`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`), or
   - Google ADC login with analytics scopes:

```bash
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/webmasters.readonly
```

3. APIs enabled in Google Cloud:
   - Google Analytics Data API
   - Google Analytics Admin API
   - Google Search Console API

## Run

```bash
npm run analytics:archive -- -- --start-date=2024-01-01 --end-date=2026-02-20
```

Minimal run (defaults to broad start + today):

```bash
npm run analytics:archive
```

Optional flags:

- `--skip-ga4` (GSC only)
- `--skip-gsc` (GA4 only)
- `--ga4-property-id <id>`
- `--gsc-site-url <url>`
- `--out-dir <path>`

## Output (local-only, git-ignored)

- `.local/analytics-history/runs/<timestamp>/run-summary.json`
- `.local/analytics-history/runs/<timestamp>/summary.md`
- `.local/analytics-history/runs/<timestamp>/gsc/*.json|*.csv`
- `.local/analytics-history/runs/<timestamp>/ga4/*.json|*.csv`
- `.local/analytics-history/run-index.jsonl` (append-only run log)

## Common follow-up analysis workflow

Use this same skill as the default starting point when the real goal is not just "archive data" but also "figure out what changed."

Typical investigation prompts:

- Why is engagement time lower over the last 7 days versus the prior 30 days?
- Which pages, traffic sources, or device segments are pulling overall performance down?
- Did a recent UI, ad, routing, or traffic-mix change correlate with a performance drop?
- Which metrics changed most at the page, source, or device level?

Recommended follow-up steps after each archive run:

1. Open the latest run folder under `.local/analytics-history/runs/<timestamp>/`.
2. Start with `summary.md`, then inspect the GA4 and GSC CSV/JSON files relevant to the question.
3. Compare a recent window against a baseline window appropriate to the question, such as:
   - last 7 days vs prior 30 days,
   - current week vs previous week,
   - post-change window vs pre-change window.
4. Break the metric down by the most likely dimensions:
   - page/route,
   - source/channel,
   - device,
   - search query,
   - or key event.
5. Write findings and next actions to `reports/analytics-weekly/<YYYY-MM-DD>/summary.md` when the work is part of a recurring review.

Common file starting points:

- GA4 route/page analysis: `ga4/daily_pages.csv`
- GA4 source/channel analysis: `ga4/daily_channel.csv`
- GA4 event analysis: `ga4/daily_events.csv` when present
- GSC page/query analysis: `gsc/daily_pages.csv`, `gsc/daily_queries.csv`

Fail-closed analysis rule:

- Do not claim a cause with confidence if the archive is incomplete, a source is missing, or the comparison window is too small to support the conclusion.
- Prefer wording like `likely contributor`, `strong suspect`, or `inconclusive` unless the pattern is clearly supported by the archived data.

Example founder-friendly prompt:

> Read `docs/skills/README.md` first. Use the analytics archive skill. Pull the latest GA4 and Search Console archive, then diagnose why engagement time per session is down over the last 7 days compared to the prior 30 days. Tell me which pages, traffic sources, or device segments are most responsible, what likely changed, and what the next best action is.

## Fail-Closed Interpretation

- If any requested report fails, treat the run as incomplete and resolve auth/API/permission issues before using conclusions.
- Do not claim growth/improvement when a data source is missing for the period.
- Preserve failed run artifacts for debugging instead of deleting them.

## Practical Limits

- GSC Search Analytics data has a historical window cap (Google-side limit; typically around 16 months).
- GA4 history depends on property data retention settings and when collection started.
- If you need older history than Google currently returns, keep prior local snapshots; they become your long-term archive.
