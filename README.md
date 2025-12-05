# Penny Central

The official companion site for the "Home Depot One Cent Items" Facebook community (40,000+ members and growing). A utility/reference guide for finding Home Depot clearance items marked to $0.01.

**Live:** https://pennycentral.com

---

## What It Does

- **Penny Guide** — Complete reference on how clearance items reach penny status
- **Store Finder** — Find nearby Home Depot locations with interactive map
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

## For AI Agents

| File                              | Purpose                                                             |
| --------------------------------- | ------------------------------------------------------------------- |
| `AGENTS.md`                       | Master source of truth — behavior rules, design system, constraints |
| `SKILLS.md`                       | Technical stack, domain knowledge, MCP patterns                     |
| `CLAUDE.md`                       | Claude Code instructions (points to AGENTS.md)                      |
| `.github/copilot-instructions.md` | Copilot Chat instructions (points to AGENTS.md)                     |
| `PROJECT_ROADMAP.md`              | Current priorities and feature status                               |
| `docs/DESIGN-SYSTEM-AAA.md`       | Complete color and typography specification                         |

---

## Community

- **Facebook Group:** Home Depot One Cent Items (40,000+ members)
- **Purpose:** Educational resource for penny hunting community

---

## License

Educational use. Not affiliated with Home Depot.
