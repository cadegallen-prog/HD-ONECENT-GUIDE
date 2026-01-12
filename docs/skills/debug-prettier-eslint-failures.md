# Skill: Debug Prettier/ESLint Failures

## Fast path

```bash
npx prettier --write .
npm run lint -- --fix
npm run lint
```

## Why it fails

- Lint runs with `--max-warnings=0`; any warning fails.
- Most are `prettier/prettier` (formatting); others are real lint rules.

## Read and fix

```
file.ts 14:15  warning  prettier/prettier → Replace X with Y
```

- Formatting: `npx prettier --write file.ts`
- TS/React/import rules: try `npm run lint -- --fix`, else apply message (remove unused vars, add types, update imports).

## Common fixes

- CRLF vs LF: run Prettier.
- Unused var: delete or prefix `_var`.
- Parsing error: fix TS syntax at the line shown.

## If hook/CI blocks

- Hook not running: `npm run prepare`
- Check `.prettierignore` if file not touched
- Still failing: manual fix; avoid disabling rules unless truly necessary (`// eslint-disable-next-line <rule>`)

## Prevent

- Enable format on save (Prettier) in VS Code.
- Let pre-commit formatter run; don't `--no-verify` unless emergency.

## Validate

```bash
npx prettier --write .
npm run lint
npm run qa:fast
```
