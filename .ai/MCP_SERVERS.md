# MCP Servers (Available Tools)

**Purpose:** Document Model Context Protocol servers available to AI agents.

**Status:** 4 active MCPs (filesystem, git, github, playwright)

**Last Updated:** December 14, 2025

---

## Philosophy: Outcomes Over Process

This project focuses on **outcomes** (does the code work?) not **process compliance** (did you use specific tools?).

**Quality is verified through gates:**
- ✅ `npm run build` passes
- ✅ `npm run lint` passes
- ✅ `npm run test:unit` passes
- ✅ `npm run test:e2e` passes
- ✅ `.ai/SESSION_LOG.md` and `.ai/STATE.md` updated

**Trust agents to use tools appropriately.** Use MCPs when they add value, not because they're "mandatory."

---

## How Playwright Reduces Non-Technical User Burden

**The problem without autonomous browser testing:**
1. Agent makes UI change
2. You have to manually test in browser
3. You see something wrong but can't describe it technically ("the button looks weird")
4. Agent has to guess what you mean
5. Multiple rounds of "try this" → "still not right" → stress

**How Playwright MCP solves this:**
1. Agent makes UI change
2. **Agent autonomously opens browser, takes screenshot, interacts with page**
3. **Agent sees the same thing you would see** (visual bugs, layout issues, JavaScript errors)
4. **Agent fixes issues before you even test** - no guessing, no communication gap
5. Agent shows you screenshots: "Here's before/after - does this look right?"

**Result:** You give high-level feedback ("make the map easier to use") instead of low-level debugging ("the z-index on line 47 conflicts with the popup").

**When agents MUST use Playwright (mandatory):**
- ✅ Before claiming ANY UI work is "done"
- ✅ Before claiming "bug fixed" (for visual/JavaScript bugs)
- ✅ After changing buttons, forms, layouts, colors, spacing
- ✅ After changing JavaScript-heavy features (Store Finder, interactive components)
- ✅ When user reports visual bugs ("it looks wrong")

**Required steps:**
1. Navigate to page: `http://localhost:3001/[page]`
2. Take screenshot BEFORE changes (if fixing something)
3. Make changes
4. Take screenshot AFTER changes
5. Check browser console for errors
6. Test light AND dark mode
7. Show user the screenshots: "Does this match what you wanted?"

**When agents can skip Playwright:**
- ⏭️ Backend/API changes (no browser impact)
- ⏭️ Pure documentation updates
- ⏭️ Configuration-only changes

**⚠️ See [VERIFICATION_REQUIRED.md](../VERIFICATION_REQUIRED.md) for complete requirements.**

---

## Available MCP Servers

### Infrastructure (Use Naturally)

#### Filesystem MCP
**What it does:** Read/write files in the project directory

**When to use:** Automatically - agents use this naturally for file operations

**Configuration:** Already configured in `~/.codex/config.toml`

#### Git MCP
**What it does:** Local git operations (status, diff, branch info, commit history)

**When to use:** Automatically - agents use this naturally for version control

**Configuration:** Already configured in `~/.codex/config.toml`

**Note:** Agents should NOT use this for commits (use Bash tool instead)

#### GitHub MCP
**What it does:** GitHub API access for PRs, issues, repos

**When to use:**
- Creating/managing pull requests
- Working with issues
- Checking CI status
- Creating branches

**Configuration:** Already configured in `~/.codex/config.toml`

#### Playwright MCP
**What it does:** Browser automation - agents can see and interact with your site in a real browser

**Why this is valuable:**
- **Reduces user testing burden** - agents can verify their own changes instead of you having to test and describe issues
- **Autonomous verification** - agents can take screenshots, click buttons, fill forms, check for JavaScript errors
- **Visual debugging** - agents can see what you see, without you having to explain it

**When to use:**
- UI changes (buttons, forms, layouts)
- JavaScript-heavy features (maps, interactive components)
- Visual bugs ("it looks wrong but I can't explain why")
- "Does this work?" verification

**Configuration:** Already configured in `~/.codex/config.toml`

**Key benefit for non-technical users:** Agents can autonomously verify browser behavior instead of relying on you to test and describe technical issues.

---

## Removed MCPs (And Why)

### Sequential Thinking ❌
**Removed because:** Agents already think. This MCP added ceremony without improving reasoning quality.

**Evidence:** Session logs showed no Sequential Thinking usage despite "MANDATORY" documentation. Quality remained high without it.

### Memory + Memory-Keeper ❌
**Removed because:** Duplicate of `.ai/` directory docs (SESSION_LOG.md, LEARNINGS.md, STATE.md)

**Evidence:** File-based memory proved more transparent, debuggable, and effective. Having 3 memory systems created confusion.

### Next-Devtools ❌
**Removed because:** Duplicate of `npm run build` quality gate

**Evidence:** Created port conflicts (see LEARNINGS.md). Quality gates already catch build/type/runtime errors without this MCP.

### Context7 ❌
**Removed because:** Modern AI training data (Jan 2025) is current enough for Next.js 16, React 19, etc.

**Evidence:** No Context7 usage in recent session logs. Agents produce correct, current code without it.

---

## Configuration Location

**ChatGPT Codex:** `~/.codex/config.toml`

**Claude Code / GitHub Copilot:** `C:\Users\cadeg\AppData\Roaming\Code\User\mcp.json`

---

## Quality Gates (Required for "Done")

When an agent marks work as complete, these MUST pass:

1. ✅ `npm run build` - production build succeeds
2. ✅ `npm run lint` - no errors or warnings
3. ✅ `npm run test:unit` - all unit tests pass
4. ✅ `npm run test:e2e` - all E2E tests pass
5. ✅ `.ai/SESSION_LOG.md` updated with session summary
6. ✅ `.ai/STATE.md` refreshed if significant changes
7. ✅ `.ai/BACKLOG.md` updated if priorities changed

**These gates ensure quality.** MCPs are just tools to help agents reach these outcomes.

---

## Troubleshooting

### MCP Not Loading
**Symptoms:** Tools not available, timeout errors

**Fix:**
1. Restart ChatGPT Codex or VS Code
2. Check config syntax in `~/.codex/config.toml` or `mcp.json`
3. Verify `npx` is in PATH
4. Check output logs for errors

### Slow Startup
**Symptoms:** MCPs take >30 seconds to load

**Fix:**
1. Check `startup_timeout_sec` values (20-30s is normal)
2. Ensure good internet connection (npx downloads on first use)
3. Restart if stuck

---

## History: From 9 MCPs to 3

**Previous setup (Dec 7-13, 2025):**
- 9 MCP servers configured
- "MANDATORY" usage rules
- "NO EXCEPTIONS" enforcement language
- 740 lines of documentation

**Problems identified:**
- Agents ignored "mandatory" rules (evidence: session logs)
- Compliance theater without quality improvement
- 3 duplicate memory systems creating confusion
- High cognitive load (which MCP? when? why?)
- User couldn't verify if agents followed rules

**New setup (Dec 14, 2025):**
- 4 active MCPs (filesystem, git, github, playwright)
- Pragmatic usage based on value (not mandatory compliance)
- Outcome-focused (quality gates)
- ~100 lines of documentation

**Results expected:**
- Lower cognitive load for agents
- Same quality (gates verify outcomes)
- Clearer mental model (tools, not compliance)
- Easier for user to understand

---

## Version History

- **v1.0 (Dec 10, 2025):** Initial 6-server documentation
- **v2.0 (Dec 14, 2025):** Expanded to 9 MCPs with mandatory usage rules
- **v3.0 (Dec 14, 2025):** Simplified to 3 essential MCPs, removed compliance theater
