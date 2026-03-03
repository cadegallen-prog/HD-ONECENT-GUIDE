# Site Recovery S1 - Hydration Stability

**Status:** Shipped  
**Depends on:** `S0` planning spine  
**Owner:** AI agents  
**Last updated:** 2026-03-03

## Summary

Remove the global dev hydration mismatch and the known Penny List text mismatch before any visual redesign slice proceeds.

## Completion Note

Implemented on 2026-03-03 with the following outcomes:

- `app/layout.tsx` now loads Grow via `next/script` with `afterInteractive`, so the root `<head>` no longer gets mutated before hydration.
- `lib/penny-list-utils.ts` now protects `DIY` in the uppercase safety list.
- `tests/visual-smoke.spec.ts` now audits all nine recovery routes for hydration mismatch console noise.
- `tests/smoke-critical.spec.ts` now fails if Penny List text renders `Diy`, and unit coverage was added in `tests/penny-list-utils.test.ts` for mixed-case input.

## Why This Slice Exists

The current hydration noise is undermining confidence across multiple routes. It also makes visual work harder to evaluate because console errors can mask or distract from real regressions.

This slice is deliberately narrow:

- fix the global head/script mismatch,
- fix deterministic Penny List text rendering,
- add stable regression coverage for the audited routes.

## Current State

- `app/layout.tsx` server-renders JSON-LD and then runs a Grow initializer that injects `https://faves.grow.me/main.js` before the first `<script>` in the document.
- That mutates `<head>` order before React hydration completes.
- `/penny-list` also shows a visible `DIY` -> `Diy` mismatch because `normalizeProductName(...)` restores some acronyms but not `DIY`.

## Locked Technical Decisions

- JSON-LD remains server-rendered and stable in `<head>`.
- The current Grow bootstrapping pattern that mutates head order before hydration must be removed.
- Grow should be loaded with a hydration-safe pattern using `next/script`, not DOM insertion before the first `<script>`.
- The Penny List casing fix lives in `normalizeProductName(...)`; do not patch display components unless the helper contract changes, which this slice forbids.
- Analytics/Grow behavior should be preserved functionally unless a clearly documented provider limitation forces a tradeoff.

## Exact Files To Modify

1. `app/layout.tsx`
   - import `Script` from `next/script`
   - replace the inline Grow DOM-insertion initializer
   - keep JSON-LD stable
   - preserve analytics ordering intentionally

2. `lib/penny-list-utils.ts`
   - update `normalizeProductName(...)`
   - add `DIY` to the protected uppercase word set

3. `tests/visual-smoke.spec.ts`
   - add or extend a route sweep that fails on hydration mismatch console noise for the audited routes

4. `tests/smoke-critical.spec.ts`
   - pin a visible Penny List text expectation so `DIY` remains uppercase in a real rendered surface

## Files Explicitly Not To Modify By Default

- `components/penny-list-card.tsx`
- `components/penny-list-table.tsx`

These are read-only consumers for this slice unless a test failure proves the helper contract is insufficient. The default implementation should not touch them.

## Implementation Plan

### Step 1 - Make Grow hydration-safe

In `app/layout.tsx`:

- remove the current raw `<script data-grow-initializer="">...insertBefore(...)</script>` block,
- add a `next/script` inline bootstrap with `strategy="afterInteractive"` that only initializes `window.growMe` and its queue,
- add a separate `next/script` remote loader with `strategy="afterInteractive"` for `https://faves.grow.me/main.js`,
- keep the `data-grow-faves-site-id` attribute on the remote script,
- do not insert any script relative to `document.getElementsByTagName("script")[0]`.

Implementation rule: React must hydrate against a stable server-rendered head.

### Step 2 - Keep JSON-LD stable

- Leave the JSON-LD blocks server-rendered.
- Do not move JSON-LD into client-only code.
- Do not reorder JSON-LD beneath Grow just to hide the mismatch. The bug is the mutation pattern, not the schema content.

### Step 3 - Fix Penny List text determinism

In `lib/penny-list-utils.ts`:

- add `DIY` to the uppercase safety list,
- keep the existing acronym-restoration pattern,
- do not change `normalizeProductName(...)` function signature,
- do not change truncation or brand-removal behavior in this slice.

### Step 4 - Add regression coverage

In `tests/visual-smoke.spec.ts`:

- add a route loop covering:
  - `/`
  - `/guide`
  - `/penny-list`
  - `/report-find`
  - `/faq`
  - `/what-are-pennies`
  - `/store-finder`
  - `/about`
  - `/transparency`
- fail the test if console output includes the current hydration mismatch signature or other unexpected console errors.

In `tests/smoke-critical.spec.ts`:

- add a targeted expectation that confirms at least one rendered Penny List item retains uppercase `DIY` when present.

## Acceptance Criteria

- No hydration mismatch appears in console output for the audited routes.
- The root layout head order remains stable between SSR and hydration.
- `/penny-list` no longer shows `DIY` rendered as `Diy`.
- No analytics or Grow regressions are introduced intentionally or accidentally.

## Verification

- `npm run verify:fast`
- `npm run e2e:smoke`
- Playwright desktop + mobile proof for the audited routes
- Console capture with zero unexpected hydration errors

## Rollback

- Revert the `app/layout.tsx` script-loading change and the `lib/penny-list-utils.ts` acronym-list change together.
- Revert the related test updates as part of the same slice if rollback is required.

## Risks / Watchouts

- `app/layout.tsx` is a high-sensitivity file because analytics and third-party loading live there.
- A "working" Grow integration is not enough if it still mutates head order pre-hydration.
- Console assertions should ignore known benign warnings only if they are explicitly documented in the test file; do not add broad catch-all ignores.
