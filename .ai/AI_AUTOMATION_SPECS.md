# AI Automation Specifications

**Created:** Dec 25, 2025
**Purpose:** Concrete implementation specifications for AI enablement infrastructure. This is the tactical "exactly how" document that complements the strategic "why and what" in `AI_ENABLEMENT_BLUEPRINT.md`.

**When to read:** Before implementing any enablement work from the backlog.

---

## Implementation Sessions

Each session is self-contained. Mark checkboxes as you complete items.

### Session 1: Core Automation Scripts
**Status:** ✅ Complete
**Prerequisites:** None

```
☑ Create scripts/ai-doctor.ts - health check
☑ Create scripts/ai-verify.ts - verification bundle
☑ Add npm scripts to package.json (ai:doctor, ai:verify)
☑ Test: npm run ai:doctor passes
☑ Test: npm run ai:verify runs all 4 gates
☑ Update this file: mark Session 1 complete
```

### Session 2: Screenshot Automation + Commands
**Status:** ✅ Complete
**Prerequisites:** Session 1 complete

```
☑ Create scripts/ai-proof.ts - screenshot capture
☑ Create .claude/commands/doctor.md
☑ Create .claude/commands/verify.md
☑ Create .claude/commands/proof.md
☑ Test: npm run ai:proof -- /penny-list captures screenshots
☑ Test: /doctor command works in Claude Code
☑ Update this file: mark Session 2 complete
```

### Session 3: Enforcement + Manifest
**Status:** Not Started
**Prerequisites:** Session 2 complete

```
□ Install husky: npm install -D husky
□ Initialize husky: npx husky init
□ Create .husky/pre-commit hook
□ Create .ai/TOOLING_MANIFEST.md
□ Test: pre-commit hook blocks raw Tailwind colors
□ Test: pre-commit hook runs security scan
□ Update this file: mark Session 3 complete
```

### Session 4: Documentation Cleanup
**Status:** Not Started
**Prerequisites:** Session 3 complete

```
□ Create .ai/archive/ directory
□ Move unused playbooks to archive
□ Create .ai/APPROVAL_MATRIX.md (merged from 3 docs)
□ Update CONTRACT.md to reference APPROVAL_MATRIX
□ Update CONSTRAINTS.md to reference APPROVAL_MATRIX
□ Update AI-TOOLS-SETUP.md (fix stale MCP references)
□ Update this file: mark Session 4 complete
```

---

## Script Specifications

### `npm run ai:doctor` - Health Check

**File:** `scripts/ai-doctor.ts`

**Purpose:** Pre-flight check before any coding session starts.

**What it checks:**

