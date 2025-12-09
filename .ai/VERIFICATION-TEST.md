# AI Tools Verification Test

Run these tests to verify each AI tool is reading the `.ai/` directory correctly.

---

## Test 1: Claude Code ✅ (Already Verified)

**Status:** ✅ Working - Claude Code is currently reading `.ai/` files

---

## Test 2: GitHub Copilot Chat

### Steps:
1. Open GitHub Copilot Chat in VS Code
2. Start a **new chat session** (fresh context)
3. Ask: "What files should you read before starting any work on this project?"

### Expected Response:
Copilot should mention:
- Reading files in the `.ai/` directory
- `CONTRACT.md`, `DECISION_RIGHTS.md`, `CONSTRAINTS.md`, `SESSION_LOG.md`, `LEARNINGS.md`
- Or ask you for "GOAL / WHY / DONE"

### If It Fails:
- Check that `.github/copilot-instructions.md` exists
- Try restarting VS Code
- Check Copilot extension version (update if old)

---

## Test 3: ChatGPT CodeX

### Steps:
1. Open ChatGPT extension in VS Code
2. Start a **new chat session** (fresh context)
3. Ask: "What collaboration protocol should you follow for this project?"

### Expected Response:
Should mention:
- Reading `.ai/` directory files
- The collaboration rules from `CONTRACT.md`
- Decision rights or constraints

### If It Fails:
1. Check `~/.codex/config.toml`:
   ```bash
   cat ~/.codex/config.toml | grep -A 3 "mcp_paths"
   ```

   Should show:
   ```toml
   mcp_paths = [
     "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.github\\copilot-instructions.md"
   ]
   ```

2. If missing or wrong, update with:
   ```toml
   mcp_paths = [
     "C:\\Users\\cadeg\\Projects\\HD-ONECENT-GUIDE\\.github\\copilot-instructions.md"
   ]
   ```

3. Restart VS Code completely

---

## Test 4: Cross-Tool Consistency Test

### Steps:
1. Ask each AI tool the same question: "Can you modify globals.css?"

### Expected Response (All Tools):
- Should say they need **explicit permission**
- Should reference `CONSTRAINTS.md`
- Should know this is a fragile area

### What This Tests:
- All tools reading the same rules
- All tools applying the same constraints
- True cross-tool consistency

---

## Troubleshooting

### Problem: Tool doesn't mention `.ai/` directory

**Root Cause:** Instruction file not being loaded

**Solutions:**
1. Verify instruction file exists at expected path
2. Restart VS Code (completely close and reopen)
3. Start a **new** chat session (don't continue old chat)
4. Check extension is up to date

### Problem: Tool mentions old rules or outdated info

**Root Cause:** Using cached/old session

**Solution:**
1. Close VS Code completely
2. Reopen VS Code
3. Start a **brand new** chat (don't continue old conversation)

### Problem: ChatGPT CodeX not reading mcp_paths

**Root Cause:** Path format or configuration issue

**Solution:**
1. Verify Windows path format: `C:\\Users\\...` (double backslashes)
2. Verify file exists at that exact path
3. Check for typos in config.toml
4. Restart VS Code after any config changes

---

## Quick Verification Commands

Run these to check your setup:

```bash
# Check Claude Code instruction file exists
ls CLAUDE.md

# Check Copilot instruction file exists
ls .github/copilot-instructions.md

# Check all .ai/ files exist
ls .ai/

# Check CodeX config
cat ~/.codex/config.toml | grep -A 3 "mcp_paths"
```

---

## Results Template

After testing, record results here:

- [ ] Claude Code: ✅ Working / ❌ Not Working
- [ ] GitHub Copilot: ✅ Working / ❌ Not Working
- [ ] ChatGPT CodeX: ✅ Working / ❌ Not Working
- [ ] Cross-tool consistency: ✅ All tools follow same rules / ❌ Inconsistent

---

## Next Steps

### If All Tests Pass ✅
You're all set! All AI tools are reading the `.ai/` directory and following the same protocol.

### If Any Test Fails ❌
1. Note which tool failed in the results above
2. Follow the troubleshooting steps for that specific tool
3. Ask Claude Code for help debugging (share the error/unexpected response)
