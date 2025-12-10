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

**Status:** 6 MCP servers active (filesystem, github, git, chrome-devtools, pylance, sequential-thinking)

**Full Reference:** See `.ai/MCP_SERVERS.md` for complete capabilities, examples, and troubleshooting

| Server                | Purpose                  | When to Use                         | Avoid                                        | Priority |
| --------------------- | ------------------------ | ----------------------------------- | -------------------------------------------- | -------- |
| `filesystem`          | Read/write repo files    | Targeted file reads/edits           | Scanning entire trees, repeated reads        | High     |
| `github`              | GitHub API (PRs, issues) | Create PRs, request reviews, CI     | Polling repeatedly, using for local files    | Medium   |
| `git`                 | Version control ops      | Check branch, status, diffs         | Complex ops (rebase), repeated status checks | Medium   |
| `chrome-devtools`     | Browser automation       | Responsive tests, network debugging | Unit tests, long E2E flows                   | Low      |
| `pylance`             | Python analysis          | Syntax validation, run snippets     | Long scripts, user input scripts             | Low      |
| `sequential-thinking` | Extended reasoning       | Complex decisions, multi-step plans | Simple tasks, speed-critical operations      | Low      |

**Dev Commands:**

```bash
npm run dev      # Dev server (localhost:3001)
npm run build    # Production build — ALWAYS run before done
npm run lint     # ESLint check
npm test:unit    # Run unit tests
```

**MCP Best Practices:**

✅ **DO:**

- Use specific file/line ranges when reading
- Check git branch before declaring success
- Cache information already retrieved
- Use filesystem for local files, github for remote repos
- Run `pylanceRunCodeSnippet` for Python instead of terminal
- Batch operations when possible

❌ **DON'T:**

- List entire directory trees (use `file_search` with glob patterns)
- Read same file multiple times
- Poll GitHub API repeatedly (rate limits)
- Use GitHub MCP for local file operations
- Run long Python scripts via Pylance (use `run_in_terminal` with `isBackground=true`)
- Declare changes live without verifying deployment to `main` branch

**Token Cost Hierarchy** (most to least expensive):

1. Sequential Thinking (deepest reasoning)
2. Chrome DevTools (network requests, screenshots)
3. GitHub API (JSON payloads)
4. Filesystem (targeted reads)
5. Git (status checks)
6. Pylance (syntax validation)

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