| Check | Pass Condition | Fail Action |
|-------|---------------|-------------|
| Port 3001 | If running: "Reuse existing server" | If not: "Run npm run dev to start" |
| Required env vars | All present (don't print values) | List missing vars |
| Playwright browser | Chromium installed | "Run npx playwright install chromium" |
| Node version | v18+ | Warn about version |

**Output format:**
```
╔══════════════════════════════════════╗
║         AI Doctor Health Check       ║
╠══════════════════════════════════════╣
║ Port 3001:     ✅ Running (reuse it) ║
║ Env vars:      ✅ All present        ║
║ Playwright:    ✅ Chromium ready     ║
║ Node version:  ✅ v22.x              ║
╠══════════════════════════════════════╣
║ Status: READY TO CODE                ║
╚══════════════════════════════════════╝
```

**Implementation pattern:**
```typescript
// scripts/ai-doctor.ts
import { execSync } from 'child_process';
import net from 'net';

async function checkPort3001(): Promise<{ running: boolean }> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve({ running: true }));
    server.once('listening', () => {
      server.close();
      resolve({ running: false });
    });
    server.listen(3001);
  });
}

function checkEnvVars(): { missing: string[] } {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  const missing = required.filter((v) => !process.env[v]);
  return { missing };
}

function checkPlaywright(): boolean {
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ... main function runs all checks and formats output
```

---

### `npm run ai:verify` - One-Command Proof Bundle

**File:** `scripts/ai-verify.ts`

**Purpose:** Run all 4 quality gates and save proof for pasting into responses.

**What it does:**
1. Runs `npm run lint` → captures output
2. Runs `npm run build` → captures output
3. Runs `npm run test:unit` → captures output
4. Runs `npm run test:e2e` → captures output
5. Saves all outputs to `reports/verification/[timestamp]/`
6. Generates markdown summary

**Output directory structure:**
```
reports/verification/2025-12-25T10-30-00/
├── lint.txt
├── build.txt
├── unit.txt
├── e2e.txt
└── summary.md
```

**summary.md format:**
```markdown
## Verification Bundle - Dec 25, 2025 10:30:00

### Results
| Gate | Status | Details |
|------|--------|---------|
| Lint | ✅ Pass | 0 errors, 0 warnings |
| Build | ✅ Pass | Compiled successfully |
| Unit | ✅ Pass | 21/21 tests passing |
| E2E | ✅ Pass | 64/64 tests passing |

### Proof
Outputs saved to: `reports/verification/2025-12-25T10-30-00/`
```

**Implementation pattern:**
```typescript
// scripts/ai-verify.ts
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.join('reports', 'verification', timestamp);

fs.mkdirSync(outDir, { recursive: true });

const gates = [
  { name: 'lint', cmd: 'npm run lint' },
  { name: 'build', cmd: 'npm run build' },
  { name: 'unit', cmd: 'npm run test:unit' },
  { name: 'e2e', cmd: 'npm run test:e2e' },
];

const results: { name: string; pass: boolean; output: string }[] = [];

for (const gate of gates) {
  try {
    const output = execSync(gate.cmd, { encoding: 'utf8', stdio: 'pipe' });
    fs.writeFileSync(path.join(outDir, `${gate.name}.txt`), output);
    results.push({ name: gate.name, pass: true, output });
  } catch (err: any) {
    fs.writeFileSync(path.join(outDir, `${gate.name}.txt`), err.stdout || err.message);
    results.push({ name: gate.name, pass: false, output: err.stdout || err.message });
  }
}

// Generate summary.md
// ... format results into markdown table
```

---

### `npm run ai:proof` - Screenshot Capture

**File:** `scripts/ai-proof.ts`

**Purpose:** Automated before/after screenshots for UI changes.

**Usage:**
```bash
npm run ai:proof -- /penny-list /store-finder
```

**What it does:**
1. Starts dev server if not running
2. For each route:
   - Captures light mode screenshot
   - Captures dark mode screenshot
   - Records any console errors
3. Saves to `reports/proof/[timestamp]/`

**Output directory structure:**
```
reports/proof/2025-12-25T10-30-00/
├── penny-list-light.png
├── penny-list-dark.png
├── store-finder-light.png
├── store-finder-dark.png
└── console-errors.txt
```

**Implementation pattern:**
```typescript
// scripts/ai-proof.ts
import { chromium } from 'playwright';

const routes = process.argv.slice(2);
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = `reports/proof/${timestamp}`;

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const consoleErrors: string[] = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

for (const route of routes) {
  const slug = route.replace(/\//g, '-').slice(1) || 'home';

  // Light mode
  await page.goto(`http://localhost:3001${route}`);
  await page.screenshot({ path: `${outDir}/${slug}-light.png`, fullPage: true });

  // Dark mode
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: `${outDir}/${slug}-dark.png`, fullPage: true });
}

// Save console errors
fs.writeFileSync(`${outDir}/console-errors.txt`, consoleErrors.join('\n'));

await browser.close();
```

---

## Slash Command Specifications

### `/doctor` Command

**File:** `.claude/commands/doctor.md`

**Content:**
```markdown
---
name: doctor
description: Run pre-flight health check before coding
---

Run the health check to verify the environment is ready:

1. Execute `npm run ai:doctor`
2. If any checks fail, fix them before proceeding
3. If all checks pass, you're ready to code

This checks:
- Port 3001 status (reuse if running)
- Required environment variables
- Playwright browser availability
- Node version
```

### `/verify` Command

**File:** `.claude/commands/verify.md`

**Content:**
```markdown
---
name: verify
description: Run all quality gates and generate proof bundle
---

Run verification to prove your work:

1. Execute `npm run ai:verify`
2. Check the output for any failures
3. If all gates pass, proof is saved to `reports/verification/`
4. Copy the summary from `reports/verification/[timestamp]/summary.md`

Gates run:
- npm run lint (0 errors required)
- npm run build (must succeed)
- npm run test:unit (all tests pass)
- npm run test:e2e (all tests pass)
```

### `/proof` Command

**File:** `.claude/commands/proof.md`

**Content:**
```markdown
---
name: proof
description: Capture screenshots of routes for UI verification
---

Capture screenshots for UI changes:

1. Execute `npm run ai:proof -- [routes]`
   Example: `npm run ai:proof -- /penny-list /store-finder`
2. Screenshots saved to `reports/proof/[timestamp]/`
3. Each route gets light and dark mode screenshots
4. Console errors are recorded

Use before AND after making UI changes to show the diff.
```

---

## Pre-Commit Hook Specification

**File:** `.husky/pre-commit`

**Content:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running pre-commit checks..."

# Security scan (block PII)
npm run security:scan
if [ $? -ne 0 ]; then
  echo "❌ Security scan failed. Commit blocked."
  exit 1
fi

# Color lint (block raw Tailwind colors)
npm run lint:colors
if [ $? -ne 0 ]; then
  echo "❌ Color lint failed. Use CSS variables, not raw Tailwind colors."
  exit 1
fi

echo "✅ Pre-commit checks passed."
```

