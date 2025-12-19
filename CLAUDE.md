# Penny Central - Claude Guide

## Read First (in order)

1. `.ai/VERIFICATION_REQUIRED.md` ⛔ NO PROOF = NOT DONE
2. `.ai/CONSTRAINTS.md` - Most violated rules
3. `.ai/GROWTH_STRATEGY.md` - **Business goals & context (START HERE for new sessions)**
4. `.ai/STATE.md` - Current snapshot
5. `.ai/BACKLOG.md` - What to work on

**Then ask:** GOAL / WHY / DONE for this session.

---

## Critical Rules

### Rule #1: Verification

- **All 4 tests MUST pass** (lint, build, test:unit, test:e2e)
- **Paste output** as proof
- **Screenshots** for UI changes (Playwright)
- **GitHub Actions** URL if applicable

### Rule #2: Port 3001

```bash
netstat -ano | findstr :3001
# IF RUNNING → use it (don't kill)
# IF NOT → npm run dev
```

### Rule #3: Colors

- ❌ NO raw Tailwind (`blue-500`, `gray-600`)
- ✅ USE CSS variables (`var(--cta-primary)`)
- ✅ OR get approval first

### Rule #4: Internet SKU map (backend-only)

- Use the private internet-SKU map only to generate outbound Home Depot product links on the backend.
- The UI should continue showing the regular SKU only; internet SKU must stay private.
- Keep the map in private storage (env/Blob/Drive) and never commit it.
- Fallback: when a mapping is missing, build links from the regular SKU.

---

## MCP Servers (4 available)

1. **Filesystem** - files (use automatically)
2. **Git** - version control (use automatically)
3. **GitHub** - PRs/issues (use when needed)
4. **Playwright** - browser testing (REQUIRED for UI)

**Playwright required for:**

- UI changes (buttons, forms, layouts, colors)
- JavaScript changes (Store Finder, interactive)
- "Bug fixed" claims (visual bugs)

---

## Quality Gates

```bash
npm run lint        # 0 errors
npm run build       # successful
npm run test:unit   # all passing
npm run test:e2e    # all passing
```

**All 4 must pass. Paste output.**

---

## Never Touch

- `globals.css` (without approval)
- Port 3001 (check first, use if running)
- `/components/store-map.tsx` (fragile)

---

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind (custom tokens)
- React-Leaflet
- Vercel

---

## See Also

- `.ai/GROWTH_STRATEGY.md` - **Business goals & owner context**
- `.ai/CONTRACT.md` - Collaboration rules
- `.ai/DECISION_RIGHTS.md` - What needs approval
- `.ai/LEARNINGS.md` - Past mistakes
- `.ai/SESSION_LOG.md` - Recent work
