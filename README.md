# Penny Central

The official companion site for the "Home Depot One Cent Items" Facebook community (50,000+ members and growing). A utility/reference guide for finding Home Depot clearance items marked to $0.01.

**Live:** https://pennycentral.com

---

## What It Does

- **Penny List (Crowdsourced Reports)** ⭐ NEW — Community-powered list of reported penny finds, updated regularly (usually within about 5 minutes) from Google Forms (no manual work)
- **Penny Guide** — Complete reference on how clearance items reach penny status
- **Store Finder** — Find nearby Home Depot locations with intelligent search (supports city, state name, ZIP code)
- **Trip Tracker** — Plan and log penny hunting trips
- **Resources** — External tools and community links
- **Cashback Guide** — How to stack savings with cashback apps

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **Components:** shadcn/ui
- **Font:** Inter
- **Hosting:** Vercel

---

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Dev server (localhost:3001)
npm run build      # Production build
npm run lint       # ESLint check
npm run test:e2e   # Playwright (uses port 3002 by default to avoid clashing with your dev server)
```

---

## Analytics (Privacy-Friendly)

Analytics are enabled in production by default:

- **Vercel Web Analytics** (automatic on Vercel production)
- **GA4** (gtag)

**Single switch (never remove):**

```bash
# Set to "false" to disable BOTH GA4 and Vercel Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

No “provider” env var is used — this avoids tracking silently dropping due to misconfiguration.

---

## OG Images (Facebook Reliable)

Main pages use **static** OG PNGs for reliability on Facebook and other scrapers.

- **Static files:** `public/og/*.png`
- **Source template:** `app/api/og/route.tsx`
- **Generator:** `scripts/generate-og-images-playwright.ts` (screenshots the OG endpoint)

To regenerate after updating the OG template:

1. Ensure the dev server is running on port 3001.
2. Run:

```bash
tsx scripts/generate-og-images-playwright.ts
```

Then commit the updated `public/og/*.png` files.

---

## Definition of Done (Required)

For any meaningful change (especially UI/copy/navigation):

- Paste raw outputs for: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`
- UI changes: capture Playwright screenshots (light/dark, mobile/desktop) and confirm browser console has no errors
- Docs/memory updated: `README.md`, `.ai/STATE.md`, `.ai/BACKLOG.md`, `.ai/SESSION_LOG.md`, `CHANGELOG.md`
- Token-only colors confirmed (no raw Tailwind palette); prefer `npm run lint:colors`

See: `.ai/VERIFICATION_REQUIRED.md`

---

## Design System

**Full spec:** `docs/DESIGN-SYSTEM-AAA.md`

**Target:** WCAG AAA compliance (7:1 contrast for normal text)

**Palette:** Clean neutrals + blue CTA + amber live indicator

| Mode  | Background | Text      | CTA       | Live Indicator |
| ----- | ---------- | --------- | --------- | -------------- |
| Light | `#FFFFFF`  | `#1C1917` | `#2B4C7E` | `#D97706`      |
| Dark  | `#121212`  | `#DCDCDC` | `#8AA7C7` | `#FBBF24`      |

---

## Project Structure

```
app/                    # Pages (App Router)
  page.tsx              # Homepage
  store-finder/         # Store Finder
  trip-tracker/         # Trip Tracker
  guide/                # Penny Guide
  resources/            # Resources
  about/                # About
  cashback/             # Cashback Guide
components/             # Shared components
docs/                   # Documentation
  DESIGN-SYSTEM-AAA.md  # Color & typography spec
lib/                    # Utilities and constants
public/                 # Static assets
```

---

## Critical Dec 2025 Updates

### Autonomous Penny List (Live)

