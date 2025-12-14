# MCP Servers - Complete Reference

**Purpose:** Document all Model Context Protocol servers available to AI agents, their capabilities, mandatory usage patterns, and anti-patterns.

**Status:** 9 MCP servers active (filesystem, github, git, sequential-thinking, memory, memory-keeper, next-devtools, playwright, context7)

**Last Updated:** December 14, 2025

---

## ⚠️ CRITICAL: MANDATORY MCP USAGE RULES

###

 **YOU MUST use these MCPs proactively:**

1. **Sequential Thinking** - Use for ANY complex task, architectural decision, or multi-step problem. NOT optional for planning.
2. **Memory / Memory-Keeper** - ALWAYS check memory at session start. ALWAYS save context before session end.
3. **Next-Devtools** - Check for runtime/build errors BEFORE and AFTER making changes. NOT optional.
4. **Playwright** - Test user-facing changes in actual browser. Screenshots required for UI changes.
5. **Context7** - Look up current library docs when using Next.js, React, Tailwind, etc. Your training data is outdated.

### **Agents CANNOT skip MCPs because they're "lazy" or want to "save time"**

- If a task involves browser behavior → USE Playwright
- If a task involves complex planning → USE Sequential Thinking
- If documentation might have changed → USE Context7
- If you need to remember context → USE Memory MCPs
- If you're working with Next.js → USE Next-Devtools

**NO EXCUSES. NO SHORTCUTS.**

---

## Configuration Locations

### Claude Code & GitHub Copilot
**File:** `C:\Users\cadeg\AppData\Roaming\Code\User\mcp.json`

```json
{
  "servers": {
    "sequential-thinking": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "memory-keeper": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-memory-keeper"]
    },
    "next-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    },
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "github/github-mcp-server": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

### ChatGPT Codex
**File:** `~/.codex/config.toml`

```toml
mcp_enabled = [
  "filesystem",
  "github",
  "git",
  "sequential-thinking",
  "memory",
  "memory-keeper",
  "next-devtools",
  "playwright",
  "context7"
]
```

All servers use `npx` with `-y` flag for zero-install execution.

---

## 1. Sequential Thinking MCP ⭐ TIER 1

**Command:** `npx -y @modelcontextprotocol/server-sequential-thinking`
**Purpose:** Structured reasoning workspace for complex problem-solving
**Official Docs:** https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking

### What It Does

Provides a cognitive scaffolding system that allows you to:
- Break complex problems into numbered thinking steps
- Revise and refine thoughts as understanding deepens
- Branch into alternative reasoning paths
- Build comprehensive analysis before taking action
- Self-correct through iterative thinking

### MANDATORY Usage

**YOU MUST USE THIS FOR:**
- ✅ Any architectural decision
- ✅ Multi-file refactoring plans
- ✅ Debugging complex issues
- ✅ Performance optimization strategies
- ✅ Feature implementation planning
- ✅ Security analysis
- ✅ Any task Cade describes as "I don't know technically what's wrong"

**Example - Planning a Store Finder Fix:**
```
Thought 1: Analyze the symptoms
- Map tiles not loading
- Console shows "Failed to load resource"
- Store markers render but no base map

Thought 2: Identify potential causes
A) Leaflet CDN issue
B) API key expired
C) React hydration mismatch
D) Z-index conflict

Thought 3: Determine most likely cause
Checking store-map.tsx line 45... seeing dynamic import with ssr:false
This suggests hydration was already a concern
Most likely: (C) Hydration mismatch

Thought 4: Design solution approach
- Verify Leaflet loads after hydration
- Add explicit mounting delay
- Test in browser DevTools

