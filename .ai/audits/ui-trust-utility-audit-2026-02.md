# UI Trust + Utility Audit (2026-02)

Date: 2026-02-11
Scope routes:

- `/`
- `/penny-list`
- `/report-find`
- `/sku/[sku]`
- `/guide`
- `/store-finder`
- `/about`
- `/support`

Method:

1. Source-level audit from route/component code.
2. Dimension scoring (1=weak, 5=strong).
3. No runtime screenshot pass in this document (follow-up Playwright capture recommended before visual remediations).

## Dimension Rubric

- First-impression trust
- Clarity of value proposition
- Scan speed / hierarchy
- In-store usability friction
- CTA discipline
- Mobile ergonomics
- Design token consistency

## Route Findings

| Route           | Trust | Value clarity | Scan speed | In-store friction | CTA discipline | Mobile ergonomics | Token consistency | Notes                                                                                                                     |
| --------------- | ----- | ------------- | ---------- | ----------------- | -------------- | ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/`             | 4     | 5             | 3          | 4                 | 2              | 4                 | 5                 | Value prop is clear and founder/community credibility exists; CTA density is high (multiple primary paths on one screen). |
| `/penny-list`   | 5     | 5             | 4          | 5                 | 4              | 4                 | 5                 | Strong trust framing (live lead board disclaimer + methodology); useful signal blocks are clear.                          |
| `/report-find`  | 3     | 5             | 4          | 4                 | 4              | 4                 | 5                 | Fast form flow is strong; trust hit from placeholder SKU-help images ("[...placeholder]").                                |
| `/sku/[sku]`    | 4     | 4             | 4          | 4                 | 4              | 4                 | 5                 | Good structured details and social proof; trust could improve with stronger freshness/context microcopy above fold.       |
| `/guide`        | 5     | 4             | 3          | 4                 | 3              | 4                 | 5                 | Strong authority voice and structure, but long-form density can slow scanning for urgent in-store users.                  |
| `/store-finder` | 3     | 4             | 3          | 3                 | 4              | 3                 | 4                 | Functional breadth is high; auto-geolocation + alert-based errors and dense UI increase friction/risk on mobile.          |
| `/about`        | 5     | 4             | 4          | 3                 | 3              | 4                 | 5                 | Authentic founder story is excellent trust signal; product utility linkage could be tighter.                              |
| `/support`      | 5     | 4             | 4          | 3                 | 4              | 4                 | 5                 | Transparency and funding disclosure are clear; utility-specific help actions are secondary.                               |

## Cross-Route Themes

1. Trust strengths:
   - Founder/community authenticity is strong on `/about`, `/guide`, `/support`.
   - Operational disclaimers on `/penny-list` reduce false certainty risk.
2. Trust gaps:
   - Placeholder assets on `/report-find` undermine perceived maturity.
   - `/store-finder` interaction model can feel brittle (auto-location, alert fallbacks).
3. Utility strengths:
   - `/penny-list` and `/report-find` align tightly with the core loop.
4. Utility gaps:
   - Homepage CTA stack is broad, diluting first-action focus.
   - Guide scanning rhythm can be heavy for time-constrained store runs.

## Design-System Consistency Notes

1. Most audited routes use tokenized styles (`var(--...)`) or semantic aliases.
2. `/store-finder` mixes token vars and shadcn semantic classes heavily; not a hard violation, but increases style-governance audit complexity.

## Business Impact Summary

1. Highest leverage is improving trust/clarity around report quality and first action focus.
2. Secondary leverage is reducing in-store execution friction on map/search surfaces.
3. Current baseline is solid for trust narrative, but execution UX can be sharper for repeat utility behavior.
