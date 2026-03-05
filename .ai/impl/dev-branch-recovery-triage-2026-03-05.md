# Dev Branch Recovery Triage (2026-03-05)

Purpose: preserve all prior work while keeping a clean, low-risk integration lane from `main`.

## Recovery Status

- Safety snapshot branch (frozen history): `backup/dev-snapshot-20260305-pre-recovery`
- Active clean integration branch: `dev-recovery-20260305`
- Base: `origin/main`

## Already Salvaged To Recovery Branch

1. `ad9c2e4` - `feat(enrichment): include retail_price in Item Cache merge policy`
2. `a53f42a` - `feat(enrichment): add cade-fast-track script and make manual-enrich skip-if-missing`
3. `e781cb3` - `feat(monumetric): salvage balanced stabilization plans and S1 lifecycle guardrails`
4. `5504ac8` - `chore(monumetric): trim layout salvage to lifecycle-only changes`
5. `5e42b3d` - `docs(ai): record recovery branch continuity and branch-policy override`

## Keep-Later (Candidate Cherry-Picks)

These are useful but should be picked in narrow bundles only.

- `2c09d77` - docs/skills/manual-workflow codification (mostly docs; low runtime risk).
- `3d7e826` - Roo carryover rule clarification (docs-only process guidance).
- `c9390bb` - responsive foundations plan docs (planning-only; no runtime impact).
- `afb0246` - UX redesign requirements doc (planning-only; no runtime impact).

## Requires Founder Review Before Any Cherry-Pick

These contain product-facing UX/layout changes and should not be merged blind.

- `f4912a0` - mobile safe-area + layout/nav related styling behavior.
- `46a7dd2` - canonical guide long-form runtime implementation.
- `1f3059d` - homepage proof media fallback changes.
- `fdbc857` - homepage proof-first front door rebuild.
- `9cc9800` / `03820de` - guide/faq content-direction changes.

## Likely Leave Parked / Do Not Promote

These are tooling/experimental history that should stay in the snapshot branch unless explicitly requested.

- Roo mode/research pipeline commits (`2516538`, `df6781b`, `567c127`, `88a9282`, `2676edd`, `523f630`, `09c3bdb`, `1d18eb1`).
- Local copilot/workflow scaffolding commits not required for production runtime (`2843e20`, `901555a`).
- Archive-only cleanup commits not tied to current product goals (`d45d88f`, `b77e904`, `3a3a11b`, `5d3b164`).

## Verification Snapshot (Recovery Branch)

- `npm run ai:memory:check` = pass
- `npm run verify:fast` = pass
- `npm run e2e:smoke` = pass
- `npm run e2e:full` = partially improved:
  - visual-pointer capture lane fixed by enabling `NEXT_PUBLIC_VISUAL_POINTER_ENABLED=true` in script.
  - still blocked by live-console critical CSP finding (`www.google-analytics.com`) on production routes `/store-finder` and `/about`.

## Next Safe Step

- Continue implementation only on `dev-recovery-20260305`.
- Treat old `dev` as parked historical source; cherry-pick only from this triage map with narrow scope and verification per slice.
