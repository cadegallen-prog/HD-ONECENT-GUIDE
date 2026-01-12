# Skill: Investigate GitHub Actions QA Failures

## Quick path

1. Open Actions: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions
2. Click failed run → pick failed job (qa-fast or qa-full)
3. Scroll to failed step and read the command output

## Typical commands per job

- qa-fast: `npm run lint` → `npm run test:unit` → `npm run build`
- qa-full: qa-fast + `npm run test:e2e` + `npm run check-contrast` + `npm run check-axe`

## Fast fixes by symptom

- **Lint (most common):** Prettier warnings. Run `npx prettier --write .`, commit, push. See debug-prettier/ESLint skill.
- **Build:** Type errors. Run `npm run build`, fix types, push.
- **Unit tests:** `npm run test:unit`, fix failing tests/logic, push.
- **E2E:** `npm run test:e2e`, update selectors or fix UI bug, push.
- **Install/lockfile:** `rm -rf node_modules package-lock.json && npm install`, re-run qa:fast, commit lockfile, push.

## Reproduce locally (do this before pushing)

```bash
git pull origin main
rm -rf node_modules && npm install
npm run lint && npm run test:unit && npm run build
npm run test:e2e   # if investigating qa:full
```

Fix issues → rerun → push.

## Re-run in Actions

Use "Re-run jobs" only for flaky failures; otherwise fix locally first.

## Prevention

- Always `npm run qa:fast` before push
- Let pre-commit hook auto-format
- Keep lockfile in sync
