# Analytics Contract

## Purpose

Lock GA4 tracking behavior so future edits do not silently undercount or double-count.

## Single Source of Truth

- Pageviews are emitted by GA4 `gtag('config', 'G-DJ4RJRX05E')` in `app/layout.tsx`.
- `components/analytics-tracker.tsx` is a no-op placeholder and must not emit `page_view`.
- Do not run dual pageview sources (auto + manual) at the same time.

## Required Signals

- Every tracked route must emit exactly one `page_view` hit.
- `cid` (client id) must be present on pageview hits.
- `sid` (session id) must be present on pageview hits.
- Redirect routes must track the final canonical path.

## Required Verification

- Run `npm run ai:analytics:verify` before claiming analytics work is complete.
- Output is written to `reports/analytics-verification/<timestamp>/`.
- A change is not done unless the command returns PASS and artifacts exist.

## Guardrails

- Any change in `app/layout.tsx`, `components/analytics-tracker.tsx`, `next.config.js`, or GTM snippet requires analytics verification.
- If GA4 suddenly diverges from Vercel analytics, run:
  1. `npm run ai:analytics:verify`
  2. `npm run ai:verify`
  3. Compare artifacts before/after commit.

## Notes

- Dev can show transient network noise; prioritize production-like checks when possible.
- CSP policy changes for Google/traffic-quality domains must be validated with analytics verification artifacts.
