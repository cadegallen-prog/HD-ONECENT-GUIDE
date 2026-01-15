# Format & Lint Guidance (Next.js + Python)

This short doc codifies the workspace rules for formatting and linting so agentic coders follow a consistent setup.

## Next.js (JS/TS)

- Keep both **Prettier** (formatting) and **ESLint** (quality).
- Install and use **eslint-config-prettier** to disable conflicting stylistic rules from ESLint.
- Ensure `prettier` is the last item so it wins on formatting rules (we moved it to the end of `eslint.config.mjs`).
- Automation: **Format on Save** with Prettier as the default formatter and run ESLint autofix on save.
- Keep `prettier --write` in `lint-staged` so commits auto-format changed files.

## Python (backend / scripts)

- Use **Pylance** (`ms-python.vscode-pylance`) for fast, strict type checking and IntelliSense.
- Use **Black** as the opinionated formatter. Alternative: use **Ruff** as an all-in-one (formatter + linter) if you prefer speed and consolidation.
- Keep **Pylint** for deep logic analysis unless you migrate fully to Ruff.
- Automation: set `python.analysis.typeCheckingMode` to `strict` in VS Code settings and enable formatting on save (Black or Ruff).

## Recommended VS Code Workspace Settings

Add or confirm these settings in `.vscode/settings.json`:

```jsonc
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit",
    },
  },
  "python.analysis.typeCheckingMode": "strict",
}
```

## Recommended VS Code Extensions (workspace)

- `esbenp.prettier-vscode` (Prettier)
- `dbaeumer.vscode-eslint` (ESLint)
- `ms-python.python` (Python extension)
- `ms-python.vscode-pylance` (Pylance)
- `ms-python.black-formatter` (Black)
- `ms-python.pylint` (Pylint)
- `charliermarsh.ruff` (Ruff) — optional, recommended if you adopt Ruff

## Notes for Agents

- When modifying ESLint configs, always ensure `prettier` is last in the extends/config chain.
- Keep lint-staged or pre-commit hooks running `prettier --write` for JS/TS and `ruff format` or `black` for Python if you adopt them.
- If migrating to Ruff, update CI to run `ruff check` and `ruff format --check` and remove overlapping Pylint/Black jobs once validated.

---

If you want, I can also add a minimal `.ruff.toml` or `.pylintrc` and a `pyproject.toml` with Black settings — say the word and I’ll add them next.
