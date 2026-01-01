# Codex User Start Here

You are using **Codex** (ChatGPT, GPT-5.2 with full MCP support via `~/.codex/config.toml`).

---

## Read First (in order)

1. `.ai/VERIFICATION_REQUIRED.md` ⛔ NO PROOF = NOT DONE
2. `.ai/CONSTRAINTS.md` - Most violated rules
3. `.ai/GROWTH_STRATEGY.md` - Business goals & owner context
4. `.ai/STATE.md` - Current project snapshot
5. `.ai/BACKLOG.md` - Prioritized work queue

**Then ask:** GOAL / WHY / DONE for this session.

---

## Canonical Entry Point

- The canonical session start lives in `README.md`’s `AI Canon & Read Order` section. Read that sequence before following any model-specific tips so the entire team (Claude, Codex, Copilot) stays on the same page about what to tackle and in what order.

## MCP Configuration

Your config file: `~/.codex/config.toml`

Verify all 5 servers are configured:

1. **Filesystem** - File operations (automatically available)
2. **GitHub** - PR/issue/repo management (use when needed)
3. **Playwright** - Browser testing & screenshots (REQUIRED for UI changes)
4. **Supabase** - Database queries (optional, requires env vars)
5. **Vercel** - Deployment management (optional)

**Reference template:** `.ai/CODEX_CONFIG_SNIPPET.toml`

---

## Owner Context

**Cade cannot code.** He cannot read, write, debug, or assess code quality.

Your responsibilities:

- **Architect** - Make all technical decisions
- **Guardian** - Catch mistakes, push back when needed
- **Teacher** - Explain in plain English (what/why, not how)
- **Advisor** - Offer 2-3 approaches, let Cade choose direction

---

## Critical Rules (Non-Negotiable)

### Rule #1: Verification Required

- All 4 tests MUST pass (lint, build, test:unit, test:e2e)
- Paste output as proof
- Screenshots for UI changes (use Playwright)
- GitHub Actions URL if applicable

### Rule #2: Never Kill Port 3001

```bash
netstat -ano | findstr :3001
# IF RUNNING → use it (don't kill)
# IF NOT → npm run dev
```

### Rule #3: Use Design Tokens, Not Generic Colors

- ❌ FORBIDDEN: `blue-500`, `gray-600`, `bg-blue-500`
- ✅ REQUIRED: `var(--cta-primary)`, `var(--background)`
- ✅ OR: Get approval before adding new colors

### Rule #4: Internet SKU Map (Backend-Only)

- Use private SKU map only on backend for Home Depot links
- UI displays regular SKU only (never surface internet SKU)
- Store in private storage (env var, Vercel Blob, Drive) - never commit
- Always fall back to regular SKU when mapping missing

### Rule #5: Session Log Trim

- After adding a session entry, if `.ai/SESSION_LOG.md` has >5 entries, trim to 3 most recent
- Git history preserves everything

---

## Quality Gates (ALWAYS Required)

```bash
npm run lint        # 0 errors
npm run build       # successful
npm run test:unit   # all passing
npm run test:e2e    # all passing
```

**No exceptions. Paste output.**

---

## Never Touch (Without Explicit Permission)

- `globals.css` - Site-wide styling via CSS variables (fragile)
- `/components/store-map.tsx` - React-Leaflet hydration sensitive (fragile)
- Port 3001 - Check first, use if running
- Build configuration - `next.config.js`, `tsconfig.json`, `tailwind.config.ts`

---

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind (custom design tokens)
- React-Leaflet
- Vercel deployment

**Live at:** https://pennycentral.com

---

## See Also

- `.ai/AGENT_POOL.md` - Specialized agent roles
- `.ai/ORCHESTRATION.md` - How to chain agents
- `.ai/DECISION_RIGHTS.md` - What needs approval
- `.ai/LEARNINGS.md` - Past mistakes to avoid
- `.ai/SESSION_LOG.md` - Recent work history
