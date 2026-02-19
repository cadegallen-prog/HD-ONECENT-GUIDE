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

## Resilience + Diversification KPI Set (Founder Priority)

Use these as weekly decision metrics for contingency progress:

- `non_fb_session_share`
  - Definition: percent of sessions not sourced from Facebook.
  - Goal direction: up and stable over rolling 4-week windows.
- `non_branded_organic_clicks`
  - Definition: Search Console clicks excluding branded terms.
  - Goal direction: consistent upward trend.
- `adjacent_intent_session_share`
  - Definition: percent of sessions landing on non-penny-adjacent educational/decision pages.
  - Goal direction: up without degrading core-loop metrics.
- `core_loop_guardrail_submit_rate`
  - Definition: `find_submit / report-find views`.
  - Goal direction: stable or improving while diversification expands.
- `core_loop_guardrail_report_find_click_rate`
  - Definition: `report_find_click / penny-list views`.
  - Goal direction: stable or improving while diversification expands.

Operational rule:

- Do not claim diversification success if non-Facebook growth rises while core-loop guardrails collapse.
- Diversification is valid only when growth and trust-loop metrics can coexist.

## Event Param Naming Standard (Monetization-Safe)

- UI attribution params must use `ui_source` (preferred) or `placement`.
- Do not emit raw GA acquisition-like keys on custom events:
  - `source`
  - `medium`
  - `campaign`
- Analytics sanitizer (`lib/analytics.ts`) is the safety net:
  - `source -> pc_source`
  - `medium -> pc_medium`
  - `campaign -> pc_campaign`
  - legacy `src` and `source` normalize into `ui_source` when needed.
- Dashboard/report definitions for experiment analysis must read `ui_source` (not `source`).

## Required Verification

- Run `npm run ai:analytics:verify` before claiming analytics work is complete.
- Output is written to `reports/analytics-verification/<timestamp>/`.
- A change is not done unless the command returns PASS and artifacts exist.
- For Monumetric launch decision windows, run:
  - `npm run monumetric:guardrails -- --input <window-metrics.json>`
  - Store artifacts under `reports/monumetric-guardrails/<timestamp>/`.

## Guardrails

- Any change in `app/layout.tsx`, `components/analytics-tracker.tsx`, `next.config.js`, or GTM snippet requires analytics verification.
- Any change to event attribution keys or analytics payload names requires `tests/analytics.test.ts` to stay green.
- If GA4 suddenly diverges from Vercel analytics, run:
  1. `npm run ai:analytics:verify`
  2. `npm run ai:verify`
  3. Compare artifacts before/after commit.

## Notes

- Dev can show transient network noise; prioritize production-like checks when possible.
- CSP policy changes for Google/traffic-quality domains must be validated with analytics verification artifacts.
