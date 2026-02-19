# RESILIENCE_GROWTH_CURRENT

**Status:** 🔄 In progress (Phase 1 active; R1 + R2 + R3 completed)  
**Last updated:** 2026-02-19

---

## 0) Repo context snapshot

- **Framework/runtime:** Next.js 16 App Router + TypeScript
- **Auth:** optional magic-link flow for My List (`/login`, `/lists`, `/s/[token]`)
- **Primary data sources:**
  - Supabase `Penny List` (public read via `penny_list_public`)
  - enrichment overlay/staging (`enrichment_staging`)
  - saved list tables (`lists`, `list_items`, `list_shares`)
- **Current business concentration risk:**
  - product utility is heavily penny-item centered
  - monetization is still in approval/activation transitions
  - organic non-branded SEO remains weak
- **Hard constraints:** trust-first UX, no manipulative engagement patterns, no dependency/additional infra by default, founder cognitive-load protection.

---

## 1) User-facing surfaces (what exists today)

- **Core utility loop routes:**
  - `/guide`
  - `/penny-list`
  - `/report-find`
  - `/sku/[sku]`
- **Supplementary routes:**
  - `/store-finder`, `/faq`, trust/legal pages
- **Entry points:**
  - homepage hero + tools cards (`app/page.tsx`)
  - primary nav (`components/navbar.tsx`)
  - footer nav (`components/footer.tsx`)
- **Retention surfaces already present:**
  - weekly digest system (`/api/cron/send-weekly-digest`)
  - email signup + unsubscribe routes (`/api/subscribe`, `/api/unsubscribe`)

---

## 2) Data flow (read/write)

- **Read paths:**
  - server fetches from `lib/fetch-penny-data.ts`
  - list API: `app/api/penny-list/route.ts`
  - SKU details: `app/sku/[sku]/page.tsx`
- **Write paths:**
  - submissions: `app/api/submit-find/route.ts`
  - subscriptions: `app/api/subscribe/route.ts`
- **Trust/data quality controls already active:**
  - SKU validation (`lib/sku.ts`)
  - anti-spam guardrails in submit flow
  - item-name quality heuristics (`lib/item-name-quality.ts`)

---

## 3) Mobile + accessibility baseline

- Mobile-first nav and guide progression already established.
- Current guardrails require 44x44 minimum touch targets and token-based color usage.
- Existing utility flow already optimized for in-store use; diversification should not regress scan speed or submission flow quality.

---

## 4) Strengths / pain points

### Strengths

- Strong founder voice + lived domain knowledge.
- High-signal community contribution loop already operating.
- Trust-oriented guidance system already shipped and structured.
- Existing guide infrastructure can host additional educational pillars without immediate platform rewrite.

### Pain points

- Strategy is still concentrated on a single retailer policy environment (Home Depot penny mechanics).
- No formalized "worth it vs skip it" decision framework despite founder expertise.
- New-user overwhelm risk remains high when complexity is not layered.
- Traffic/revenue independence from Facebook and penny-only demand is not yet institutionalized.

---

## 5) Existing infrastructure to reuse (for diversification)

- **Route/content shell reuse:** `app/guide/*`, existing chapter component model under `components/guide/sections/*`.
- **Navigation/IA reuse:** `components/navbar.tsx`, `components/footer.tsx`, command palette.
- **Data reuse:** `Penny List` recency/state signals for evidence-backed examples.
- **Analytics reuse:** `lib/analytics.ts`, `.ai/topics/ANALYTICS_CONTRACT.md`.
- **Distribution reuse:** existing email digest + subscribe pipeline.

---

## 6) Strategic decisions locked by founder context

1. Growth must not trade away truth/trust.
2. Power users and beginners must both be served (layered depth model).
3. Founder cognitive load is a first-class constraint; default to single next action.
4. Diversification must be additive and survivable, not abrupt.
5. Objective is security and independence: website should grow with or without Facebook dominance and with reduced dependency on penny-item permanence.

---

## 7) Phase execution snapshot

- `R1` completed (guide-hub Worth-It Filter scaffold live on `/guide`).
- `R2` completed (diversification KPI contract hardened in `.ai/topics/ANALYTICS_CONTRACT.md` with locked formulas, thresholds, and fail-closed interpretation rules).
- `R3` completed (founder-approved Option B balanced discoverability):
  - homepage Decision Quality shortcut block on `/`,
  - guide-hub Decision Quality next-step block on `/guide`,
  - one new `Decision Quality` navbar entry to `/in-store-strategy`,
  - one matching footer discoverability link.
- Next queued task from canonical plan: `R4` weekly "Decision Quality" digest section spec (planning/docs lane).

---

## 8) Immediate next actions

1. On **2026-02-26**, run the first valid post-R1 7-day guardrail check (`report_find_click`, `find_submit`) using the R2 fail-closed thresholds.
2. Execute `R4` planning spec work for the weekly "Decision Quality" digest section (no runtime change).
3. Preserve core Penny List + Report a Find loop while evaluating discoverability impact.

---

## 9) R1 Guardrail Validation Status (as of 2026-02-19)

- Status: `INCONCLUSIVE` (expected and compliant with fail-closed rules).
- Reason:
  - `R1` shipped on **2026-02-19**, so a 7-day post-change window does not exist yet.
  - Earliest valid comparison date for "last 7 days vs prior 7 days" is **2026-02-26**.
- Available evidence snapshot:
  - `reports/monumetric-guardrails/2026-02-12T04-25-49-803Z/summary.md` (pre-R1 baseline context only; not usable for post-R1 success/failure claims).
