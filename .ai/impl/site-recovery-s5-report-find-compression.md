# Site Recovery S5 - Report Find Compression

**Status:** Approved (Not Implemented)  
**Depends on:** `S2` homepage proof front door  
**Owner:** AI agents  
**Last updated:** 2026-03-02

## Summary

Reduce pre-form cognitive load on `/report-find` while preserving report quality, trust signals, and bulk-report usefulness.

## Why This Slice Exists

The page is directionally better than it was, but it still asks users to process too much context before they act. Returning users should be able to start quickly, while new users still get just enough guidance to avoid bad submissions.

## Locked Product Decisions

- The form remains trustworthy and guided.
- The page should not force users through a wall of text before the first real action.
- Bulk reporting stays first-class.
- Guidance should move closer to the moment it matters instead of clustering above the form.
- This slice is about compression and placement, not new reporting features.

## Exact Files To Modify

1. `app/report-find/page.tsx`
2. `components/report-find/ReportFindFormClient.tsx`
3. `tests/smoke-critical.spec.ts`
4. `tests/visual-smoke.spec.ts`

## Planned Changes

### Above-form budget

- cap the above-form intro to one short trust/value statement,
- keep one compact preparation checklist,
- avoid multiple stacked explanation cards before the user reaches input.

### Guidance placement

- keep only the highest-value requirements above the form,
- move secondary explanation into field-level helper text or adjacent inline guidance,
- keep a single optional "what makes a good report?" secondary disclosure if needed.

### Bulk-report clarity

- preserve the basket-based multi-item flow,
- keep bulk reporting visible near the first interaction point,
- do not hide multi-item capability below explanatory copy.

### Context links

- keep support links back to `/penny-list` and `/guide`,
- reduce them to a brief supporting line instead of a larger competing section.

## Acceptance Criteria

- A returning user can begin a report faster than on the current page.
- A new user still understands the minimum requirements for a useful report.
- The page feels lighter before the form without feeling careless.
- Submission flow and bulk entry still work as before.

## Verification

- `npm run verify:fast`
- `npm run e2e:smoke`
- desktop + mobile screenshots
- form submission smoke path still passes

## Rollback

- Revert only the `/report-find` copy/layout changes and related test updates.

## Risks / Watchouts

- Over-compression could reduce data quality if critical rules disappear entirely.
- Do not solve the problem by hiding information that users actually need; move it closer to the point of action instead.