---

## Tooling Manifest Specification

**File:** `.ai/TOOLING_MANIFEST.md`

**Purpose:** Single source of truth for what tools exist. Prevents agents from hallucinating tools.

**Content structure:**
```markdown
# Tooling Manifest

**Last verified:** [DATE]

## npm Scripts (Verified)

| Script | Command | Purpose | Status |
|--------|---------|---------|--------|
| ai:doctor | `npm run ai:doctor` | Pre-flight health check | ✅ Implemented |
| ai:verify | `npm run ai:verify` | Run all quality gates | ✅ Implemented |
| ai:proof | `npm run ai:proof -- [routes]` | Screenshot capture | ✅ Implemented |
| lint | `npm run lint` | ESLint check | ✅ Existing |
| build | `npm run build` | Next.js build | ✅ Existing |
| test:unit | `npm run test:unit` | Unit tests | ✅ Existing |
| test:e2e | `npm run test:e2e` | Playwright tests | ✅ Existing |

## Slash Commands (Claude Code)

| Command | Purpose | Implemented? |
|---------|---------|--------------|
| /doctor | Run ai:doctor | ✅ Yes |
| /verify | Run ai:verify | ✅ Yes |
| /proof | Run ai:proof | ✅ Yes |

## MCP Servers (4 Active)

| MCP | Purpose |
|-----|---------|
| Filesystem | Read/write project files |
| Git | Version control operations |
| GitHub | PRs, issues, actions |
| Playwright | Browser automation (required for UI) |

## What Does NOT Exist

These are commonly hallucinated. DO NOT use them:
- ❌ `npm run ai:state-log` - Does not exist
- ❌ `npm run ai:session` - Does not exist
- ❌ `/session-start` command - Not yet implemented
- ❌ `/session-end` command - Not yet implemented
- ❌ Memory MCP - Removed (use .ai/ docs instead)
- ❌ Sequential Thinking MCP - Removed
```

---

## Deferred Implementations

These are fully specified but deferred to future sessions. Copy these specs when implementing.

### Parallel Agent Patterns

**When to spawn parallel agents:**

| Task Type | Spawn Parallel? | Recommended Split |
|-----------|-----------------|-------------------|
| UI change (component + styles) | Yes | Agent A: Component code, Agent B: Test updates |
| Bug fix (investigate + fix) | No | Single agent maintains investigation context |
| New feature (multiple files) | Yes | Agent A: Core implementation, Agent B: Tests, Agent C: Documentation |
| Refactor (rename across files) | No | Single agent prevents naming drift |
| API change (backend + frontend) | Yes | Agent A: API route, Agent B: Frontend integration |
| Documentation-only | No | Single agent maintains voice consistency |

**Coordination protocol:**

1. PRIMARY AGENT identifies task requires parallelization
2. PRIMARY AGENT creates coordination block:
   ```
   ## Parallel Task: [Task Name]
   ### Agent A: [Scope]
   - Files to modify: [list]
   - Expected output: [description]
   - DO NOT touch: [files reserved for other agents]

   ### Agent B: [Scope]
   - Files to modify: [list]
   - Expected output: [description]
   - DO NOT touch: [files reserved for other agents]
   ```
3. Each agent works ONLY on assigned files
4. Each agent reports completion with proof
5. PRIMARY AGENT runs final verification (ai:verify)

**File ownership rules:**
- Each file is owned by ONE agent during parallel work
- If Agent A needs to modify a file Agent B owns, it must WAIT
- Shared dependencies (package.json, types) are modified by PRIMARY agent only
- Tests are owned by the agent that owns the code being tested

**Penny Central examples:**

**Example 1: Penny List Feature Change**
```
Task: Add "Last Verified" column to Penny List table

Agent A (Data + UI):
  - Owns: components/penny-list/penny-table.tsx
  - Owns: lib/fetch-penny-data.ts (if schema changes)
  - Owns: types/penny-item.ts
  - DO NOT touch: tests/*, api/*

Agent B (Tests):
  - Owns: tests/penny-list-*.spec.ts
  - Owns: tests/penny-list-*.test.ts
  - Waits for: Agent A to define the new column
  - DO NOT touch: components/*, lib/*
```

