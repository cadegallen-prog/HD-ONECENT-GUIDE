# Format & Lint Guidance (Next.js + Python with Ruff)

## Summary

This project now uses **Prettier + ESLint** for Next.js (JS/TS) and **Ruff** as the primary Python formatter + linter. Pylance provides strict type checking. All tools are integrated into VS Code, pre-commit hooks, and CI workflows.

---

## Next.js (JavaScript/TypeScript)

### Tools

- **Prettier** for formatting
- **ESLint** for code quality
- **eslint-config-prettier** to disable conflicting stylistic rules

### Configuration

- `eslint.config.mjs`: Prettier is now **last** in the config array so it wins on formatting disputes
- `.vscode/settings.json`: Prettier is the default formatter with format-on-save enabled
- `lint-staged` in `package.json`: Auto-formats files on git commit

### Commands

```bash
npm run lint              # Run ESLint
npm run build             # Build and check TS/Next
npm run qa:fast           # lint + unit tests + build
```

---

## Python (Scripts + Backend)

### Tools

- **Ruff** (primary): Fast, all-in-one formatter + linter (replaces Black + Pylint for most use cases)
- **Pylance** (`ms-python.vscode-pylance`): Strict type checking in VS Code
- **Pylint** (optional): For deep logic analysis if needed

### Configuration

- `.ruff.toml` (new): Project-level Ruff config (line-length, rules, import sorting)
- `.pre-commit-config.yaml` (new): Auto-runs Ruff format + check on commit
- `.vscode/settings.json`: Ruff is the default Python formatter with format-on-save + full fixes enabled

### Key Rules (`.ruff.toml`)

- **Line length**: 88 (Black compatible)
- **Lint select**: E (errors), F (pyflakes), W (warnings), I (imports), B (bugbear)
- **Ignore**: E203 (whitespace before colon), E501 (long lines, handled by formatter)
- **Import sorting**: Enabled with stdlib/third-party/first-party classification

### Commands

```bash
# Local (after running `pip install ruff==0.7.4`)
python -m ruff format .           # Auto-format all Python files
python -m ruff check .            # Lint and report issues
python -m ruff check . --fix      # Auto-fix lintable issues

# CI (GitHub Actions)
# Both quality.yml and full-qa.yml now run:
# - ruff format --check .
# - ruff check .
```

---

## Recommended VS Code Workspace Settings

```jsonc
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
  },

  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit",
      "source.fixAll": true,
    },
  },
  "python.analysis.typeCheckingMode": "strict",
}
```

---

## Recommended VS Code Extensions

- `esbenp.prettier-vscode` (Prettier)
- `dbaeumer.vscode-eslint` (ESLint)
- `bradlc.vscode-tailwindcss` (Tailwind CSS)
- `ms-python.python` (Python)
- `ms-python.vscode-pylance` (Pylance)
- `charliermarsh.ruff` (Ruff)

---

## CI & Deployment

### Quality Workflows (GitHub Actions)

- `.github/workflows/quality.yml`: Fast checks (lint + unit tests + build + Ruff Python checks)
- `.github/workflows/full-qa.yml`: Full checks (quality + E2E + accessibility + Ruff Python checks)

Both workflows now run:

```yaml
- name: Setup Python
  uses: actions/setup-python@v4
  with:
    python-version: "3.11"
- name: Install Ruff
  run: pip install ruff==0.7.4
- name: Ruff format check
  run: ruff format --check .
- name: Ruff lint
  run: ruff check .
```

### Failure Guards (Snyk, SonarCloud)

- Snyk, SonarCloud, and other external services now have `if: env.TOKEN != ''` guards to prevent CI failures when tokens are missing or exhausted
- These services run when secrets are present; they gracefully skip when unavailable

---

## Pre-Commit Hooks

The `.pre-commit-config.yaml` automatically runs on `git commit`:

- **Ruff format**: Auto-fixes Python formatting
- **Ruff check**: Lints and auto-fixes where possible
- **Standard pre-commit hooks**: Trailing whitespace, EOL fixes, YAML validation, large file checks

Install pre-commit:

```bash
pip install pre-commit
pre-commit install
```

---

## Known Python Lint Issues (Remaining)

As of the migration, Ruff found **6 remaining issues** (non-critical):

1. **Import sorting** in `scripts/` (e.g., `enrich-penny-list.py`, `purchase-history-to-sheet-import.py`)
   - These will auto-fix on next `ruff format` run
2. **Mixed tabs/spaces** in `scripts/build-consolidated-import.py` (docstring indentation)
   - Requires manual fix (convert tabs to spaces in doc comments)
3. **Unused loop variables** in `scripts/csv-to-penny-json.py` and `scripts/merge-verified-backup.py`
   - Simple fix: rename `sku` → `_sku` in those loops

These are low-priority and can be fixed incrementally or ignored if the scripts work correctly.

---

## Migration Notes

- **Full migration**: Moved from Black + Pylint to Ruff (all-in-one) for speed and simplicity
- **Prettier stays**: No changes to JS/TS formatting (Prettier still handles it)
- **Pylance enabled**: Strict type checking for Python in VS Code
- **CI integrated**: All workflows now include Ruff checks alongside existing tests

---

## Next Steps for the Agent

1. Run `npm run qa:fast` before committing to ensure all gates pass
2. Run `python -m ruff format .` and `python -m ruff check . --fix` on any Python file edits
3. Use pre-commit hooks (if installed) to auto-format on commit
4. Fix remaining import-sort issues in scripts when you next edit those files
5. If you see new Ruff warnings, check `.ruff.toml` or consult [Ruff docs](https://docs.astral.sh/ruff/)
