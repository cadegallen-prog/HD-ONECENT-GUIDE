# Quickstart Guide for Cade

**Welcome to your Human-AI Contract System!** This guide shows you how to use the `.ai/` directory to get stellar results from any AI assistant (Claude Code, ChatGPT Codex, GitHub Copilot).

---

## The Three Daily Habits (Core Workflow)

This entire system boils down to **three copy-paste actions:**

### Habit 1: Start Your Session
✅ **Usually automatic** - Claude Code, Copilot, and Codex auto-read `.ai/` directory
- If auto-load fails: Paste "Session Start" from `SESSION_TEMPLATES.md`

### Habit 2: Define Each Task
📋 **Every time** - Use GOAL / WHY / DONE format (template in `SESSION_TEMPLATES.md`)
```
GOAL: [What you want]
WHY: [Who it helps]
DONE MEANS: [Success criteria]
```

### Habit 3: End Your Session
🔚 **Critical** - Force AI to confess unfinished work + write future prompts
- Paste "Session End" from `SESSION_TEMPLATES.md`
- AI updates `SESSION_LOG.md` with completed/unfinished items + future prompts

**That's it. Master these three habits and you'll get stellar results every time.**

For the ultra-simple version, read `USAGE.md`. For detailed explanation, keep reading.

---

## What You Just Got

A complete collaboration framework that works across all AI tools:

