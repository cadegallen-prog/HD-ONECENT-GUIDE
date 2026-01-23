# Skill: Run Local Staging Warmer (Manual Override)

Use this when GitHub Actions runners are blocked by Cloudflare (403 + “Just a moment…”) and you need to refresh `enrichment_staging` from your own/home IP.

## What this does

- Runs the **same warmer pipeline** as GitHub Actions, but locally.
- Pulls penny items from the upstream source and upserts into Supabase `enrichment_staging`.
- Keeps the GitHub Action as a low-aggression probe (it will still log diagnostics and open a GitHub issue when blocked).

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

## Success criteria

- The command prints `STAGING WARMER COMPLETE` with non-zero `upserted_to_staging`.
- Supabase `enrichment_staging` row count increases and recent `updated_at` values refresh.

## If it fails

- If you see `cloudflare_block=true`, it’s bot protection; try again later from a different network (e.g., hotspot) or plan a self-hosted runner.
- If you see 401/403 without the Cloudflare HTML, refresh `PENNY_RAW_COOKIE` and retry.