Thought 5: Validate approach won't break anything
- Changes isolated to store-map.tsx
- No globals.css impact
- Won't affect other maps if we add more later
```

### Best Practices

✅ **Use sequential thinking BEFORE implementing:**
- Start with analysis, end with action plan
- Explicitly consider multiple approaches
- Document why you chose your approach

❌ **Don't skip it because:**
- "Task seems simple" - validate that assumption
- "Want to move fast" - slow thinking prevents rework
- "Already know the answer" - verify your assumptions

---

## 2. Memory MCP ⭐ TIER 1

**Command:** `npx -y @modelcontextprotocol/server-memory`
**Purpose:** Official Anthropic persistent memory across sessions
**Official Docs:** https://www.npmjs.com/package/@modelcontextprotocol/server-memory

### What It Does

Stores and retrieves conversational memory:
- User preferences ("Cade prefers simple solutions over complex")
- Project decisions ("We decided against using Redux")
- Repeated patterns ("Cade always wants mobile tested")
- Historical context ("We tried X last month, it didn't work")

### MANDATORY Usage

**SESSION START - CHECK MEMORY:**
```
1. Query memory for "PennyCentral decisions"
2. Query memory for "Cade preferences"
3. Query memory for recent context about current task
```

**SESSION END - SAVE CONTEXT:**
```
1. Store key decisions made this session
2. Store learnings from any mistakes
3. Store Cade's feedback for future reference
```

### Best Practices

✅ **Store:**
- Design decisions and rationale
- User preferences discovered through conversation
- Successful patterns
- Failed approaches (what NOT to do)

❌ **Don't store:**
- Temporary state
- Code snippets (use files instead)
- Overly specific details
- Duplicate information already in docs

---

## 3. Memory Keeper MCP ⭐ TIER 1

**Command:** `npx -y mcp-memory-keeper`
**Purpose:** Advanced context persistence for Claude specifically
**Official Docs:** https://github.com/mkreyman/mcp-memory-keeper

### What It Does

Enhanced memory system with:
- Project-specific memory graphs
- Relationship mapping between concepts
- Temporal analysis (what changed when)
- Semantic search across past conversations
- Local storage in `~/mcp-data/memory-keeper/`

### How It Complements "Memory" MCP

- **Memory MCP** = General cross-session memory
- **Memory Keeper** = Project-specific deep context

Use BOTH. They serve different purposes.

### MANDATORY Usage

**Before making structural changes:**
```
1. Query: "What past decisions relate to [component]?"
2. Query: "What mistakes were made with [pattern]?"
3. Query: "What does Cade prefer for [scenario]?"
```

**After completing features:**
```
1. Store: Architectural decisions
2. Store: Tradeoffs considered
3. Store: Testing approach used
```

---

## 4. Next-Devtools MCP ⭐ TIER 1

**Command:** `npx -y next-devtools-mcp@latest`
**Purpose:** Direct access to Next.js development server internals
**Official Docs:** https://github.com/vercel/next-devtools-mcp

### What It Does

Connects to your running Next.js dev server (`localhost:3001`) and provides:
- **Real-time build errors** (TypeScript, ESLint, build failures)
- **Runtime errors** with stack traces
- **Type errors** from TypeScript compiler
- **Route information** (what routes exist, their status)
- **Server action inspection**
- **Built-in Playwright integration** for browser testing

### MANDATORY Usage

**BEFORE making changes:**
```
1. Check current build status
2. Verify no existing errors
3. Note current routes and their state
```

**AFTER making changes:**
```
1. Check for new build errors
2. Verify types still pass
3. Confirm no runtime errors introduced
4. Test affected routes
```

**YOU CANNOT mark a task "complete" without running next-devtools checks.**

### Best Practices

✅ **Use for:**
- Pre-flight checks before coding
- Post-change validation
- Understanding route structure
- Debugging "works in build but not dev" issues

❌ **Avoid:**
- Using it as a replacement for `npm run build` (still run that)
- Assuming errors are "just dev server" (they're real)

---

## 5. Playwright MCP ⭐ TIER 1

**Command:** `npx -y @playwright/mcp@latest`
**Purpose:** Browser automation using accessibility tree (no vision model needed)
**Official Docs:** https://github.com/microsoft/playwright-mcp

### What It Does

**Microsoft's official browser automation for AI agents:**
- Navigate pages, take snapshots
- Interact with elements (click, fill, scroll)
- Capture screenshots
- Test responsive layouts
- Monitor network requests
- Run JavaScript in browser context
- **Uses accessibility tree** (faster than screenshot-based tools)

### MANDATORY Usage

**YOU MUST test in browser for:**
- ✅ Any UI change
- ✅ Form functionality
- ✅ Responsive layout changes
- ✅ Map interactions (Leaflet)
- ✅ Client-side JavaScript behavior
- ✅ Visual regressions

**Required Evidence:**
- Screenshot before change
- Screenshot after change
- Console error check
- Network request validation

### Example: Testing Penny List Changes

```typescript
// 1. Start local dev server first (you or user)
// 2. Open page
playwright_navigate({ url: "http://localhost:3001/penny-list" })

// 3. Take baseline screenshot
playwright_screenshot({ fullPage: true })

// 4. Test interaction (e.g., click filter)
playwright_click({ selector: "[data-filter='rare']" })

// 5. Verify result
playwright_wait({ text: "Rare finds only" })

// 6. Take post-change screenshot
playwright_screenshot({ fullPage: true })

