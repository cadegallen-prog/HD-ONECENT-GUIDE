# Home Depot Penny Items Guide
**Agents: open `/AGENT_RULES.md` first each session and follow it.**
Calm, educational reference for the 32,000-member "Home Depot One Cent Items" community. Built with Next.js (App Router) and styled like a Wirecutter/Wikipedia hybrid: single-column, generous whitespace, minimal orange accents.

## Quick Links
- Run dev: `npm run dev` (default http://localhost:3000)
- Lint: `npm run lint` (currently flags unescaped quotes in a few legacy pages; fix as you touch them)
- Tests: `npm run test:e2e` (Playwright)
- Docs: `docs/AGENTS.md` (AI/collab), `docs/DECISIONS.md`, `docs/COOKBOOK.md`
- Legacy content: branch `main-old-static`; PDF reference lives at `public/Home-Depot-Penny-Guide.pdf`

## Stack & Scripts
- Next.js 15, TypeScript, Tailwind CSS; minimal custom components.
- Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run test:e2e`.

## Current State
- Home page rebuilt as a long-form guide with TOC, cadence/price tables, digital/in-store/checkout sections, responsible hunting, FAQ, and placeholders for images/SVGs/data.
- Palette/type lock-in: Inter headings, Georgia body, JetBrains Mono for codes; primary `#EA5B0C` used sparingly.
- Placeholders remain for hero/section imagery and SVG diagrams noted inline on the home page.

## Project Map
- `app/` — routes and layout (`page.tsx` is the main guide). Legacy subpages exist and need content/escape fixes.
- `components/` — shared UI (navbar/footer/button).
- `data/` — JSON sources for cadences, FAQs, and recent finds.
- `public/` — static assets and the downloadable PDF.
- `docs/` — living documentation (see below).

## Working Agreements
- Keep docs lean: canonical set is `README.md`, `docs/AGENTS.md`, `docs/DECISIONS.md`, and `docs/COOKBOOK.md`. Add new docs only if necessary; delete or fold outdated ones.
- Clean as you go: remove one-off test scripts, temp assets, and scratch files after use. Prefer documenting repeatable tasks in `docs/COOKBOOK.md`.
- Major choices or deviations belong in `docs/DECISIONS.md` with date/reason/impact.
- Tone stays informational (no hype, testimonials, countdowns, or gamification).

## Contributing Notes
- Branch `main` is active. `main-old-static` holds the archived static site.
- Prefer small, reviewable changes; explain testing steps in PRs.
- Accessibility and clarity first: tables for data, clear headings, anchors, and muted imagery.

## Needed Follow-Ups
- Replace image/SVG placeholders referenced in `app/page.tsx`.
- Resolve lint failures in legacy pages by escaping quotes or updating copy.
- Fill `data/recent-finds.json` with real submissions when available.*** End Patch"
