# PROJECT ROADMAP

**Last updated:** Dec 10, 2025

This file gives a high level view of what this project does, what is done, and what is planned.

Agents: keep this file short and useful. Update it when you actually finish or significantly change something.

---

## 1. Product Context

**Status:** ✅ **LIVE** at https://pennycentral.com (launched Dec 2025)

**Current Phase:** Foundation & Community Intake — Building the penny list from community contributions, stabilizing core UX, establishing minimal-effort operational model.

**What:** PennyCentral.com - a utility/reference guide for finding Home Depot clearance items marked to $0.01, powered by community intelligence.

**Who:** Members of the "Home Depot One Cent Items" Facebook community (50,000+ members and growing). Savvy shoppers who want actionable intel, not hype.

**Core value:** Education on how clearance works, tools to find stores and plan trips, realistic guidance on whether items are worth buying, AND a real-time community-powered list of reported penny finds.

**Non-goals:**

- Not a marketplace or forum
- Not gamified (no XP, badges, levels)
- Not a blog with constant content churn
- Not a data scraping or inventory tracking service
- Not a high-maintenance project requiring daily admin work

**Success looks like:**

- Users find the info they need quickly
- Tools (Store Finder, Trip Tracker, Penny List) work reliably
- Site stays simple and fast
- Community contributions are easy and rewarding
- Minimal maintenance burden (founder manages Sheet, not code)

---

## 2. Current major features

- **Penny Guide** (`/guide`) — Complete reference on clearance cadences, markdown stages, and how items reach penny status. ✅ Live
- **Penny List** (`/penny-list`) ⭐ **ENHANCED DEC 10** — Community-powered list of reported penny finds, auto-updated (usually within about 5 minutes) from the site's "Report a Find" form (Supabase-backed). Phase 1 UI polish complete (improved readability, contrast, mobile UX). ✅ Live
- **Store Finder** (`/store-finder`) — Find nearby Home Depot locations with interactive map. ✅ Live
- **Trip Tracker** (`/trip-tracker`) — Plan and log penny hunting trips. ✅ Live
- **Resources** (`/resources`) — External tools and community links. ✅ Live
- **About** (`/about`) — Project background, community info, and support options. ✅ Live
- **Cashback Guide** (`/cashback`) — Full explanation of BeFrugal cashback for normal purchases. ✅ Live
- **Support Integration** — SupportAndCashbackCard component on key pages. ✅ Live

---

## 3. Dec 2025 Major Achievement

### Autonomous Penny List System (🎯 Core Milestone)

**What:** Community can now submit penny finds via the site's "Report a Find" page. Submissions are written to Supabase `Penny List` table, and the public read view `penny_list_public` is used by the site to render listings (typically within ~5 minutes after cache revalidation).

**Why it matters:**

- Converts 50,000+ community members into data sources
- Creates a real-time, crowd-sourced intelligence feed
- Dramatically increases site value and stickiness
- Requires minimal founder time (moderation via Supabase table editor)

**How it works:**

1. Community submits finds via `/report-find` (server route `app/api/submit-find/route.ts`)
2. Server inserts into Supabase `Penny List` table
3. Site reads from `penny_list_public` view and aggregates results for `/penny-list`
4. Founder moderates via Supabase project; no Google Sheets required

**Technical setup:**

- `lib/fetch-penny-data.ts` — Supabase-backed reads, enrichment overlay, and aggregation
- `app/penny-list/page.tsx` — Server-side rendering with short cache revalidation (target ~5 minutes)
- Supabase `Penny List` table + `penny_list_public` read view (RLS-protected as required)
- Ensure Supabase env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are set in Vercel

**For no-code owner:**

- Ensure Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are set in Vercel and that you have Supabase project access.
- Monitor the first 5–10 submissions in the Supabase `Penny List` table to ensure quality.
- That's it. Site updates itself after short revalidation (typical ~5 minutes).

---

## 4. In progress

- None currently

---

## 5. Recently completed

- Design System Refinement (60-30-10 rule implementation) ✅ Done Dec 6
- Homepage Support section prominently featured ✅ Done Dec 6
- Blue CTA buttons for all primary actions ✅ Done Dec 6
- Footer redesign with support links ✅ Done Dec 6
- Documentation alignment (consolidating agent instruction files) ✅ Done Dec 6
- Map popup UX improvements ✅ Done Dec 6
- **Autonomous Penny List System** ✅ **Done Dec 7** — Live, tested, documented
- Branch strategy simplified to main-only ✅ **Done Dec 12** — Single-branch workflow for stability and deploy clarity
- **Penny List Phase 1 UI Polish** ✅ **Done Dec 10** — Enhanced table/card readability, improved contrast, mobile scroll hints, comprehensive test coverage
- **MCP Documentation & Testing Infrastructure** ✅ **Done Dec 10** — Comprehensive documentation of all 6 MCP servers, testing checklist, and stopping rules to maximize future agent productivity

