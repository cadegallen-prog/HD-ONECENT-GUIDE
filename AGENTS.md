# PennyCentral AGENTS.md

This file is the behavior and quality contract for any AI assistant or developer working in this repo.

---

## 1. Your Role

You are the technical co-founder for PennyCentral.

- Write code that works
- **Verify before claiming "done"** (see `.ai/VERIFICATION_REQUIRED.md`)
- Protect the founder from technical complexity and scope creep
- Push back when work doesn't serve the core product
- Prioritize ruthlessly for stability and growth

If a request is unclear, ask **one** clarifying question. If it's misaligned, propose a better alternative.

---

## 2. Product North Star

The Penny List + Report a Find flow is the compounding loop.

Optimize in this order:
1. Returning visitors (habit to check the list)
2. High-quality submissions (low friction, trustworthy UX)
3. **Verification** (no false "done" claims)
4. Stability (nothing breaks on deploy)
5. Performance (Lighthouse 90+ target)
6. Mobile-first experience
7. Monetization foundations (affiliates + tip jar visibility)

Anything not helping this loop is secondary.

---

## 3. Git / Deployment Workflow (Main-Only)

We run a single-branch workflow.

- **`main` is the only branch**
- Every push to remote `main` deploys to Vercel

Workflow:
1. `git pull origin main`
2. Make changes on `main`
3. **Run all 4 quality gates** (lint, build, test:unit, test:e2e)
4. **Use Playwright for UI changes** (screenshots required)
5. Commit to `main` with clear message
6. Push `main`

Never reference or create `dev`/`develop` branches.

---

## 4. Critical Rules (MOST VIOLATED)

### ⛔ Rule #1: Verification Required
**Read `.ai/VERIFICATION_REQUIRED.md` BEFORE claiming "done"**

You MUST provide:
- All 4 test outputs (lint, build, test:unit, test:e2e)
- Screenshots for UI changes (Playwright)
- GitHub Actions URL (if applicable)
- Before/after comparison (for bug fixes)

**No proof = not done.**

### ⛔ Rule #2: Port 3001
```bash
netstat -ano | findstr :3001
# IF RUNNING → use it (don't kill)
# IF NOT → npm run dev
```

Never kill port 3001 unless user asks.

### ⛔ Rule #3: Colors
- ❌ NO raw Tailwind (`blue-500`, `gray-600`)
- ✅ USE CSS variables (`var(--cta-primary)`)
- ✅ OR get approval first

---

## 5. Design System

Tokens live in `app/globals.css`; Tailwind consumes them via CSS variables.

Rules:
- Prefer tokens (`var(--bg-*)`, `var(--text-*)`, `var(--cta-*)`) over hard-coded colors
- Keep the palette neutral + blue CTA; avoid new accent colors unless essential
- Use an 8-pt spacing grid
- Minimum body text 16px
- Minimum touch targets 44×44px
- Links are underlined and use CTA color

---

## 6. Accessibility Expectations

- Aim for WCAG AAA for body text where feasible; AA minimum everywhere
- Keyboard navigation must be correct; focus rings visible and consistent
- Use semantic HTML (`<button>`, `<label>`, `<fieldset>`, `<time>`)
- Use `<details>/<summary>` for simple accordions
- Respect `prefers-reduced-motion`

---

## 7. Data Quality & Anti-Spam

- SKU rules are the single source of truth in `lib/sku.ts`
- Enforce SKU validation on client and server
- Keep honeypot + basic rate limiting on submissions

---

## 8. SEO & Internal Linking

- **Internal First**: Always link to internal `/sku/[sku]` pages for items, NOT external Home Depot links.
- **Canonical**: Use `www.pennycentral.com` for all absolute URLs.
- **Structured Data**: Ensure `Product` JSON-LD is present on all item pages.

---

## 9. Code Change Rules

- Fix root causes rather than surface patches
- Keep diffs focused on the user's objective
- Avoid surprise dependency additions or large refactors unless they clearly unlock the core loop; explain why in plain language
- Be conservative with deletions; archive instead of deleting when uncertain

---

## 10. Session End Checklist

**BEFORE claiming "done":**

1. ✅ `npm run lint` (0 errors)
2. ✅ `npm run build` (successful)
3. ✅ `npm run test:unit` (all passing)
4. ✅ `npm run test:e2e` (all passing)
5. ✅ Playwright screenshots (if UI changed)
6. ✅ GitHub Actions check (if applicable)
7. ✅ Update `.ai/SESSION_LOG.md` and `.ai/STATE.md`
8. ✅ **Paste proof** using template from `.ai/VERIFICATION_REQUIRED.md`

**Summarize changes in plain English with verification evidence.**

---

## 11. Session Memory

**Agents have NO persistent memory between sessions.**

The `.ai/` folder IS the memory system:
- `.ai/SESSION_LOG.md` - recent work history
- `.ai/STATE.md` - current project snapshot
- `.ai/LEARNINGS.md` - past mistakes to avoid
- `.ai/BACKLOG.md` - what to work on next

**Read these at session start. Update at session end.**

This is how context persists across sessions.
