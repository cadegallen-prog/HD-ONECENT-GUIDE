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

## Fail-Closed Interpretation

- If any requested report fails, treat the run as incomplete and resolve auth/API/permission issues before using conclusions.
- Do not claim growth/improvement when a data source is missing for the period.
- Preserve failed run artifacts for debugging instead of deleting them.

## Practical Limits

- GSC Search Analytics data has a historical window cap (Google-side limit; typically around 16 months).
- GA4 history depends on property data retention settings and when collection started.
- If you need older history than Google currently returns, keep prior local snapshots; they become your long-term archive.
