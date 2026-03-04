# Skill: Manual Enrichment vs Cade Fast-Track

Use this when working with founder-provided JSON and you need to pick the correct path without wasting SerpAPI credits.

## Two different workflows

### 1) `manual:enrich` (enrich only)

Use when:

- The SKU is already on `Penny List`.
- The row exists but has missing enrichment fields (name, brand, image, internet SKU, etc.).

Behavior:

- Upserts `enrichment_staging` (Item Cache).
- Applies enrichment to existing `Penny List` row(s).
- **Does not create new `Penny List` entries.**
- Skips SKUs with no existing Penny List row.

Command:

- `npm run manual:enrich`

### 2) `manual:cade-fast-track` (founder direct submit)

Use when:

- Cade already scraped the items and wants to submit directly.
- We want to bypass form friction and avoid SerpAPI credit spend.

Behavior:

- Upserts `enrichment_staging` (Item Cache).
- Creates new `Penny List` rows directly.
- Defaults: `store_city_state=Georgia`, `status=complete`, `exact_quantity_found=0`.
- Applies Item Cache enrichment to created rows.
- **No SerpAPI calls in this path.**

Command:

- `npm run manual:cade-fast-track`

## Payload shape

Both commands accept:

1. Single object JSON
2. Array JSON
3. Keyed object map (`{"1001234567": {...}}`)

## Guardrails

- Keep identity rules intact: SO SKU is alias; store SKU is display SKU; `internet_sku` is canonical merge key.
- Do not use `manual:enrich` when the goal is to create new rows.
- Do not run scrape fallback for founder-provided pre-scraped payloads.

## Founder translation

- "Enrich existing item" → `manual:enrich`
- "Submit my scraped finds now" → `manual:cade-fast-track`
