# AI Tools Setup & Verification

**Purpose:** Ensure all AI tools (Claude Code, GitHub Copilot, ChatGPT CodeX) follow the same collaboration protocol by reading the `.ai/` directory.

---

## Current Configuration Status

### ✅ Claude Code (VS Code Extension)

**Instruction File:** `CLAUDE.md` (project root)

```markdown
⚠️ **BEFORE DOING ANYTHING:** Read ALL files in the `.ai/` directory for the collaboration protocol:

- `.ai/CONTRACT.md` - Collaboration rules
- `.ai/DECISION_RIGHTS.md` - What you can decide vs. must get approval for
- `.ai/CONSTRAINTS.md` - Fragile areas you must NOT touch
- `.ai/SESSION_LOG.md` - Recent work history and context
- `.ai/LEARNINGS.md` - Past mistakes to avoid
```

**Status:** ✅ Active - Claude Code automatically reads `CLAUDE.md` on startup

---

### ✅ GitHub Copilot (VS Code Extension)

**Instruction File:** `.github/copilot-instructions.md`

```markdown
⚠️ **CRITICAL: BEFORE DOING ANYTHING**

Read ALL files in the `.ai/` directory for the complete collaboration protocol:

- `.ai/CONTRACT.md` - Collaboration rules (what Cade provides, what you provide)
- `.ai/DECISION_RIGHTS.md` - What you can decide vs. must get approval for
- `.ai/CONSTRAINTS.md` - Fragile areas you must NOT touch
- `.ai/SESSION_LOG.md` - Recent work history and context
- `.ai/LEARNINGS.md` - Past mistakes to avoid
```

**Status:** ✅ Active - GitHub Copilot automatically reads `.github/copilot-instructions.md`

---

### ✅ ChatGPT CodeX (VS Code Extension)

**Instruction File:** `.github/copilot-instructions.md` (shared with Copilot)
**Config Location:** `~/.codex/config.toml`

```toml
# Local MCP instruction files (Windows paths)
mcp_paths = [
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.github\\copilot-instructions.md"
]
```

**Status:** ✅ Active - ChatGPT CodeX reads copilot-instructions.md via MCP paths, which then directs it to read all `.ai/` files

---

## How It Works

All three AI tools follow the same chain:

```
AI Tool Starts
    ↓
Reads instruction file (CLAUDE.md or copilot-instructions.md)
    ↓
Instruction file says: "Read ALL files in .ai/ directory FIRST"
    ↓
AI reads: CONTRACT.md, DECISION_RIGHTS.md, CONSTRAINTS.md, SESSION_LOG.md, LEARNINGS.md
    ↓
AI understands full project context and collaboration rules
    ↓
AI asks you for: GOAL / WHY / DONE for this session
```

---

## Verification Checklist

To verify each AI tool is following the protocol:

### Test 1: Context Awareness

Ask the AI: "What collaboration protocol should you follow?"

**Expected response:** Should mention reading `.ai/` directory files and following CONTRACT.md, DECISION_RIGHTS.md, etc.

### Test 2: Decision Rights

Ask the AI: "Can you modify globals.css?"

**Expected response:** Should say it needs explicit permission (per CONSTRAINTS.md)

### Test 3: Session Start

Start a new chat session.

**Expected behavior:** AI should ask for "GOAL / WHY / DONE" or reference the `.ai/` directory

---

## Maintenance

### When to Update

Update instruction files when you:

- Add new rules to the collaboration protocol
- Change project priorities or constraints
- Discover new "gotchas" that should go in LEARNINGS.md

### Where to Update

1. **For all AI tools:** Update files in `.ai/` directory
   - These are read by all three tools via their instruction files

2. **For Claude Code only:** Update `CLAUDE.md`
   - Rare - usually only for Claude-specific instructions

3. **For Copilot/CodeX:** Update `.github/copilot-instructions.md`
   - Rare - usually only for tool-specific instructions

---

## Troubleshooting

### Problem: AI doesn't seem to know about `.ai/` directory

**Solution:**

1. Check that instruction file exists and has the right content
2. Restart VS Code
3. Start a fresh chat session (old sessions may not reload instructions)

### Problem: ChatGPT CodeX not reading instructions

**Solution:**

1. Check `~/.codex/config.toml` has correct `mcp_paths`
2. Verify path uses Windows format: `C:\\Users\\...` (double backslashes)
3. Restart VS Code

### Problem: Instructions updated but AI using old rules

**Solution:**

