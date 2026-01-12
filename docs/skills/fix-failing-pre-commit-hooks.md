git add .
git commit -m "your message"

# Skill: Fix Failing Pre-Commit Hooks

## What runs

1. Prettier via lint-staged 2) Security scan 3) Color lint

## Identify failure fast

- Read hook output: formatting | security | color

## Fix by type

- **Formatting:** `npx prettier --write .` → `git add .`
- **Security:** `npm run security:scan` → remove keys/emails/phone numbers
- **Color:** `npm run lint:colors` → replace raw Tailwind with CSS vars

## Quick commands

- Re-run hook manually: `bash .husky/pre-commit`
- Emergency (avoid): `git commit --no-verify -m "..."`
- Husky not running: `npm run prepare` and ensure `.husky/pre-commit` exists
- lint-staged weirdness: `rm -rf node_modules package-lock.json && npm install`

## Prevention

- Let auto-format run; keep secrets in env; use design tokens; `npm run qa:fast` before push
