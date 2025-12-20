# Penny Central

The official companion site for the "Home Depot One Cent Items" Facebook community (40,000+ members and growing). A utility/reference guide for finding Home Depot clearance items marked to $0.01.

**Live:** https://pennycentral.com

---

## What It Does

- **Community Penny List (Crowdsourced Reports)** ⭐ NEW — Community-powered list of reported penny finds, updated hourly from Google Forms (no manual work)
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
```

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

- **Live CSV Feed:** Google Form responses auto-published to site every hour
- **Files:** `lib/fetch-penny-data.ts`, `app/penny-list/page.tsx`
- **How it works:** Publish your Google Sheet as CSV → set `GOOGLE_SHEET_URL` in Vercel env → updates hourly with no manual work
- **Privacy:** Emails/timestamps never sent to browser; only approved fields displayed
- **Zero moderation overhead:** All submissions auto-include; delete bad rows in Sheet if needed

### Setup Required

1. In your Google Sheet response, go **File → Share → Publish to web**
2. Select **Form Responses 1** → **CSV** → Copy link
3. Add to Vercel environment: `GOOGLE_SHEET_URL=<your-csv-link>`
4. Site auto-fetches every hour; live in ~60 seconds
5. **Optional enrichment overlay:** Publish a second tab with headers `Home Depot SKU (6 or 10 digits)`, `IMAGE URL`, `INTERNET SKU`, set `GOOGLE_SHEET_ENRICHMENT_URL=<enrichment-csv-link>`, and the site will fill missing images/links by SKU without touching community rows.

---

## For AI Agents & Developers

| File                              | Purpose                                                             |
| --------------------------------- | ------------------------------------------------------------------- |
| `AGENTS.md`                       | Master source of truth — behavior rules, design system, constraints |
| `SKILLS.md`                       | Technical stack, domain knowledge, MCP patterns                     |
| `CLAUDE.md`                       | Claude Code instructions (points to AGENTS.md)                      |
| `.github/copilot-instructions.md` | Copilot Chat instructions (points to AGENTS.md)                     |
| `PROJECT_ROADMAP.md`              | Current priorities and feature status; **updated Dec 7, 2025**      |
| `docs/DESIGN-SYSTEM-AAA.md`       | Complete color and typography specification                         |
| `docs/GOOGLE-FORM-PENNY-LIST.md`  | Penny list form setup, CSV export, automation                       |
| `docs/PENNY-LIST-STRATEGY.md`     | Community intake strategy, low-effort moderation                    |

### AI Canon & Read Order (canonical entrypoint)

- Start here. The `.ai/README.md` file is now a stub that points back to this section.
- Read order before work: `STATE.md` → `BACKLOG.md` → `CONTRACT.md` + `DECISION_RIGHTS.md` → `CONSTRAINTS.md` + `FOUNDATION_CONTRACT.md` + `GUARDRAILS.md` → latest `SESSION_LOG.md` → `CONTEXT.md` when making product calls.
- Rules: default **no new dependencies**; avoid orphan one-off files (if you add, prune or merge an obsolete one and log it); run gates on meaningful changes (`npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`) and record results in `SESSION_LOG.md`; work on `main` and note it.

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

- **Facebook Group:** Home Depot One Cent Items (40,000+ members)
- **Purpose:** Educational resource for penny hunting community
- **Penny List Form:** Collects verified penny finds from community members

---

## License

Educational use. Not affiliated with Home Depot.