1. Close and reopen VS Code
2. Start a new chat (don't continue old chat)
3. Explicitly ask: "Have you read the .ai/ directory files?"

---

## MCP Servers (Model Context Protocol)

**Status:** 6 MCP servers active and configured for ChatGPT CodeX

### Quick Reference

| Server                | Purpose                     | Priority | Status |
| --------------------- | --------------------------- | -------- | ------ |
| `filesystem`          | Read/write project files    | High     | ✅     |
| `github`              | PR/issue/repo management    | Medium   | ✅     |
| `git`                 | Local version control       | Medium   | ✅     |
| `chrome-devtools`     | Browser testing/automation  | Low      | ✅     |
| `pylance`             | Python validation/execution | Low      | ✅     |
| `sequential-thinking` | Extended reasoning          | Low      | ✅     |

**Full Documentation:** See `.ai/MCP_SERVERS.md` for complete capabilities, best practices, and troubleshooting

### MCP Configuration

**File:** `~/.codex/config.toml` (user home directory)

```toml
mcp_enabled = [
  "filesystem",
  "github",
  "git",
  "chrome-devtools",
  "pylance",
  "sequential-thinking"
]

mcp_paths = [
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.github\\copilot-instructions.md",
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\AGENTS.md",
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\SKILLS.md",
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.ai\\CONTRACT.md",
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.ai\\DECISION_RIGHTS.md",
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.ai\\CONSTRAINTS.md",
  "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.ai\\SESSION_LOG.md"
]
```

**This means:** When ChatGPT CodeX starts, it:

1. Loads all 6 MCP servers (tools become available)
2. Auto-reads all 7 instruction files (project context loaded)
3. Has immediate access to project rules + MCP capabilities
4. No manual setup needed per session

### Quick Usage Examples

**Filesystem:**

```typescript
// Read specific file range
read_file("components/penny-list-table.tsx", lines: 1-100)
```

**GitHub:**

```typescript
// Create PR with code review request
github_create_pull_request({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  title: "Add New Feature",
  head: "feature-branch",
  base: "main",
})

github_request_copilot_review({
  owner: "cadegallen-prog",
  repo: "HD-ONECENT-GUIDE",
  pullNumber: 123,
})
```

**Git:**

```typescript
// Check current branch and changes
get_changed_files({
  repositoryPath: "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE",
  sourceControlState: ["unstaged", "staged"],
})
```

**Chrome DevTools:**

```typescript
// Test responsive design
chr_new_page({ url: "http://localhost:3001" })
chr_resize_page({ width: 375, height: 667 })
chr_list_network_requests()
```

**Pylance:**

```typescript
// Validate and run Python
pylanceSyntaxErrors({
  code: "import pandas as pd",
  pythonVersion: "3.11",
})

pylanceRunCodeSnippet({
  workspaceRoot: "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE",
  codeSnippet: "print('Hello')",
})
```

### MCP Best Practices

**DO:**
✅ Read `.ai/MCP_SERVERS.md` before heavy MCP usage  
✅ Use specific file/line ranges when reading  
✅ Check git branch before declaring work complete  
✅ Use filesystem MCP for local files, GitHub MCP for remote repos  
✅ Run `pylanceRunCodeSnippet` instead of terminal Python for snippets

**DON'T:**
❌ Scan entire directory trees (use `file_search` instead)  
❌ Poll GitHub API repeatedly (rate limits)  
❌ Use Chrome DevTools for unit tests (use for integration/E2E only)  
❌ Run long Python scripts via Pylance (use `run_in_terminal` with `isBackground=true`)  
❌ Assume changes are live without verifying deployment branch

### Verification: MCPs Working

Test MCP functionality:

```powershell
# 1. Config file exists
Test-Path ~\.codex\config.toml  # Should be True

# 2. Servers enabled
Select-String -Path ~\.codex\config.toml -Pattern "mcp_enabled"

# 3. Auto-load paths configured
Select-String -Path ~\.codex\config.toml -Pattern "mcp_paths" -Context 0,8
```

In AI session, test tool availability:

```typescript
read_file("README.md", lines: 1-10)  // Should work immediately
```

### Troubleshooting MCPs

**MCPs not loading:**

1. Restart VS Code
2. Check `~/.codex/config.toml` syntax
3. Verify `npx` in PATH
4. Increase `startup_timeout_sec` to 30
5. Check `~/.codex/log` for errors

**Performance issues:**

1. Review `.ai/MCP_SERVERS.md` anti-patterns section
2. Reduce unnecessary file reads
3. Use specific queries instead of broad scans
4. Cache information within session

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial setup - all three AI tools configured to read `.ai/` directory
- **v1.1 (Dec 8, 2025):** Added this documentation file to explain the setup
- **v2.0 (Dec 10, 2025):** Added comprehensive MCP server documentation
  - Documented 6 active MCP servers
  - Added quick reference table
  - Added configuration details
  - Added usage examples
  - Added verification and troubleshooting
