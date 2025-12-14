# Quickstart (deprecated)

Content merged into README.md and USAGE.md to keep the system lean. Use those two files plus SESSION_TEMPLATES.md for any prompts you need.

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
