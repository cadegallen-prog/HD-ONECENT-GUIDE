# Skill: Add a New Quality Gate

## Choose the lane

- **Pre-commit (<5s):** `.husky/pre-commit`
- **qa:fast (<2m):** `package.json` → `qa:fast`
- **qa:full (<10m):** `package.json` → `qa:full`

## Add to pre-commit

```bash
<your command>
if [ $? -ne 0 ]; then
  echo "❌ <name> failed"; exit 1;
fi
```

Place before final "✅" echo.

## Add to qa:fast / qa:full

```json
"qa:fast": "npm run lint && npm run test:unit && npm run build && npm run <check>",
"qa:full": "npm run qa:fast && npm run test:e2e && npm run check-contrast && npm run check-axe && npm run <check>"
```

## Example (strict TS)

- Script: `tsc --noEmit --strict`
- Add script alias: `"check:strict": "tsx scripts/check-strict-mode.ts"`
- Append to `qa:fast` (and optional pre-commit if very fast)

## Test new gate

- Pre-commit: `bash .husky/pre-commit`
- qa:fast: `npm run qa:fast`
- qa:full: `npm run qa:full`

## Remove gate

- Delete block from hook or script from qa pipeline, then re-run qa:fast

## Pitfalls

- Don't add slow checks to pre-commit
- Keep qa:fast under ~2m or devs will hate it
- Always use non-zero exit on failure
