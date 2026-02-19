# Skill: Local Dev Faststart

## Quick start

```bash
npm install
npm run dev
```

- Dev server runs on **http://localhost:3001** (`npm run dev`).
- Turbo mode (optional): `npm run dev:turbo`.
- Production build check: `npm run build`.

## Required/typical env vars

- Supabase (required in production; optional for local):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- Analytics switch (optional): `NEXT_PUBLIC_ANALYTICS_ENABLED=true|false`

Authoritative reference: `.ai/ENVIRONMENT_VARIABLES.md`.

## Playwright / e2e

- `npm run test:e2e` uses **http://localhost:3002** by default.
- Config: `playwright.config.ts`.
- The Playwright web server runs with `PLAYWRIGHT=1` (fixture data) and uses `next start` on port 3002 by default.

## Ports stuck? (Never kill 3001)

1. **Check if 3001 is already in use:**
   - macOS/Linux: `lsof -i :3001`
   - Windows: `netstat -ano | findstr :3001`
2. **If 3001 is in use, do NOT kill it.** Reuse the running server.
3. **If 3001 is free,** run `npm run dev`.

Rule source: `.ai/CRITICAL_RULES.md` and `AGENTS.md`.

## One-command stuck-port reset (founder helper)

If `3001` is occupied but the page is not loading:

```bash
npm run dev:reset-3001
```

What it does:

- Checks `http://localhost:3001` health
- Kills stale `3001` listener(s) only when unhealthy
- Starts `npm run dev`

Related helpers:

- `npm run dev:Reset-3001` (same command alias)
- `npm run dev:reset-3001:cleanup` (cleanup only, no dev start)
- `npm run dev:Reset-3001:cleanup` (cleanup alias)
- `npm run dev:reset-3001:force` (restart even if healthy)
