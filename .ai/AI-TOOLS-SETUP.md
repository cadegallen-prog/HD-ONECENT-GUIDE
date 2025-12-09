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

## Version History

- **v1.0 (Dec 7, 2025):** Initial setup - all three AI tools configured to read `.ai/` directory
- **v1.1 (Dec 8, 2025):** Added this documentation file to explain the setup
