# SKILLS

Compact reference for AI agents. Describes what this project can do, where things live, and how to work efficiently.

**Usage:** Skim this file at session start alongside `AGENTS.md` and `.ai/VERIFICATION_REQUIRED.md`.

---

## Technical Skills

| Skill               | Description                              | Key Locations                             | Typical Tasks                         |
| ------------------- | ---------------------------------------- | ----------------------------------------- | ------------------------------------- |
| **Next.js 16**      | App Router with server/client components | `app/`, `layout.tsx`, `page.tsx`          | Add pages, fix routing, hydration/SSR |
| **TypeScript**      | Strict typing throughout                 | `*.tsx`, `*.ts`, `tsconfig.json`          | Type errors, interfaces, props        |
| **Tailwind CSS**    | Utility-first styling                    | `globals.css`, `tailwind.config.ts`       | Styling, responsive design, dark mode |
| **shadcn/ui**       | Pre-built accessible components          | `components/ui/`                          | Buttons, cards, dialogs, inputs       |
| **Lucide Icons**    | Icon library                             | Import from `lucide-react`                | Add/change icons                      |
| **Leaflet**         | Interactive maps                         | `components/store-map.tsx`, `globals.css` | Map features, popups, markers         |
| **React Hook Form** | Form state management                    | Form components                           | Validation, submission handling       |
| **Zod**             | Schema validation                        | `lib/validations.ts`                      | Input validation, type inference      |
| **Framer Motion**   | Animations (use sparingly)               | Component files                           | Subtle transitions only               |
| **Playwright**      | E2E testing                              | `tests/`, `playwright.config.ts`          | Write/run tests                       |
| **Vercel**          | Hosting & deploys                        | Vercel dashboard                          | Deploy issues, env vars               |

---

## Domain Skills

| Domain                   | What It Is                                    | Data/Config Location                                                   | Agent Notes                                 |
| ------------------------ | --------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| **Penny Items**          | HD clearance items marked to $0.01            | Content in `app/guide/`, `app/what-are-pennies/`                       | Educational content, lifecycle explanations |
| **Clearance Lifecycle**  | How items progress through markdowns          | `app/clearance-lifecycle/`, `components/clearance-lifecycle-chart.tsx` | Visual chart, timing patterns               |
| **Store Finder**         | 2000+ HD locations with map                   | `app/store-finder/`, `data/home-depot-stores.json`, `lib/stores.ts`    | Map integration, store data                 |
| **Trip Tracker**         | Plan/log penny hunting trips                  | `app/trip-tracker/`                                                    | Local storage (Firebase planned)            |
| **Cashback (Affiliate)** | BeFrugal affiliate link for site monetization | `app/cashback/`, `components/SupportAndCashbackCard.tsx`               | Passive income via referrals                |
| **Store Data**           | JSON with store locations/details             | `data/home-depot-stores.json`, `data/stores/`                          | ~2000 stores, lat/lng, addresses            |

---

## MCP Servers & Tooling

**Status:** 4 MCP servers active (filesystem, git, github, playwright)

**Full Reference:** See `.ai/MCP_BASELINE.md` (details in `.ai/TOOLING_MANIFEST.md`)

| Server       | Purpose                  | When to Use                  |
| ------------ | ------------------------ | ---------------------------- |
| `filesystem` | Read/write repo files    | Automatic (file operations)  |
| `git`        | Version control ops      | Automatic (git operations)   |
| `github`     | GitHub API (PRs, issues) | When needed (PRs, CI checks) |
| `playwright` | Browser automation       | **REQUIRED for UI changes**  |

**Dev Commands:**

```bash
npm run dev         # Dev server (localhost:3001) - check if running first!
npm run build       # Production build — ALWAYS run before done
npm run lint        # ESLint check — ALWAYS run before done
npm run test:unit   # Unit tests — ALWAYS run before done
npm run test:e2e    # E2E tests — ALWAYS run before done
```

---

## Critical Rules

**Read `.ai/VERIFICATION_REQUIRED.md` BEFORE claiming "done"**

### Rule #1: Verification

- All 4 tests MUST pass (lint, build, test:unit, test:e2e)
- Paste output as proof
- Screenshots for UI changes (use Playwright)
- GitHub Actions URL if applicable

### Rule #2: Port 3001

```bash
netstat -ano | findstr :3001
# IF RUNNING → use it (don't kill)
# IF NOT → npm run dev
```

### Rule #3: Colors

- ❌ NO raw Tailwind (`blue-500`, `gray-600`)
- ✅ USE CSS variables (`var(--cta-primary)`, `var(--background)`)
- ✅ OR get approval first

---

## Agent Playbook

1. **Session start:** Read `AGENTS.md` + `.ai/VERIFICATION_REQUIRED.md`
2. **Understand state:** Check `.ai/STATE.md` and `.ai/BACKLOG.md`
3. **Make changes:** Follow constraints in `.ai/CONSTRAINTS.md`
4. **Before claiming "done":** Run all 4 tests, use Playwright for UI, paste proof
5. **Session end:** Update `.ai/SESSION_LOG.md` and `.ai/STATE.md`

---

## Quick Reference

- **Verification template:** `.ai/VERIFICATION_REQUIRED.md`
- **Most violated rules:** `.ai/CONSTRAINTS.md` (top section)
- **Design tokens:** `globals.css` (use CSS variables, not Tailwind colors)
- **Decision rights:** `.ai/DECISION_RIGHTS.md` (what needs approval)
- **Past mistakes:** `.ai/LEARNINGS.md` (avoid repeating)
- **Session memory:** `.ai/SESSION_LOG.md` (context between sessions)