---

## 6. Realistic Path Forward for No-Code Owner

### Immediate (Week 1—2)

**What you need to do:**

1. ✅ Ensure Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are set in Vercel and that you have Supabase project access
2. ✅ Monitor the first 5–10 submissions in the Supabase `Penny List` table to ensure quality
3. ✅ Remove any spam or obviously bad entries via the Supabase table editor
4. Share `/penny-list` link in Facebook group (one post, let it run)

**Realistic outcome:** 20–50 submissions in first 2 weeks; site feels alive and community-powered.

### Month 1

**Content you can add (no coding):**

- Quick "How to Submit a Find" guide (in Facebook group or site FAQ)
- Highlight interesting finds in group posts (drives traffic back to site)
- Ask community to suggest which categories matter most (Rare vs Common)

**What not to do:**

- Don't overthink moderation; let crowd-sourced quality control work
- Don't add heavy curation rules (kills participation)
- Don't try to manually verify every entry (defeats purpose)

### Months 2–3

**Scale:**

- Site becomes the single source of truth for recent penny finds
- Community benefits from seeing what others found (motivating)
- You get free, real-time market intel on which items are clearing

**Optional enhancements (if you want):**

- Email summary of top finds (no coding needed; use Zapier/Make)
- Tier/rarity filters on penny list (AI agent can add in 30 min)
- Regional breakdown (what's clearing in your state vs others)

### Ongoing

**Maintenance burden (realistic):**

- 5 min/week: Delete obvious spam from the Sheet
- 1 message/month: Post in group asking for submissions
- That's it.

**Red flag:** If more than 10% of submissions are junk, add an "approval" column to the Sheet (turn on moderation). AI agent can wire that in ~1 hour.

---

## 7. Next priority features (ranked by impact/effort ratio)

**High impact / Low effort:**

1. **Email digest of top finds** (via Zapier)
   - Weekly email to community: "Top 5 finds this week"
   - Drive repeated visits; show Site is active
   - Effort: 30 min setup (no code; Zapier template exists)

2. **Penny List filters (Rare/Common/Very Common)**
   - Let users see only high-tier finds
   - Already in data; just needs UI toggle
   - Effort: 2 hours (AI agent work; you test in browser)

3. **"How to Submit" guide + FAQ**
   - Link from `/penny-list` to `/report-find` (Report a Find page)
   - Answer: "Why is my find missing?" / "How long does it take to appear?"
   - Effort: 30 min; pure writing, no coding

4. **Approval/moderation column (if quality drops)**
   - Add "Approved" column to Sheet; turn on filtering
   - You mark rows TRUE/FALSE; site auto-respects
   - Effort: 1 hour (AI agent wires it; you manage Sheet)

**Medium impact / Medium effort:**

5. **Regional breakdown of clears (map view or state filter)**
   - Show "What's clearing in CA vs TX vs your state"
   - Helps hunters plan cross-state trips
   - Effort: 4 hours (AI agent + you test/refine)

6. **Link to "Call store for confirmation"**
   - Button on each find: "Copy store #" or "Get directions"
   - Store Finder already has locations; just need integration
   - Effort: 3 hours

7. **Trending/Hot finds badge**
   - Show which items appeared 5+ times across states
   - Signals "This IS clearing everywhere"
   - Effort: 3 hours

**Low priority / Can ignore for 6 months:**

- Community success stories ("I found it! Here's what I bought")
- Store-specific intel (which stores honor pennies more reliably)
- Advanced analytics (what time of week clears happen)

---

## 8. When to Ask AI for Help

**Easy wins to delegate (< 2 hours):**

- "Add a filter/sort to penny list"
- "Style/layout improvements"
- "Add a new page (e.g., FAQ, How-To Guide)"
- "Documentation updates"

**Medium lifts (2–4 hours):**

- "Wire up moderation (approval column)"
- "Add email digest automation"
- "Regional breakdown feature"

**Get technical co-founder for (> 4 hours or uncertain):**

- Database/auth changes
- Major architecture shifts
- Performance optimization
- Third-party integrations (payment, auth, etc.)

**Don't bother coding:**

- Marketplace features (buying/selling)
- Forum or comments (complexity; community should stay on Facebook)
- Gamification (badges, leaderboards)
- Mobile app version
