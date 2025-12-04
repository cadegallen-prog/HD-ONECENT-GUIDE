# Penny Central

A utility/reference guide for finding Home Depot clearance items marked to $0.01. The official companion site for the "Home Depot One Cent Items" Facebook community (37,000+ members).

**Live:** https://pennycentral.com

---

## What It Does

- **Penny Guide** — Complete reference on how clearance items reach penny status
- **Store Finder** — Find nearby Home Depot locations with map integration
- **Trip Tracker** — Plan and log penny hunting trips
- **Resources** — External tools and community links

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Vercel (hosting)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

Dev server runs at http://localhost:3000

---

## Design System

**Palette:** Slate Steel

- Light mode: `#FAFAFA` background, `#0F172A` text, `#475569` accent
- Dark mode: `#0F172A` background, `#FAFAFA` text, `#64748B` accent

**Font:** Inter

**Aesthetic:** Clean, professional, minimal. Inspired by Linear, Vercel, Stripe.

See `AGENTS.md` for complete design specifications.

---

## Project Structure

```
app/                    # Pages (App Router)
  page.tsx              # Homepage / main guide
  store-finder/
  trip-tracker/
  resources/
  about/
components/             # Shared components
public/                 # Static assets
```

---

## For AI Agents

- **`AGENTS.md`** — Single source of truth for how agents should behave, design specs, and project rules.
- **`SKILLS.md`** — Compact reference for technical stack, domain skills, MCP servers, and tooling.
- **`CLAUDE.md`** — Claude-specific instructions (points to AGENTS.md and SKILLS.md).
- **`.github/copilot-instructions.md`** — Copilot Chat-specific instructions (points to AGENTS.md and SKILLS.md).
- **`PROJECT_ROADMAP.md`** — What's done, in progress, and planned.

---

## Community

- **Facebook Group:** Home Depot One Cent Items (37,000+ members)
- **Purpose:** Educational resource for penny hunting community

---

## License

Educational use. Not affiliated with Home Depot.
