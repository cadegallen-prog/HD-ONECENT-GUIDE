# Penny Central Development Guide

⚠️ **BEFORE DOING ANYTHING:** Read ALL files in the `.ai/` directory for the collaboration protocol:
- `.ai/CONTRACT.md` - Collaboration rules (what Cade provides, what you provide)
- `.ai/DECISION_RIGHTS.md` - What you can decide vs. must get approval for
- `.ai/STATE.md` - Current project snapshot (read first)
- `.ai/BACKLOG.md` - Ordered next tasks (default work source)
- `.ai/CONSTRAINTS.md` - Fragile areas you must NOT touch
- `.ai/SESSION_LOG.md` - Recent work history and context
- `.ai/LEARNINGS.md` - Past mistakes to avoid
- `.ai/CONTEXT.md` - Stable mission and audience
- ⭐ `.ai/MCP_SERVERS.md` - **MANDATORY MCP usage rules** (9 servers available)

Then ask Cade for **GOAL / WHY / DONE** for this session.

---

## ⚠️ CRITICAL: MCP Usage Requirements

You have access to 9 Model Context Protocol (MCP) servers. **You MUST use them proactively**:

1. **Sequential Thinking** - Use for ANY complex task, planning, or multi-step problem. NOT optional.
2. **Memory + Memory-Keeper** - Check at session start. Save context at session end. NO EXCEPTIONS.
3. **Next-Devtools** - Check for errors BEFORE and AFTER changes. Required for task completion.
4. **Playwright** - Test UI changes in browser. Screenshots required for user-facing changes.
5. **Context7** - Verify current library docs. Your training data is outdated for Next.js 16, React 19.

**Read `.ai/MCP_SERVERS.md` immediately for complete mandatory usage rules and anti-patterns.**

**NO SHORTCUTS. NO LAZINESS. NO EXCUSES.**

---

## Project Overview

PennyCentral.com is a Next.js 16 app serving the Home Depot penny hunting community.
It's the official resource for a 40,000+ member Facebook group.

## Tech Stack

- Next.js 16 with App Router
- TypeScript (strict mode)
- Tailwind CSS with custom design tokens
- React-Leaflet for store finder map
- Deployed on [Vercel/wherever]

## Architecture Rules

### NEVER do these things:

- Don't modify globals.css without explicit approval
- Don't add new dependencies without documenting why
- Don't change the map component (store-map.tsx) without testing all 51 store pins
- Don't remove "use client" directives without understanding why they're there

### ALWAYS do these things:

- Run `npm run build` before considering any task complete
- Run `npm run lint` and fix all errors
- When fixing a bug, explain what caused it before implementing the fix
- When adding features, describe the approach first and wait for approval

## File Structure

/app - Next.js app router pages
/components - Reusable React components  
/lib - Utility functions and data
/public - Static assets

## Known Fragile Areas

- React-Leaflet hydration (must use dynamic imports with ssr: false)
- Store finder search relies on Zippopotam API for ZIP geocoding (free, no key needed)

## Current Priorities

1. User retention anchors (daily/weekly return reasons)
2. Stability over new features
3. Mobile experience

## What NOT to Work On

- Automation/scraping systems (separate repo)
- Facebook group management
- Anything requiring new API integrations without discussion