**Example 2: Store Finder Enhancement**
```
Task: Add "distance from me" display to store popup

⚠️ CAUTION: Store Finder is FRAGILE (see CONSTRAINTS.md)

Agent A (Geolocation Logic):
  - Owns: lib/geo-utils.ts (new file)
  - Owns: lib/store-distance.ts (new file)
  - DO NOT touch: components/store-map.tsx (fragile!)

Agent B (UI Integration):
  - Owns: components/store-finder/store-popup.tsx
  - Waits for: Agent A to provide distance calculation
  - DO NOT touch: components/store-map.tsx (fragile!)
```

**Anti-patterns (DO NOT DO):**
- Two agents modifying the same file
- Agent modifying files outside its assigned scope
- Skipping final verification after parallel work
- Using parallel agents for tasks requiring shared context (debugging, refactoring)

---

### Session Start/End Skills

**`/session-start` steps:**

1. READ DOCS (mandatory, in order):
   - .ai/VERIFICATION_REQUIRED.md (quality gates)
   - .ai/CONSTRAINTS.md (rules, fragile areas)
   - .ai/STATE.md (current snapshot)
   - .ai/BACKLOG.md (prioritized work)
   - Latest entry in .ai/SESSION_LOG.md (recent context)

2. RUN HEALTH CHECK:
   - Execute: npm run ai:doctor
   - If FAIL: Fix issues before proceeding
   - If PASS: Continue

3. CAPTURE GOAL:
   ```
   GOAL: [What will be accomplished]
   WHY:  [Business/user value]
   DONE: [How we'll know it's done]
   ```

4. CREATE SESSION ENTRY in SESSION_LOG.md:
   ```markdown
   ## Session [DATE] - [TIME]
   **Goal:** [from step 3]
   **Why:** [from step 3]
   **Done when:** [from step 3]
   **Status:** In Progress
   ```

5. CONFIRM WITH USER: "I've read the docs and captured the goal. Ready to begin?"

**`/session-end` steps:**

1. RUN VERIFICATION:
   - Execute: npm run ai:verify
   - If FAIL: Do not mark session complete, report failures
   - If PASS: Continue

2. UPDATE SESSION_LOG.md with:
   - Status: Complete (or Partial - [reason])
   - What was done (bullet list)
   - Files modified
   - Verification results
   - Notes for next session

3. UPDATE STATE.md (if significant changes)

4. UPDATE BACKLOG.md (if tasks completed/added)

5. CHECK FOR LEARNINGS:
   - If anything unexpected happened, add to LEARNINGS.md

6. CONFIRM COMPLETION: "Session complete. All docs updated. Ready to close."

---

### Dependency Isolation (Fixture Mode)

**External dependencies in this codebase:**

| Dependency | Used By | Fixture Strategy |
|------------|---------|------------------|
| Supabase | `/api/penny-list`, `lib/fetch-penny-data.ts` | Mock client, return fixture JSON |
| Google Sheets CSV | `lib/fetch-penny-data.ts` | Return local fixture file |
| Google Apps Script | `/api/submit-find` | Mock response, don't actually send |
| Nominatim (geocoding) | Store Finder | Return cached coordinates |
| OpenStreetMap tiles | Store Finder map | Allow (visual only) |

**Environment variable:** `PLAYWRIGHT=1`
- Already exists in the codebase
- When set, should trigger fixture data instead of live calls
- Current implementation: Partial. Needs expansion.

**Fixture file structure:**
```
tests/
├── fixtures/
│   ├── penny-list.json          # 20-30 sample items
│   ├── penny-enrichment.json    # Sample enrichment data
│   ├── stores.json              # Sample store locations
│   ├── geocode-responses.json   # ZIP → coordinates
│   └── submit-find-response.json
├── mocks/
│   ├── supabase-client.ts
│   ├── fetch-interceptor.ts
│   └── google-sheets-mock.ts
└── setup.ts
```

**Implementation pattern:**
```typescript
// lib/fetch-penny-data.ts
export async function fetchPennyData() {
  // FIXTURE MODE: Return deterministic data
  if (process.env.PLAYWRIGHT === '1') {
    const fixture = await import('../tests/fixtures/penny-list.json');
    return fixture.default;
  }

  // PRODUCTION: Real Supabase call
  const { data, error } = await supabase
    .from('penny_list_public')
    .select('*');
  return data;
}
```

**Fixture data requirements:**
- Covers all departments (at least 1 item per department)
- Includes edge cases (long descriptions, missing images, unverified items)
- Dates are fixed (not relative)
- Images are local placeholders
- Total items: 20-30 (enough to test pagination)
- No real credentials/PII

---

## How to Use This Document

1. **Before starting any enablement work:** Read the relevant section
2. **Follow the checklists exactly:** They're requirements, not suggestions
3. **Mark checkboxes as you complete items:** This tracks progress across sessions
4. **Run ai:verify when done:** Prove it works
5. **If blocked:** Document the blocker and move on; don't guess