// 7. Check for console errors
playwright_evaluate({ script: "console.error.toString()" })
```

### Best Practices

✅ **Use Playwright for:**
- End-to-end user flows
- Visual regression testing
- Mobile viewport testing (resize to 375x667)
- Verifying Leaflet map loads
- Form submission testing

❌ **Don't use for:**
- Unit testing (use Vitest)
- API testing (use fetch/axios)
- Build-time checks (use next-devtools)

---

## 6. Context7 MCP ⭐ TIER 2

**Command:** `npx -y @upstash/context7-mcp@latest`
**Purpose:** Up-to-date library documentation on demand
**Official Docs:** https://github.com/upstash/context7

### What It Does

Fetches current, version-specific documentation for:
- Next.js (we use v16)
- React (v19)
- Tailwind CSS
- React-Leaflet
- Vercel deployment
- Any npm package

**Your training data is from 2025-01. Libraries change. Use this.**

### MANDATORY Usage

**ALWAYS look up docs when:**
- ✅ Using Next.js App Router patterns
- ✅ Implementing React Server Components
- ✅ Using Tailwind classes you're unsure about
- ✅ Working with React-Leaflet (version-sensitive)
- ✅ Following Next.js 16-specific patterns

### Example

```typescript
// WRONG: Assuming you know current Next.js patterns
"I'll use getServerSideProps..." // ❌ Old pattern

// RIGHT: Look it up first
context7_get_docs({
  library: "/vercel/next.js/v16",
  topic: "data fetching",
  maxTokens: 2000
})
// Returns: Use async Server Components, not getServerSideProps

// WRONG: Guessing Tailwind class names
"I'll use text-gray-900..." // ❌ Might be outdated

// RIGHT: Look up current color palette
context7_get_docs({
  library: "/tailwindcss",
  topic: "color palette",
  maxTokens: 1000
})
```

### Best Practices

✅ **Look up BEFORE coding:**
- API changes in libraries
- Breaking changes between versions
- Current best practices
- Deprecated patterns

❌ **Don't assume:**
- Your training data is current
- Patterns haven't changed
- Your memory is perfect

---

## 7. Filesystem MCP ⭐ TIER 2

**Command:** `npx -y @modelcontextprotocol/server-filesystem`
**Scope:** `C:\Users\cadeg\Projects\HD-ONECENT-GUIDE`
**Purpose:** Read/write files in project

### Capabilities

- Read file contents (any file in project)
- Write/edit files
- List directory contents
- Create/delete files and directories

### Best Practices

✅ **Use for:**
- Targeted file reads (specific paths)
- Batch file operations
- Creating multiple related files

❌ **Avoid:**
- Recursive directory scans (use glob patterns instead)
- Reading same file multiple times
- Exploratory browsing (wasteful)

---

## 8. GitHub MCP ⭐ TIER 2

**Command:** `npx -y @modelcontextprotocol/server-github`
**Purpose:** GitHub API for PRs, issues, repos

### Key Capabilities

**Pull Requests:**
- Create, update, merge PRs
- Request Copilot code reviews
- Add/view comments
- Check CI status

**Issues:**
- Create/update issues
- Add comments
- Manage labels

**Repository:**
- Create branches
- Push files
- Read files from any repo

### Best Practices

✅ **Use for:**
- Creating PRs for significant changes
- Requesting code reviews
- Managing issues
- Checking CI results

❌ **Avoid:**
- Polling API repeatedly (rate limits)
- Using for local file operations

---

## 9. Git MCP ⭐ TIER 2

**Command:** `npx -y @modelcontextprotocol/server-git`
**Repository:** `C:\Users\cadeg\Projects\HD-ONECENT-GUIDE`
**Purpose:** Local git operations

### Capabilities

- Check repository status
- View diffs
- Get branch information
- Read commit history

### Best Practices

✅ **ALWAYS check branch before declaring work complete**
✅ **Verify changes before committing**

❌ **Don't use for commits** (use terminal instead)

---

## MCP Anti-Patterns - What Agents Must NOT Do

### 1. ❌ The "I'll Skip Sequential Thinking" Anti-Pattern

```
WRONG Agent: "This is a simple task, I don't need to think through it."
[Proceeds to break something]

RIGHT Agent: "Using sequential thinking to validate approach..."
[Discovers edge case that would have broken]
```

**RULE: If task touches 2+ files or involves user-facing changes, USE SEQUENTIAL THINKING.**

### 2. ❌ The "I'll Assume Current Docs" Anti-Pattern

```
WRONG Agent: "I know Next.js, I'll use getServerSideProps..."
[Uses deprecated API]

