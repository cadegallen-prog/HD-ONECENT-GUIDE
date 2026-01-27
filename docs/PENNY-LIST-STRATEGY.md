# Penny List Strategy (DEPRECATED)

**Status:** DEPRECATED — The Google Forms / Google Sheets intake workflow described here was migrated to a Supabase-backed "Report a Find" flow in Dec 2025.

Why deprecated:

- Google Forms/Sheets were a low-cost, no-code ingestion method but introduced operational fragility (expired published CSV URLs, missing fallbacks, and maintenance overhead).
- The active system now uses Supabase (`Penny List`, `penny_item_enrichment`) with server-side submission (`/api/submit-find`) and a `penny_list_public` read view for the site.

Active docs & code (use these instead):

- `docs/CROWDSOURCE-SYSTEM.md` — Current operational guide (Supabase)
- `app/api/submit-find/route.ts` — Server route used by `/report-find`
- `lib/fetch-penny-data.ts` — Supabase-backed data reads + enrichment

Archive:

- The original content of this document has been moved to `docs/legacy/PENNY-LIST-STRATEGY.md` for historical reference.
- If you need to import historical sheet rows, export a CSV from the old Sheet and use the archived scripts in `scripts/` as a one-off; do NOT re-enable automated polling of Google Sheets.

Notes:

- If a `GOOGLE_SHEET_URL` env var exists in Vercel or GitHub, confirm there are no active scheduled jobs before removing it.
- If you'd like a one-time historical import into Supabase, provide the CSV export and we can write an idempotent import script.

(Archived 2026-01-26)
