# Backlog (AI-Driven, Ordered)

**Last updated:** Dec 26, 2025
Keep this list short and ruthless (≤10 items).

Each AI session should:
1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Propose approach in plain English
4. Implement + test
5. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

---

## P0 - Do Next (Product Features)

### 1. Penny List performance: windowed Supabase reads

- Stop fetching the entire `Penny List` table when the user is viewing a finite date window (e.g., 1m/6m/12m). Filter Supabase reads to the selected window *before* aggregating by SKU.
- Acceptance: still returns correct totals/tiers for the selected window; API pagination unchanged; no regressions in unit/e2e; no new dependencies.

### 2. Guide Visual Upgrade (Clearance Cadence)

- Add visual timeline and captioned tag examples in the existing Guide section; store assets in `/public`, reuse current layout.
- Acceptance: responsive, alt text present, no new routes.

### 3. Bookmarklet image harvest (support)

- Support Cade's plan to collect image URLs via the bookmarklet for newly added items.
- Acceptance: ingestion stays private (no exports committed), instructions updated if tooling changes, and new images flow into Penny List/SKU pages without exposing private inputs.

---

## P1 - Fresh Content & Verification

### 4. "Today's Penny Finds" Homepage Section

- **Why:** Daily fresh content = daily visits. Homepage should show what's new immediately.
- **What:** Prominent section showing items added in last 24-48 hours
- **Done means:**
  - Homepage has "Today's Finds" section after hero
  - Horizontal carousel (mobile) / grid (desktop)
  - Shows: image, item name, state badges, "X hours ago"
  - CTA: "See all penny finds →"
- **Files:** NEW: `components/todays-finds.tsx` | MODIFY: `app/page.tsx`, `lib/fetch-penny-data.ts`

### 5. Verification Badge System

- **Why:** Add credibility without fragmenting data
- **What:** Admin-controlled "Verified by Penny Central" badges on items Cade personally confirms
- **Done means:**
  - PennyItem type has `verified`, `verifiedDate`, `verifiedSource` fields
  - Verified badge UI in cards
  - "Verified only" filter option
  - `data/verified-skus.json` file for Cade to populate
  - Verification enriches existing crowdsourced list (not separate list)
- **Files:** NEW: `data/verified-skus.json` | MODIFY: `lib/fetch-penny-data.ts`, `components/penny-list-card.tsx`, `components/penny-list-filters.tsx`

---

## P2 - SEO Expansion & AI Infrastructure

### 6. Individual SKU Pages

- **Why:** Every SKU = unique page = massive SEO surface area (could 10x organic traffic)
- **What:** `/sku/[id]` dynamic pages
- **Done means:**
  - Dynamic route: `/sku/1234567890`
  - Page shows: product image, item name, all reports, state map, tier, verified badge
  - SEO optimized title/description
  - "Report this SKU" CTA
  - Related items section
- **Files:** NEW: `app/sku/[id]/page.tsx`, `app/sku/[id]/layout.tsx`

### 7. State Landing Pages

- **Why:** Geographic SEO targeting ("florida home depot penny items")
- **What:** `/pennies/[state]` pages
- **Done means:**
  - State-specific pages (e.g., `/pennies/florida`)
  - Auto-filtered to show only that state's items
  - State map with HD locations
  - "X items found in Florida this week" stat
  - SEO optimized
- **Files:** NEW: `app/pennies/[state]/page.tsx`

### 8. Parallel Agent Patterns (AI Infrastructure)

- **Why:** Enable faster completion of multi-file tasks by coordinating multiple AI agents
- **What:** Document when/how to split work across agents without conflicts
- **Done means:**
  - Clear guidance on task types suitable for parallelization
  - File ownership rules to prevent conflicts
  - Coordination protocol for handoffs
- **Reference:** See git history of `.ai/AI_AUTOMATION_SPECS.md` for detailed patterns

### 9. Session Start/End Skills

- **Why:** Consistent session discipline across all AI tools
- **What:** `/session-start` and `/session-end` slash commands
- **Done means:**
  - `/session-start`: Read docs, run ai:doctor, capture GOAL/WHY/DONE
  - `/session-end`: Run ai:verify, update SESSION_LOG, update STATE
- **Files:** NEW: `.claude/commands/session-start.md`, `.claude/commands/session-end.md`

### 10. Fixture Mode Expansion

- **Why:** Deterministic tests that don't depend on external services
- **What:** Expand `PLAYWRIGHT=1` fixture mode to cover all external dependencies
- **Done means:**
  - All Supabase calls return fixtures when `PLAYWRIGHT=1`
  - Geocoding returns cached coordinates
  - No flaky tests due to network issues
- **Reference:** See git history of `.ai/AI_AUTOMATION_SPECS.md` for implementation patterns

---

## P3 - Later / Only If Metrics Justify

### "Last Updated" Timestamp

- **Why:** Builds trust, shows freshness
- **What:** Display when penny list data was last refreshed
- **Files:** MODIFY: `app/penny-list/page.tsx`, `lib/fetch-penny-data.ts`

### Image Upload to Submission Form

- **Why:** User-generated images = authenticity + social proof
- **What:** Optional photo upload for receipts/products
- **Done means:** Cloudinary/Uploadthing integration, moderation before public display
- **Files:** MODIFY: `app/report-find/page.tsx`, NEW: image upload API

### Optional moderation gate

- Add "Approved" column in Sheet and filter server-side.
- Only do this if spam/junk exceeds ~10%.

---

## By Goal (Growth-Focused)

> **Note:** See `.ai/GROWTH_STRATEGY.md` for complete context on Cade's business goals and constraints.

### SEO (Organic Growth) - HIGH PRIORITY

- [ ] Individual SKU pages (/sku/[id]) - Could 10x traffic
- [ ] State landing pages (/pennies/[state]) - Geographic targeting
- [ ] Add Article schema to guide pages
- [ ] Add BreadcrumbList schema to navigation

### Engagement (Time on Site) - MEDIUM PRIORITY

- [ ] Related items suggestions on penny cards
- [ ] Cross-link guides ("You might also like")
- [ ] "Today's Finds" homepage section

### Revenue (Passive Income) - LOW PRIORITY, BE TASTEFUL

- [ ] Penny hunting gear page (genuine recommendations only)
- [ ] Amazon Associates integration

### Email Newsletter - DEFERRED

- [ ] Make ConvertKit signup visible
- **Why deferred:** No value prop yet. Revisit when fresh daily content exists.

---

## Strategic Goal

Convert one-time visitors into daily habitual users.

**Key Metrics to Track:**
- Returning visitors % (Goal: 30%+ in 6 months)
- Pages per session (Goal: 5+)
- Community submissions (Goal: 10+ per day)
- Organic search traffic (Goal: 2x in 6 months)
