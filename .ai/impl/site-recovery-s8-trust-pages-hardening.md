# Site Recovery S8 - Trust Pages Hardening

**Status:** Approved (Not Implemented)  
**Depends on:** `S2` homepage proof front door, `S3` guide core rebuild  
**Owner:** AI agents  
**Last updated:** 2026-03-02

## Summary

Make `/about` and `/transparency` feel intentional, specific, and trust-building instead of merely present.

## Why This Slice Exists

Trust pages matter most for first-time organic visitors, sponsor/ad reviewers, and skeptical users. Right now `/about` is human but not fully product-anchored, and `/transparency` is too thin for the trust burden it carries.

## Locked Product Decisions

- `/about` stays founder-led and human.
- `/transparency` must become concrete and specific, not generic disclosure filler.
- Trust pages should reinforce legitimacy for organic visitors without sounding corporate or synthetic.
- This slice does not redesign legal policy pages.

## Precondition

Before editing `/transparency`, review the current live monetization reality so the page does not drift from active behavior:

- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
- current live routes that expose ads or affiliate behavior

If the live monetization picture has changed, update the copy to match reality exactly. Do not write speculative disclosure copy.

## Exact Files To Modify

1. `app/about/page.tsx`
2. `app/transparency/page.tsx`
3. `tests/smoke-critical.spec.ts`
4. `tests/visual-smoke.spec.ts`

## Planned Changes

### `/about`

- keep the founder/community origin story,
- tighten the relationship between founder story and site standards,
- make the page do more credibility work for first-time visitors,
- preserve the human tone.

### `/transparency`

- expand beyond a thin "funded by advertising" statement,
- state what revenue can and cannot influence,
- make the page specific enough that it no longer reads like a placeholder,
- add a visible update signal if needed.

## Acceptance Criteria

- `/about` supports credibility without bloating.
- `/transparency` reads as a real disclosure page rather than a token page.
- Both routes align with the proof-driven field-guide tone of the recovery program.

## Verification

- `npm run verify:fast`
- `npm run e2e:smoke`
- screenshots for both routes

## Rollback

- Revert trust-page changes independently from other slices.

## Risks / Watchouts

- `Transparency` copy that is vague is nearly as bad as missing copy.
- `Transparency` copy that is more specific than reality is worse than both.
- Keep this slice grounded in live behavior, not planned future monetization.