| File | What It Does | When to Use It |
|------|--------------|----------------|
| `CONTRACT.md` | The "rules of engagement" | Share with new AI to set expectations |
| `DECISION_RIGHTS.md` | What AI can decide vs. what needs your approval | Reference when AI asks for permission |
| `CONTEXT.md` | Why this project exists, who it serves | Helps AI understand your goals |
| `CONSTRAINTS.md` | Technical red lines (don't touch this!) | Prevents AI from breaking fragile areas |
| `SESSION_LOG.md` | Running history of AI work | See what was done, hand off to next AI |
| `LEARNINGS.md` | Lessons learned the hard way | Avoid repeating mistakes |
| `QUICKSTART.md` | This guide! | Learn how to use the system |

---

## How to Use This System

### Starting a New AI Session (Any Tool)

**Step 1: Point AI to the Contract**

At the start of a conversation, say:

```
"Before we start, read all files in the .ai/ directory.
These define our collaboration protocol."
```

**Why this works:**
- All AI tools can read markdown files
- They'll understand the decision boundaries
- They'll see recent history (SESSION_LOG)
- They'll know what NOT to touch (CONSTRAINTS)

---

**Step 2: Give a Clear Goal**

Use this format:

```
GOAL: [What you want]
WHY: [What problem this solves or who it helps]
DONE MEANS: [How you'll know it's successful]
```

**Example:**
```
GOAL: Add a filter to the penny list so users can see only "Rare" items
WHY: Users are overwhelmed by long lists, want to focus on high-value finds
DONE MEANS:
- Filter dropdown works on mobile
- Builds without errors
- I've tested it in my browser
```

**Why this works:**
- AI knows exactly what success looks like
- You're providing context (the WHY) not just tasks
- Clear acceptance criteria prevent rework

---

**Step 3: Let AI Propose, Then Approve**

Good AI will:
1. Explain the approach in plain English
2. Show you trade-offs (simple vs. fancy)
3. Wait for your "yes, proceed" or "let's adjust"

**You say:** "Sounds good, go ahead" or "Let's try approach B instead"

**Why this works:**
- You stay in control without needing to understand code
- AI doesn't waste time building the wrong thing
- You learn what's possible through the proposals

---

**Step 4: Review the Result**

After AI completes the task:
1. Test it yourself (AI will guide you: "Go to /penny-list and try the filter")
2. Say "ship it" or "needs adjustment"
3. Ask AI to update SESSION_LOG.md with what was done

**Why this works:**
- You're the final decision maker
- Documentation stays current
- Next AI session will know what happened

---

## Switching Between AI Tools

This system works across Claude Code, ChatGPT Codex, and GitHub Copilot because everything is markdown (tool-agnostic).

### Starting a Session in a Different Tool

**Say this:**
```
"I'm working on PennyCentral.com. Read all files in the .ai/ directory
to understand the project, then read SESSION_LOG.md to see recent work.
Ready to continue?"
```

The new AI will:
- Read the contract and constraints
- See what the last AI did (SESSION_LOG)
- Understand the decision boundaries
- Continue where you left off

**No context loss. No starting from scratch.**

---

## Common Scenarios

### Scenario 1: "I Want to Add a Feature"

**You say:**
```
GOAL: Add a "sort by date" option to the penny list
WHY: Newest finds are most actionable
DONE MEANS: Sort works, builds pass, I've tested it
```

**AI will:**
1. Read DECISION_RIGHTS → sees this needs your approval first
2. Propose approach in plain English
3. Wait for your approval
4. Implement
5. Test (build + lint)
6. Update SESSION_LOG

**You do:**
- Approve the approach
- Test the result in your browser
- Say "ship it"

---

### Scenario 2: "Something Broke"

**You say:**
```
"The penny list page isn't loading. Here's the error: [paste error]"
```

**AI will:**
1. Read LEARNINGS.md → check if this happened before
2. Read CONSTRAINTS.md → make sure fix doesn't touch fragile areas
3. Explain what broke in plain English
4. Propose fix
5. Implement after approval
6. Add to LEARNINGS.md if it's a new issue

**You do:**
- Provide error details (screenshot or text)
- Approve the fix approach
- Test to verify it's fixed

---

### Scenario 3: "I Have a Vague Idea"

**You say:**
```
"I want the site to feel more alive and give users a reason to return daily.
Not sure what that looks like. Ideas?"
```

**AI will:**
1. Read CONTEXT.md → understand the community and goals
2. Read DECISION_RIGHTS → know what it can suggest vs. implement
3. Propose 3-5 ideas with pros/cons
4. Wait for your direction

**You do:**
- Pick an idea or ask for refinement
- Give AI the "go ahead" on the winner

**Why this works:**
- AI understands the community from CONTEXT.md
- You don't need to know what's technically possible
- Collaboration feels like brainstorming, not programming

---

### Scenario 4: "AI Wants to Do Something Risky"

**AI says:**
```
"I need to modify globals.css to fix the dark mode contrast issue.
Per CONSTRAINTS.md, this requires your approval. Here's what I'd change..."
```

**You say:**
- "Yes, proceed" (if you trust the explanation)
- "What's the risk if we don't fix it?" (if unclear)
- "Is there a safer way?" (if nervous)

**Why this works:**
- CONSTRAINTS.md trained AI to ask before touching fragile areas
- You get to make informed decisions
- AI explains risk/benefit in plain English

---

## Tips for Stellar Results

### 1. Always Provide the WHY
- ❌ "Add a search bar"
- ✅ "Add a search bar so users can quickly find stores by city name (they're currently scrolling through 51 markers)"

**Why:** AI makes better design decisions when it understands user needs.

---

### 2. Define "Done" Clearly
- ❌ "Make it better"
- ✅ "Done means: builds without errors, works on mobile, I've tested it"

**Why:** Prevents endless back-and-forth and ensures thorough testing.

---

### 3. Trust the Decision Rights
If AI proposes something without asking, it's in the "AI Can Decide" zone (DECISION_RIGHTS.md). That's intentional.

If AI asks for approval, it's because it should (DECISION_RIGHTS.md says so).

**Why:** You don't need to micromanage code structure or variable names.

---

### 4. Review SESSION_LOG Weekly
Skim SESSION_LOG.md once a week to see what's been done.

**Benefits:**
- Catch issues early
- Understand what changed
- Stay aligned with AI work

---

### 5. Update CONTEXT.md When Things Change
If your priorities shift or you learn something about the community, update CONTEXT.md.

**Example:**
- Community starts asking for a specific feature (add to "What They Care About")
- You decide a feature isn't worth it (add to "What NOT to Work On")

**Why:** Keeps AI aligned with evolving goals.

---

## Maintaining the System

### Monthly (5 minutes)
- Skim SESSION_LOG.md for recent changes
- Check LEARNINGS.md for new patterns
- Update CONTEXT.md if priorities shifted

### Quarterly (30 minutes)
- Review CONTRACT.md (still accurate?)
- Review DECISION_RIGHTS.md (boundaries still make sense?)
- Clean up old SESSION_LOG entries (archive anything > 3 months)

### As Needed
- Add to LEARNINGS.md when AI discovers something new
- Update CONSTRAINTS.md if you identify new fragile areas

---

## What This System Achieves

### For You (Cade)
- ✅ **Control without coding** — You make decisions, AI implements
- ✅ **Consistency across AI tools** — ChatGPT, Claude, Copilot all work the same way
- ✅ **No context loss** — SESSION_LOG preserves history across sessions
- ✅ **Learn as you go** — AI explains trade-offs, you build intuition
- ✅ **Confidence to ship** — Clear testing and approval gates

### For AI Assistants
- ✅ **Clear boundaries** — Know what to decide vs. ask about
- ✅ **Project context** — Understand WHY things matter
- ✅ **Historical knowledge** — Learn from past mistakes (LEARNINGS.md)
- ✅ **Handoff protocol** — Smooth transitions between sessions/tools

### For the Project
- ✅ **Stability** — CONSTRAINTS.md prevents breaking fragile areas
- ✅ **Quality** — CONTRACT.md enforces testing and documentation
- ✅ **Maintainability** — No mystery code or undocumented decisions
- ✅ **Scalability** — System grows with the project

---

## Power Tools: MCP Servers (ChatGPT Codex Only)

**What are MCPs?** Model Context Protocol servers give AI direct access to powerful tools.

**Status:** You have 6 MCP servers already configured and working:

| Server | What It Does | Example Use |
|--------|--------------|-------------|
| **filesystem** | Read/write project files efficiently | AI can read 10 files at once instead of asking you to paste code |
| **github** | Create PRs, request code reviews | AI can open a PR and request Copilot review automatically |
| **git** | Check branches, view history | AI verifies you're on `main` before declaring changes live |
| **chrome-devtools** | Test in real browser | AI can test responsive design at different screen sizes |
| **pylance** | Python validation/execution | AI can run Python scripts directly (if needed) |
| **sequential-thinking** | Extended reasoning | AI can break down complex problems step-by-step |

### You Don't Need to Know the Details

- ✅ **Already configured** - Set up in `~/.codex/config.toml`
- ✅ **Auto-loads** - ChatGPT Codex starts with these available
- ✅ **AI uses automatically** - When appropriate, AI picks the right tool
- ✅ **Fully documented** - AI can read `.ai/MCP_SERVERS.md` for details

**You just work normally. AI has superpowers under the hood.**

### Why This Matters

**Before MCPs:**
```
You: "Can you check if we're on the main branch?"
AI: "I can't check git directly. Can you run 'git branch' and paste the output?"
You: [switches to terminal, runs command, copies, pastes]
AI: "Thanks. Yes, you're on main."
```

**With MCPs:**
```
You: "Can you check if we're on the main branch?"
AI: [uses git MCP] "Yes, you're on main branch. No uncommitted changes."
```

**10x faster. Zero context switching for you.**

### When AI Uses MCPs (Examples)

1. **You say:** "Fix the mobile overflow"
   - AI uses **filesystem** to read the component
   - AI uses **chrome-devtools** to test mobile viewport
   - AI verifies the fix in real browser

2. **You say:** "Create a PR for this feature"
   - AI uses **git** to check branch status
   - AI uses **github** to create the PR
   - AI uses **github** to request Copilot review

3. **You say:** "Is the penny list data loading correctly?"
   - AI uses **filesystem** to read data files
   - AI uses **pylance** to validate data structure (if Python)
   - AI checks for common data issues

**You don't tell AI which tool to use. AI chooses automatically based on the task.**

### Advanced: MCP Best Practices (For AI)

AI agents reading this should know:

- **Read `.ai/MCP_SERVERS.md`** for complete tool reference
- **Check `.ai/AI-TOOLS-SETUP.md`** for configuration details  
- **Follow token cost hierarchy** - Use cheapest tool that works
- **Avoid anti-patterns** - Don't scan entire repo, don't poll GitHub API
- **Verify deployment branch** - Always check git branch before declaring success

**For you (Cade):** You don't need to know this. Just know AI has these tools available.

---

## Next Steps

You're all set! Here's how to use this immediately:

1. **Try it now:** Ask any AI to "read the .ai/ directory and summarize what you learned"
2. **Start a task:** Pick something small (e.g., "add a link to the footer") and use the goal format
3. **Review SESSION_LOG:** See the two entries already there (penny list + this system)
4. **Customize as needed:** This is YOUR system — adjust CONTRACT, DECISION_RIGHTS, etc. as you learn what works
5. **With ChatGPT Codex:** Try asking it to check the current git branch or create a test PR (uses MCPs automatically)

---

## Questions?

If you're unsure about something:
- **Ask AI:** "Based on DECISION_RIGHTS.md, can you [do X] or do I need to approve it first?"
- **Check CONTRACT.md:** See what AI should be providing
- **Read LEARNINGS.md:** See if someone already solved this problem

---

## Final Thought

This system is proof that **you don't need to code to create professional software.** You need:
- Clear goals
- Structured collaboration
- Quality standards
- Persistent memory

You've got all four now. Go build something amazing.

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial quickstart guide
