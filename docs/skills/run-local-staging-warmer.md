# Skill: Run Local Staging Warmer (Local-Only)

This is the **only supported** way to refresh `enrichment_staging` (the Item Cache).

GitHub Actions for the staging warmer were **permanently removed** because upstream is prone to blocking datacenter runners (Cloudflare / bot protection).

## What this does

- Runs the staging warmer pipeline locally.
- Pulls penny items from the upstream source and upserts into Supabase `enrichment_staging`.
- Skips only SKUs that are already fully enriched in the Main List.
- Keeps partial/unenriched Main List SKUs eligible so Item Cache backfill can enrich older rows.
- Intended to be run from your home IP (or another “normal” residential network).

## One-time setup

1. Ensure you have Python 3 installed (Windows: `py -3` works).
2. Pull your Vercel project env vars into `.env.local`:

```bash
vercel env pull .env.local
```

3. Add these two vars to `.env.local` manually (do not commit):

```bash
PENNY_RAW_COOKIE=...
PENNY_GUILD_ID=...
```

## Run it (single command)

```bash
npm run warm:staging
```

Optional overrides:

```bash
npm run warm:staging -- --zip-codes 30301,30303,30305,30308,30309
npm run warm:staging -- --max-uniques 6000 --batch-size 50
```

### Broader zip coverage (still small per run)

If you want broader coverage without manually editing the command every time, set a larger pool and sample from it each run:

```bash
# Sample 5 zip codes from a larger pool each run
PENNY_ZIP_POOL=30301,10001,60601,75201,94103,98101
npm run warm:staging
```

Or pass via CLI:

```bash
npm run warm:staging -- --zip-pool 30301,10001,60601,75201,94103,98101 --zip-sample 5
```

For deterministic sampling (repeatable runs), add a seed:

```bash
npm run warm:staging -- --zip-pool 30301,10001,60601,75201,94103,98101 --zip-sample 5 --zip-seed 20260201
```

## Success criteria

- The command prints `STAGING WARMER COMPLETE` with non-zero `upserted_to_staging`.
- Supabase `enrichment_staging` row count increases (or existing rows update) and field coverage improves (especially `retail_price`).
- Newly cached SKUs can auto-backfill older Main List rows through the Item Cache trigger.
- Optional: run `tsx scripts/print-enrichment-staging-status.ts` (with your env loaded) to see counts and `retail_price` coverage.

## If it fails

- If you see `cloudflare_block=true`, it’s bot protection; try again later from a different network (e.g., hotspot).
- If you see 401/403 without the Cloudflare HTML, refresh `PENNY_RAW_COOKIE` and retry.
