# Hang Audit (Dec 15, 2025)

## Goal

Reduce repeated "command won't exit" / "loops after Ctrl+C" incidents by removing `npx` from execution paths and hardening long-running scripts with timeouts + guaranteed cleanup.

## Scripts / paths checked

- `package.json` scripts
- CI workflow: `.github/workflows/quality.yml`
- Local scripts:
  - `scripts/check-axe.js`
  - `scripts/check-contrast.js`
  - `scripts/run-audit.ps1`
  - `scripts/capture-store-finder-proof.ts`

## What could hang (and why)

- `scripts/check-axe.js`
  - Previously used `spawnSync("npx", ...)`.
  - `npx` can block on first-run downloads/prompting or caching issues, and can feel like it “loops” when combined with Ctrl+C in terminals.

- `scripts/check-contrast.js`
  - Previously navigated with `waitUntil: "networkidle"`.
  - Pages with maps/analytics can keep connections open, so `networkidle` may never be satisfied.

- `scripts/run-audit.ps1`
  - Previously used `npx lighthouse ...` per page.
  - `npx` can download/resolve on every run or stall if npm cache/network is unhappy.

- `scripts/capture-store-finder-proof.ts`
  - Previously spawned the dev server via `npx next dev` and had only partial cleanup.
  - On Windows, `.cmd` spawning and process tree cleanup are common sources of stuck processes.

## Changes made

- Removed `npx` from execution paths:
  - `scripts/check-axe.js` now runs the local CLI via `node node_modules/@axe-core/cli/bin/axe.js ...`.
  - `.github/workflows/quality.yml` now runs `npm run check-axe` instead of `npx @axe-core/cli ...`.
  - `scripts/run-audit.ps1` now runs Lighthouse via `node node_modules/lighthouse/cli/index.js ...`.

- Reduced hang risk:
  - `scripts/check-contrast.js` now uses `waitUntil: "domcontentloaded"` with explicit navigation timeouts, plus a global hard timeout.
  - `scripts/capture-store-finder-proof.ts` now:
    - spawns Next using the local binary (no `npx`),
    - enforces a global hard timeout,
    - uses `try/finally` cleanup,
    - kills the server process tree on Windows using `taskkill /T /F`,
    - prints `DONE` on success.

## Verification notes

See command outputs in the associated session for:

- `npm run lint:colors`
- `npm run test:unit`
- `npm run check-axe`
- `npm run check-contrast`
