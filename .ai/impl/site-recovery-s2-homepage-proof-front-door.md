# Site Recovery S2 - Homepage Proof Front Door

**Status:** Approved (Not Implemented)  
**Depends on:** `S1` hydration stability  
**Owner:** AI agents  
**Last updated:** 2026-03-02

## Summary

Rebuild the homepage into a proof-first front door that tells a first-time visitor what Penny Central is, why it is real, and what to do next within the first screen.

## Why This Slice Exists

The current homepage is not failing because it lacks words. It is failing because it lacks a clear focal point, lacks concrete proof above the fold, and feels too generic for a niche product with real community data.

## Current State

- `app/page.tsx` already fetches `recentFinds` with `getRecentFinds(48)`.
- The current hero is centered, text-first, guide-first, and visually passive.
- `TodaysFinds` is present, but the strongest proof lives below the fold instead of anchoring the first impression.

## Locked Product Decisions

- The homepage is not a generic education page.
- The homepage must prove value before it asks for belief.
- The first screen must contain concrete proof, not abstract explanation.
- The homepage presents exactly two primary paths:
  - `Learn how it works`
  - `Check the Penny List`
- Proof imagery must be sourced from real product imagery, real reported finds, or UI-derived evidence. No stock-photo filler.
- The guide remains important for beginners, but it no longer gets a soft monopoly on homepage attention.

## Exact Files To Modify

### Core implementation slice

1. `app/page.tsx`
   - keep server data fetch
   - replace the current hero and supporting section order

2. `components/home/HomeProofHero.tsx` (new)
   - render the new above-the-fold hero

3. `components/home/HomeProofStrip.tsx` (new)
   - render real find imagery / proof cards sourced from recent finds

4. `components/home/HomePathSplit.tsx` (new)
   - render the two primary route choices with explicit intent split

5. `tests/visual-smoke.spec.ts`
   - add desktop/mobile assertions for the new homepage hierarchy

### Optional follow-on cleanup only if still needed after the core slice

- `components/todays-finds.tsx`
- `tests/smoke-critical.spec.ts`

Do not touch those files unless the new homepage hero creates duplication or stale expectations that cannot be resolved in `app/page.tsx` alone.

## Layout Decision

- **Desktop:** split hero with copy on the left and proof cluster on the right.
- **Mobile:** stacked layout with copy first and proof cluster immediately below it.
- The first visual emphasis must come from proof and hierarchy, not from adding decorative noise.

## Data / Proof Contract

Reuse the existing `getRecentFinds(48)` result in `app/page.tsx`.

From that dataset, derive the hero proof layer:

- latest recent-find count,
- state diversity if available,
- 2-3 recent proof cards,
- actual item imagery when present.

Fallback rule:

- If the dataset lacks enough strong images, fall back to one strong live-data proof card plus UI-derived evidence.
- Do not invent placeholder imagery.

## Content Structure

### Above the fold

- strong promise line centered on real, current community finds,
- short supporting line that explains what the site helps users do,
- proof cluster,
- two primary CTAs only.

### Below the fold

- compact "how it works" continuation,
- founder/community credibility strip,
- `TodaysFinds` continuation only if it still adds value after the new hero proof layer,
- no large block explaining site structure before proof has already landed.

## CTA Rules

- Primary filled CTA: `Learn how it works`
- Secondary outline CTA: `Check the Penny List`
- No third co-equal CTA in the hero.
- Store Finder does not get hero-level priority in this slice.

## Visual Rules

- Use existing token colors only.
- Do not default to a centered marketing-landing-page layout.
- Use asymmetry, real imagery, and deliberate emphasis.
- Motion, if any, should be restrained and purposeful.

## Acceptance Criteria

- A first-time visitor can tell what the site is within 5 seconds.
- The page has a clear focal point above the fold.
- The page looks specific to Penny Central rather than like a generic blog homepage.
- The Penny List is visibly validated without forcing raw-table-first behavior.
- The guide still has a strong path for beginners without burying live proof.

## Verification

- `npm run verify:fast`
- `npm run e2e:smoke`
- Playwright desktop + mobile screenshots
- Founder review against the current failure list:
  - bland,
  - generic,
  - no focal point,
  - no proof,
  - nothing eye-catching

## Rollback

- Revert the homepage-specific components and `app/page.tsx` changes only.
- Do not mix homepage rollback with later guide or typography slices.

## Risks / Watchouts

- It is easy to add more copy and still fail this slice.
- The hero must not become a design exercise disconnected from live proof.
- Avoid turning the proof area into a busy collage that hurts readability on mobile.
