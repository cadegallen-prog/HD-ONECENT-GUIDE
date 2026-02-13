# SKILLS

Compact reference for AI agents. Describes what this project can do, where things live, and how to work efficiently.

**Usage:** Skim this file at session start alongside `AGENTS.md` and `.ai/VERIFICATION_REQUIRED.md`.

---

## Agent Fast Path (Read In Order)

1. `README.md` → **AI Canon & Read Order** section (authoritative session entrypoint)
2. `docs/skills/README.md` → choose the smallest relevant task skill
3. `AGENTS.md` → behavior + verification contract
4. `.ai/STATE.md` + `.ai/BACKLOG.md` → current truth + current priority
5. `.ai/CONSTRAINTS.md` + `.ai/DECISION_RIGHTS.md` → hard limits + what needs approval

---

## Technical Skills

| Skill               | Description                              | Key Locations                                 | Typical Tasks                         |
| ------------------- | ---------------------------------------- | --------------------------------------------- | ------------------------------------- |
| **Next.js 16**      | App Router with server/client components | `app/`, `app/layout.tsx`, `app/page.tsx`      | Add pages, fix routing, hydration/SSR |
| **TypeScript**      | Strict typing throughout                 | `*.tsx`, `*.ts`, `tsconfig.json`              | Type errors, interfaces, props        |
| **Tailwind CSS**    | Utility-first styling                    | `app/globals.css`, `tailwind.config.ts`       | Styling, responsive design, dark mode |
| **shadcn/ui**       | Pre-built accessible components          | `components/ui/`                              | Buttons, cards, dialogs, inputs       |
| **Lucide Icons**    | Icon library                             | Import from `lucide-react`                    | Add/change icons                      |
| **Leaflet**         | Interactive maps                         | `components/store-map.tsx`, `app/globals.css` | Map features, popups, markers         |
| **React Hook Form** | Form state management                    | Form components                               | Validation, submission handling       |
| **Zod**             | Schema validation                        | `lib/validations.ts`                          | Input validation, type inference      |
| **Framer Motion**   | Animations (use sparingly)               | Component files                               | Subtle transitions only               |
| **Playwright**      | E2E testing                              | `tests/`, `playwright.config.ts`              | Write/run tests                       |
| **Vercel**          | Hosting & deploys                        | Vercel dashboard                              | Deploy issues, env vars               |

---

## Domain Skills

| Domain                  | What It Is                                | Data/Config Location                                                          | Agent Notes                                       |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| **Penny Items**         | HD clearance items marked to $0.01        | Content in `app/guide/`, `app/what-are-pennies/`                              | Educational content, lifecycle explanations       |
| **Clearance Lifecycle** | How items progress through markdowns      | `app/clearance-lifecycle/`, `components/clearance-lifecycle-chart.tsx`        | Visual chart, timing patterns                     |
| **Store Finder**        | 2000+ HD locations with map               | `app/store-finder/`, `data/home-depot-stores.json`, `lib/stores.ts`           | Map integration, store data                       |
| **My List**             | Save and organize penny finds             | `app/lists/`, `lib/supabase/lists.ts`                                         | Supabase-backed saved-items workflow              |
| **Support & Cashback**  | Monetization transparency + referral flow | `app/support/page.tsx`, `app/go/rakuten/route.ts`, `app/go/befrugal/route.ts` | `/cashback` is legacy and redirects to `/support` |
| **Store Data**          | JSON with store locations/details         | `data/home-depot-stores.json`, `data/stores/`                                 | ~2000 stores, lat/lng, addresses                  |

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

**Dev Commands (Canonical):**

```bash
npm run dev         # Dev server (localhost:3001) - check if running first!
npm run verify:fast # Lint + typecheck + unit + build (required before push)
npm run e2e:smoke   # Required for route/form/API/UI-flow changes
npm run e2e:full    # Trigger policy only (or explicit request)
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

1. **Session start:** Read `README.md` AI canon section + `docs/skills/README.md` + `AGENTS.md`
2. **Understand state:** Check `.ai/STATE.md` and `.ai/BACKLOG.md`
3. **Make changes:** Follow constraints in `.ai/CONSTRAINTS.md`
4. **Before claiming "done":** Run `npm run verify:fast`, run `npm run e2e:smoke` when applicable, use Playwright for UI, paste proof
5. **Session end:** Update `.ai/SESSION_LOG.md` and `.ai/STATE.md`

---

## Quick Reference

- **Verification template:** `.ai/VERIFICATION_REQUIRED.md`
- **Most violated rules:** `.ai/CONSTRAINTS.md` (top section)
- **Design tokens:** `app/globals.css` (use CSS variables, not Tailwind colors)
- **Decision rights:** `.ai/DECISION_RIGHTS.md` (what needs approval)
- **Past mistakes:** `.ai/LEARNINGS.md` (avoid repeating)
- **Session memory:** `.ai/SESSION_LOG.md` (context between sessions)
