# 2026 Research Integration (Guide Content Refresh)

**Status:** Completed (verified locally; pending deploy via push)
**Last updated:** 2026-02-04
**Owner:** Cade

## Goal

Integrate the 2026 operational research into the public guide pages so the content is:

- Accurate (no legacy cadence misinformation)
- Practical (actionable signals like $.02 buffer, “No Home”, MET timing)
- Professional (design-system tokens only; no generic Tailwind palette colors)

## Why

The old advice (“3-week cadence”, clearance endcaps, etc.) no longer matches the 2026 in-store reality. Credibility is the product.

## Done means

- `/clearance-lifecycle` contains:
  - ICE metrics explanation + table(s)
  - $.02 buffer explanation (what it signals, why it matters)
  - Legacy vs 2026 comparison table
  - **Accurate legacy cadence reference** (Cadence A/B stage + durations) clearly labeled as historical
- `/inside-scoop` contains:
  - MET team content (ownership, schedule, why it matters)
  - ZMA disposition data (destruction/RTV/donation) in a table
  - “No Home” signal explanation
- `/in-store-strategy` contains:
  - Home Bay focus
  - Register / Zero-Comm awareness
  - Checkout best practices + tone guidance
- `/facts-vs-myths` contains:
  - Adds **4 new 2026 myths** and removes/rewrites outdated cadence claims
- `components/guide/TableOfContents.tsx` descriptions match the 2026 content
- Visual requirements:
  - No raw Tailwind palette colors (esp. amber)
  - Use design tokens (`var(--...)`) for borders, backgrounds, and text
  - Tables are responsive (`overflow-x-auto`) and readable on mobile
- Verification:
  - `npm run lint`
  - `npm run build`
  - `npm run test:unit`
  - `npm run test:e2e`
  - `npm run lint:colors` (no errors; no drift)
- Memory updated:
  - `.ai/SESSION_LOG.md` updated (and trimmed to 3 most recent entries)
  - `.ai/STATE.md` updated to reflect this content refresh

## Files to modify

- `app/clearance-lifecycle/page.tsx`
- `app/inside-scoop/page.tsx`
- `app/in-store-strategy/page.tsx`
- `app/facts-vs-myths/page.tsx`
- `components/guide/TableOfContents.tsx`

## Notes / Guardrails

- Avoid absolute claims or promises about penny timelines.
- Keep “legacy cadence” as historical reference with clear caveats.
- Do not touch `app/globals.css` or add new colors.

## Verification (latest)

- `npm run lint`: ✅
- `npm run build`: ✅
- `npm run test:unit`: ✅ (26/26)
- `npm run test:e2e`: ✅ (156 passed)
- `npm run lint:colors`: ✅ (Errors: 0 | Warnings: 0)
- Playwright console audit (from e2e): `reports/playwright/console-report-2026-02-04T16-14-58-496Z.json`
