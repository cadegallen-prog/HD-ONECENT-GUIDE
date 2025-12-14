# SKILLS

Compact reference for AI agents. Describes what this project can do, where things live, and how to work efficiently.

**Usage:** Skim this file at session start alongside `AGENTS.md`. Load only files you need.

---

## Technical Skills

| Skill               | Description                              | Key Locations                               | Typical Tasks                         |
| ------------------- | ---------------------------------------- | ------------------------------------------- | ------------------------------------- |
| **Next.js 16**      | App Router with server/client components | `app/`, `layout.tsx`, `page.tsx`            | Add pages, fix routing, hydration/SSR |
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

**Status:** 9 MCP servers active - **MANDATORY usage rules apply**

**Full Reference:** See `.ai/MCP_SERVERS.md` for complete capabilities, mandatory usage patterns, and anti-patterns

| Server                | Purpose                      | MANDATORY Usage                                  | Priority    |
| --------------------- | ---------------------------- | ------------------------------------------------ | ----------- |
| `sequential-thinking` | Structured reasoning         | ANY complex task, planning, multi-step problems  | ⭐ CRITICAL |
| `memory`              | Cross-session memory         | Check at session start, save at session end      | ⭐ CRITICAL |
| `memory-keeper`       | Project context persistence  | Check before structural changes                  | ⭐ CRITICAL |
| `next-devtools`       | Next.js runtime/build errors | BEFORE and AFTER every change                    | ⭐ CRITICAL |
| `playwright`          | Browser automation           | ALL UI changes (screenshots required)            | ⭐ CRITICAL |
| `context7`            | Up-to-date library docs      | Verify Next.js 16, React 19, Tailwind patterns   | High        |
| `filesystem`          | Read/write repo files        | Targeted file reads/edits                        | Medium      |
| `github`              | GitHub API (PRs, issues)     | Create PRs, request reviews, CI                  | Medium      |
| `git`                 | Version control ops          | Check branch before declaring work complete      | Medium      |

**REMOVED:** `chrome-devtools` (replaced by Playwright), `pylance` (not needed)

**Dev Commands:**

```bash
npm run dev      # Dev server (localhost:3001)
npm run build    # Production build — ALWAYS run before done
npm run lint     # ESLint check
npm test:unit    # Run unit tests
```

**⚠️ CRITICAL MCP Usage Rules:**

**MANDATORY - YOU MUST:**
✅ Read `.ai/MCP_SERVERS.md` at session start (contains full mandatory rules)
✅ Use Sequential Thinking for complex tasks (NOT optional)
✅ Check Memory MCPs at session start (don't repeat past mistakes)
✅ Use Next-Devtools BEFORE and AFTER changes (catch errors early)
✅ Use Playwright for ALL UI changes (screenshots required)
✅ Use Context7 to verify current library docs (your training is outdated)
✅ Check git branch before declaring work complete
✅ Save context to Memory MCPs at session end

**FORBIDDEN - YOU MUST NOT:**
❌ Skip MCPs to "save time" - bugs cost more than MCP usage
❌ Assume you know current library patterns - verify with Context7
❌ Ship UI changes without Playwright testing - browser validation required
❌ Skip Sequential Thinking for "simple" tasks - validate that assumption
❌ Ignore Next-Devtools errors - they're real, not "just dev server"
❌ List entire directory trees - use glob patterns instead
❌ Poll GitHub API repeatedly - rate limits apply

**Session Workflow Checklist:**
1. Session start: Check Memory MCPs, read `.ai/MCP_SERVERS.md`
2. During work: Use Sequential Thinking → Context7 → Next-Devtools → Playwright
3. Session end: Next-devtools check → Playwright test → Memory save → docs update

**Common MCP Anti-Patterns:**

```typescript
// ❌ BAD: Exploring entire codebase
list_dir("/")
list_dir("/app")
list_dir("/app/about")
// ... 50 more

// ✅ GOOD: Use file_search
file_search({ query: "**/*.tsx" })

// ❌ BAD: Repeated reads
read_file("README.md")
// later...
read_file("README.md")

// ✅ GOOD: Cache in session
// Read once, remember context

// ❌ BAD: Wrong tool for local files
github_get_file_contents({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  path: "components/navbar.tsx",
})

// ✅ GOOD: Use filesystem
read_file("components/navbar.tsx")
```

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
