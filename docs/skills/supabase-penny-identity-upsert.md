# Skill: Supabase Penny Identity + Upsert Guardrails

Use this when Penny List behavior looks inconsistent across SKU variants, especially **Store SO SKU** vs regular store SKU.

## Canonical identity rules

- **Store SO SKU** = alias path (not a separate product identity).
- **Store SKU number** = regular SKU shown in UI.
- When present, **`internet_sku` is canonical identity** for merging rows and report counts.
- If `internet_sku` is missing, fallback identity is normalized SKU.

## What this prevents

- Split cards for the same product (`0 reports` on one card, real reports on another).
- Wrong report totals caused by SO SKU and regular SKU being treated as different items.
- Confusion where metadata upsert succeeds but report/location aggregation still looks wrong.

## Canonical implementation locations

- Aggregation + merge behavior: `lib/fetch-penny-data.ts`
  - `buildAggregationKey(...)`
  - `choosePreferredDisplaySku(...)`
- Manual upsert flow: `scripts/manual-enrich.ts`
  - internet-number uniqueness conflict fallback update logic

## Operational guidance for agents

1. For manual updates, use `npm run manual:enrich` first.
2. If SO/regular SKU mismatch exists, ensure rows share the same `internet_sku`.
3. Verify card/report behavior after update (do not assume metadata patch alone fixes aggregation).
4. Explain results in founder language: "same product identity" vs "separate rows".

## Wrong-field input triage (UPC/model entered as SKU)

- Do not force suspicious SKU text into canonical identity.
- If input resembles UPC/model contamination (for example non-SKU length/pattern), treat it as wrong-field input.
- Correct to the real store SKU when possible, and keep identity linkage via `internet_sku`.
- If real SKU cannot be determined from reliable fields, mark as unresolved and request corrected SKU instead of creating a bad split identity.

## Fast diagnosis checklist

- Do both rows have the same `internet_sku`?
- Are you seeing two different raw SKUs for the same product (`6-digit` + `10-digit`)?
- Does one row have non-state location text (for example `Manual Add`) that yields no state count?
- After patching identity, does list aggregation collapse to one product item?
