# Local Dev Faststart

## Quick Start (documented commands)

```bash
npm install
npm run dev
```

- Dev server runs on **http://localhost:3001** (`npm run dev`).
- Production preview: `npm run build` then `npm run start` (also uses 3001).
- E2E tests: `npm run test:e2e` (Playwright uses port 3002 by default).

## Required/Expected Env Vars

From `README.md`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `NEXT_PUBLIC_ANALYTICS_ENABLED` (set to `false` to disable analytics)

## Node Version

- `node 22.x` (see `package.json` engines).

## Ports Stuck (Do NOT kill 3001)

First check if 3001 is already in use:

```bash
netstat -ano | findstr :3001
```

Alternative (non-Windows):

```bash
lsof -i :3001
```

**If 3001 is in use, reuse it.** Do not kill the process unless explicitly asked.

## Common Verify Commands

```bash
npm run lint
npm run build
npm run test:unit
npm run test:e2e
```

Optional helpers:

```bash
npm run ai:doctor
npm run ai:verify
npm run ai:proof
```
