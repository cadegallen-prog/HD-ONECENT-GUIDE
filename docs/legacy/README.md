# Legacy / Archived Penny List Assets

This folder contains archived documentation and one-off scripts related to the legacy Google Forms → Google Sheets intake pipeline that was deprecated in Dec 2025.

Why archived:

- Google Forms/Sheets were a low-cost, no-code option but caused operational fragility (expired published CSV URLs, missing fallbacks, and maintenance overhead).
- The active system now uses Supabase (`Penny List`, `penny_item_enrichment`) with server-side submission (`/api/submit-find`) and a `penny_list_public` read view.

What you'll find here:

- `PENNY-LIST-STRATEGY.md` — Archived original strategy doc (do not rely on it for live ops).
- One-off import & merge scripts are archived under `archive/scripts-pruned/2026-02-03-pass2/scripts/legacy/` (e.g., `merge-enrichment.ts`) and should be treated as historical/manual use only.

Guidance:

- Do NOT re-enable automated polling of Google Sheets or wire schedulers to the published CSV.
- If you need a one-time historical import into Supabase, export the CSV and open a ticket or ask the owner to run an idempotent import script.
- After confirming no active scheduled jobs, remove any `GOOGLE_SHEET_URL` secrets from Vercel/GitHub to reduce attack surface.

If you want, I can implement a one-off import that upserts rows into Supabase with deduplication rules. Provide the CSV export and a dedupe rule (e.g., sku+store+date) and I'll prepare a safe import script.