- **Data source:** Supabase (`Penny List` + `penny_item_enrichment`)
- **Files:** `lib/fetch-penny-data.ts`, `app/api/submit-find/route.ts`, `app/api/penny-list/route.ts`
- **How it works:** Report Find inserts into `Penny List`; the site reads via `penny_list_public` (RLS-safe view) and overlays metadata from `penny_item_enrichment` by SKU.
- **Why there are 5 tables:** `lists`, `list_items`, `list_shares` exist for the optional Save/My Lists feature (separate from scraping/enrichment).
- **Legacy note:** The older Google Sheets pipeline is deprecated; docs remain for history at `docs/GOOGLE-FORM-PENNY-LIST.md`.

### Setup Required

1. Set environment/secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never exposed to the browser)
2. Apply/verify Supabase RLS + the public read view: `docs/supabase-rls.md`

---

## For AI Agents & Developers

| File                              | Purpose                                                              |
| --------------------------------- | -------------------------------------------------------------------- |
| `AGENTS.md`                       | Master source of truth — behavior rules, design system, constraints  |
| `SKILLS.md`                       | Technical stack, domain knowledge, MCP patterns                      |
| `CLAUDE.md`                       | Claude Code instructions (points to AGENTS.md)                       |
| `.github/copilot-instructions.md` | Copilot Chat instructions (points to AGENTS.md)                      |
| `.ai/AI_ENABLEMENT_BLUEPRINT.md`  | When the goal is AI workflow/tooling/verification enablement         |
| `PROJECT_ROADMAP.md`              | Current priorities and feature status; **updated Dec 7, 2025**       |
| `docs/DESIGN-SYSTEM-AAA.md`       | Complete color and typography specification                          |
| `docs/CROWDSOURCE-SYSTEM.md`      | Current Supabase tables and roles (Penny List + enrichment + lists)  |
| `docs/supabase-rls.md`            | Supabase RLS + public view policy set (how reads/writes are secured) |
| `docs/SCRAPING_COSTS.md`          | SerpApi enrichment budget + options                                  |
| `docs/GOOGLE-FORM-PENNY-LIST.md`  | Penny list form setup, CSV export, automation                        |
| `docs/PENNY-LIST-STRATEGY.md`     | Community intake strategy, low-effort moderation                     |

### AI Canon & Read Order (canonical entrypoint)

- **Start here:** Read `.ai/START_HERE.md` for the universal entry point and mandatory read order
- The `.ai/README.md` file is now a stub that points back to this section
- **Read sequence:** START_HERE.md → CRITICAL_RULES.md → STATE.md → BACKLOG.md → CONTRACT.md → DECISION_RIGHTS.md
- **First session only:** Read `GROWTH_STRATEGY.md` for business context
- **If session goal is AI workflow/tooling/verification enablement:** Also read `.ai/AI_ENABLEMENT_BLUEPRINT.md`
- **Rules:** Default no new dependencies; run all 4 gates (lint/build/unit/e2e) on meaningful changes and record results in `SESSION_LOG.md`; work on `main`

---

## Affiliate Links & Redirects

- `/go/befrugal` is the canonical affiliate path. Keep the redirect logic in `app/go/befrugal/route.ts`.
- Always render affiliate CTAs as plain `<a href="/go/befrugal" target="_blank" rel="noopener noreferrer">` elements. **Do not** wrap them in `next/link`, buttons, or components that prefetch.
- Next.js prefetching will hit BeFrugal in the background, which triggers browser CORS errors (`net::ERR_FAILED`) even though no real click happened. Using plain anchors avoids those phantom requests and keeps referrals safe.
- It’s fine to track clicks with `trackEvent(...)`, but never fire a `fetch` to the affiliate URL from client-side code.

---

## Branch Strategy

- **`main`** — the only branch used locally and on remote. Every push deploys to Vercel.

**Workflow:**

1. Pull latest `main`
2. Make changes on `main`
3. Run `npm run lint` and `npm run build`
4. Commit to `main` with a clear message
5. Push `main` to deploy

---

## Community

- **Facebook Group:** Home Depot One Cent Items (50K+ members)
- **Purpose:** Educational resource for penny hunting community
- **Penny List Form:** Collects verified penny finds from community members

---

## License

Educational use. Not affiliated with Home Depot.