RIGHT Agent: [Queries Context7 first]
"According to Next.js 16 docs, Server Components replace getServerSideProps..."
```

**RULE: ALWAYS verify current library patterns with Context7 before implementing.**

### 3. ❌ The "I'll Skip Browser Testing" Anti-Pattern

```
WRONG Agent: "Code looks good, tests pass, shipping it."
[User reports map doesn't load]

RIGHT Agent: "Testing in browser with Playwright..."
[Screenshots show Leaflet not rendering]
[Fixes hydration issue before user sees it]
```

**RULE: User-facing changes REQUIRE Playwright verification with screenshots.**

### 4. ❌ The "I'll Skip Next-Devtools Check" Anti-Pattern

```
WRONG Agent: "npm run build passed, we're good."
[Deploys with runtime error]

RIGHT Agent: "Checking next-devtools for runtime errors..."
[Catches error in dev server before build]
```

**RULE: Check next-devtools BEFORE and AFTER changes. Always.**

### 5. ❌ The "I Don't Need Memory" Anti-Pattern

```
WRONG Agent: [Repeats same mistake from last week]
Cade: "I told you last week this doesn't work."

RIGHT Agent: [Checks memory-keeper first]
"I see we tried this approach last week and it caused performance issues. Using alternative..."
```

**RULE: Check memory at session start. Save context at session end. No exceptions.**

---

## Token Usage & Performance

**Cost hierarchy** (most → least tokens):

1. **Sequential Thinking** - High (deep reasoning)
2. **Context7** - Moderate (doc fetches)
3. **Playwright** - Moderate (browser automation)
4. **Next-Devtools** - Low (status checks)
5. **Memory MCPs** - Low (targeted queries)
6. **Git/GitHub** - Very low (status/metadata)
7. **Filesystem** - Very low (targeted reads)

**Optimization:**
- Cache info within session
- Use specific queries, not broad scans
- Batch operations when possible
- Use cheapest MCP that accomplishes goal

**But NEVER skip an MCP to "save tokens" - the cost of bugs is higher than the cost of MCP usage.**

---

## Troubleshooting

### MCP Not Loading

**Symptoms:** Tools not available, timeout errors

**Fix:**
1. Restart VS Code
2. Check `mcp.json` or `config.toml` syntax
3. Verify `npx` in PATH
4. Check VS Code Output → MCP logs
5. Increase timeout to 30s for slower MCPs

### Memory MCP Empty

**Symptoms:** No memories found

**Fix:**
- Storage location: `~/mcp-data/memory-keeper/`
- First run has no data (expected)
- Save context explicitly to populate

### Next-Devtools Can't Connect

**Symptoms:** "No Next.js dev server found"

**Fix:**
1. Ensure dev server running: `npm run dev`
2. Check it's on correct port (3001)
3. Verify Next.js 16+ installed
4. Restart dev server

### Playwright Timeout

**Symptoms:** "Waiting for selector timed out"

**Fix:**
1. Increase wait time
2. Check selector is correct
3. Verify element actually appears
4. Check for JavaScript errors blocking render

---

## Mandatory Session Workflow

### Session Start Checklist

1. ✅ Check Memory MCPs for project context
2. ✅ Read `.ai/STATE.md` and `.ai/SESSION_LOG.md`
3. ✅ Check next-devtools for existing errors
4. ✅ Ask Cade: GOAL / WHY / DONE

### During Work

1. ✅ Use Sequential Thinking for planning
2. ✅ Use Context7 to verify current docs
3. ✅ Use Next-Devtools to check for errors
4. ✅ Use Playwright to test browser behavior

### Session End Checklist

1. ✅ Run next-devtools final check
2. ✅ Run Playwright visual test (if UI changed)
3. ✅ Run `npm run build && npm run lint`
4. ✅ Update Memory MCPs with learnings
5. ✅ Update `.ai/SESSION_LOG.md`
6. ✅ Update `.ai/STATE.md` if significant changes

---

## Version History

- **v1.0 (Dec 10, 2025):** Initial 6-server documentation
- **v2.0 (Dec 14, 2025):** Complete rewrite with 9 MCPs
  - Added Sequential Thinking, Memory, Memory-Keeper, Next-Devtools, Playwright, Context7
  - Removed chrome-devtools, pylance (outdated/redundant)
  - Added MANDATORY usage rules
  - Added anti-pattern examples
  - Added session workflow checklist
  - Emphasized proactive, not lazy, MCP usage
