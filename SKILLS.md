# SKILLS

Compact reference for AI agents. Describes what this project can do, where things live, and how to work efficiently.

**Usage:** Skim this file at session start alongside `AGENTS.md`. Load only files you need.

---

## Technical Skills

| Skill               | Description                              | Key Locations                               | Typical Tasks                         |
| ------------------- | ---------------------------------------- | ------------------------------------------- | ------------------------------------- |
| **Next.js 15**      | App Router with server/client components | `app/`, `layout.tsx`, `page.tsx`            | Add pages, fix routing, SSR issues    |
| **TypeScript**      | Strict typing throughout                 | `*.tsx`, `*.ts`, `tsconfig.json`            | Type errors, interfaces, props        |
| **Tailwind CSS**    | Utility-first styling                    | `globals.css`, `tailwind.config.ts`         | Styling, responsive design, dark mode |
| **shadcn/ui**       | Pre-built accessible components          | `components/ui/`                            | Buttons, cards, dialogs, inputs       |
| **Lucide Icons**    | Icon library                             | Import from `lucide-react`                  | Add/change icons                      |
| **Leaflet**         | Interactive maps                         | `components/store-map.tsx`, `globals.css`   | Map features, popups, markers         |
| **React Hook Form** | Form state management                    | Form components                             | Validation, submission handling       |
| **Zod**             | Schema validation                        | `lib/validations.ts`                        | Input validation, type inference      |
| **Framer Motion**   | Animations (use sparingly)               | Component files                             | Subtle transitions only               |
| **Playwright**      | E2E testing                              | `tests/`, `playwright.config.ts`            | Write/run tests                       |
| **Vercel**          | Hosting & deploys                        | `vercel.json` (if exists), Vercel dashboard | Deploy issues, env vars               |

---

## Domain Skills

| Domain                   | What It Is                                    | Data/Config Location                                                   | Agent Notes                                                                                                                      |
| ------------------------ | --------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Penny Items**          | HD clearance items marked to $0.01            | Content in `app/guide/`, `app/what-are-pennies/`                       | Educational content, lifecycle explanations                                                                                      |
| **Clearance Lifecycle**  | How items progress through markdowns          | `app/clearance-lifecycle/`, `components/clearance-lifecycle-chart.tsx` | Visual chart, timing patterns                                                                                                    |
| **Store Finder**         | 2000+ HD locations with map                   | `app/store-finder/`, `data/home-depot-stores.json`, `lib/stores.ts`    | Map integration, store data                                                                                                      |
| **Trip Tracker**         | Plan/log penny hunting trips                  | `app/trip-tracker/`                                                    | Local storage (Firebase planned)                                                                                                 |
| **Cashback (Affiliate)** | BeFrugal affiliate link for site monetization | `app/cashback/`, `components/SupportAndCashbackCard.tsx`               | Passive income via referrals; chosen for best balance of user savings vs affiliate payout vs market saturation (vs Rakuten etc.) |
| **Store Data**           | JSON with store locations/details             | `data/home-depot-stores.json`, `data/stores/`                          | ~2000 stores, lat/lng, addresses                                                                                                 |

---

## MCP Servers & Tooling

| Server       | Purpose                  | When to Use                         | Avoid                                       |
| ------------ | ------------------------ | ----------------------------------- | ------------------------------------------- |
| `filesystem` | Read/write repo files    | Targeted file reads, edits          | Don't scan entire repo; read specific paths |
| `git`        | Version control ops      | Check status, diffs, branches       | Don't run git commands for trivial checks   |
| `github`     | GitHub API (PRs, issues) | Create PRs, manage issues, check CI | Don't poll repeatedly                       |
| `vercel`     | Deployment management    | Check deploy status, debug prod     | Rarely needed for local dev                 |

**Dev Commands:**

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

**Anti-patterns:**

- Listing entire directory trees repeatedly
- Reading the same file multiple times in one session
- Using MCP when you already have the info in context

---

## Agent Playbook

1. **Session start:** Read `AGENTS.md` (behavior rules) + skim `SKILLS.md` (this file)
2. **Understand state:** Check `PROJECT_ROADMAP.md` for current priorities
3. **Minimal context:** Load only files relevant to the task
4. **MCP efficiency:** Use filesystem for targeted reads, not exploratory scans
5. **After changes:** Update `PROJECT_ROADMAP.md` if features changed; update `CHANGELOG.md` for meaningful work
6. **Design rules:** Follow color palette and forbidden elements in `AGENTS.md` Section 8
7. **When unsure:** Ask one clarifying question or state your assumption clearly

---

## Quick Reference

- **Design system:** `AGENTS.md` Section 8 (Slate Steel palette, forbidden elements)
- **User constraints:** `AGENTS.md` Sections 1-2 (non-coder, minimal disruption)
- **Doc structure:** `AGENTS.md` Section 3 (which docs to update when)
- **Archive:** `archive/` contains deprecated code—safe to read, don't restore without asking
- **Experimental:** `experimental_scraper/` is a separate Rust project—don't touch without approval
