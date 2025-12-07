# Penny Central

The official companion site for the "Home Depot One Cent Items" Facebook community (40,000+ members and growing). A utility/reference guide for finding Home Depot clearance items marked to $0.01.

**Live:** https://pennycentral.com

---

## What It Does

- **Penny List** ⭐ NEW — Community-powered list of reported penny finds, updated hourly from Google Forms (no manual work)
- **Penny Guide** — Complete reference on how clearance items reach penny status
- **Store Finder** — Find nearby Home Depot locations with intelligent search (supports city, state name, ZIP code)
- **Trip Tracker** — Plan and log penny hunting trips
- **Resources** — External tools and community links
- **Cashback Guide** — How to stack savings with cashback apps

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
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

## Design System

**Full spec:** `docs/DESIGN-SYSTEM-AAA.md`

**Target:** WCAG AAA compliance (7:1 contrast for normal text)

**Palette:** Clean neutrals + blue CTA + amber live indicator

| Mode  | Background | Text      | CTA       | Live Indicator |
| ----- | ---------- | --------- | --------- | -------------- |
| Light | `#FFFFFF`  | `#18181B` | `#1D4ED8` | `#D97706`      |
| Dark  | `#18181B`  | `#FAFAFA` | `#3B82F6` | `#FBBF24`      |

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

---

## Branch Strategy

- **`main`** — Production branch. Live on Vercel. Protected.
- **`dev-next`** — Development branch. All feature work happens here. Merged to main when ready.

**Workflow:**

1. Work on `dev-next`
2. Commit + lint/build check
3. Merge `dev-next → main` when stable
4. Push main to remote (auto-deploys to Vercel)
5. Continue on `dev-next`

---

## Community

- **Facebook Group:** Home Depot One Cent Items (40,000+ members)
- **Purpose:** Educational resource for penny hunting community
- **Penny List Form:** Collects verified penny finds from community members

---

## License

Educational use. Not affiliated with Home Depot.
