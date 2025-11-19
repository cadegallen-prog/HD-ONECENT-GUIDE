# 🎯 Session Modes Cheat Sheet

**Copy-paste these prompts to get the AI behavior you want**

---

## 🧠 Strategic Mode
**USE WHEN:** You have an idea but aren't sure how to approach it

```
Strategic mode: I need to explore options before we build anything.

Read PLAYBOOK.md for context.

[Describe your idea]

Help me think through:
1. What are 2-3 different ways to approach this?
2. What's cool/innovative that I might not have thought of?
3. For each approach: What's great? What could go wrong?
4. Which approach gives me the most flexibility later?
5. What should I try first to validate this idea?

Be creative. Suggest things I haven't considered. I want to explore possibilities.
```

**EXAMPLE:**
> Strategic mode: I need to explore options before we build anything.
>
> Read PLAYBOOK.md for context.
>
> I want to add a way for users to track which stores they've visited and what they found. Maybe with notes?
>
> [same questions as above]

---

## 📋 Planning Mode
**USE WHEN:** You've decided on an approach and need a detailed plan

```
Planning mode: Let's design this feature step-by-step.

Read PLAYBOOK.md and AI-QUICKSTART.md.

We've decided to: [your decision from strategic mode]

Create a detailed plan:
1. Break this into 3-5 phases I can test independently
2. What's the simplest version that proves the concept?
3. What can I verify after each phase (without reading code)?
4. Where might we get stuck? What's the backup plan?
5. What should we build AFTER this to build on it?

Think ahead. What opportunities does this create?
```

**EXAMPLE:**
> Planning mode: Let's design this feature step-by-step.
>
> Read PLAYBOOK.md and AI-QUICKSTART.md.
>
> We've decided to: Add a store tracker using localStorage (no backend needed)
>
> [same questions as above]

---

## ⚙️ Execution Mode
**USE WHEN:** Ready to build a specific, well-defined task

```
Execution mode: Build this specific task.

Read AI-QUICKSTART.md.

Task: [Clear, specific request]

Success looks like:
- [Outcome 1]
- [Outcome 2]

After building, tell me:
1. What you built and where to test it
2. What could break and how I'd know
3. What we should enhance next
4. Any creative ideas you had while building
```

**EXAMPLE:**
> Execution mode: Build this specific task.
>
> Read AI-QUICKSTART.md.
>
> Task: Create a store tracker component that saves to localStorage
>
> Success looks like:
> - I can add a store visit with date, location, and notes
> - The list persists when I refresh the page
> - I can delete entries
>
> [same questions as above]

---

## 🔍 Review Mode
**USE WHEN:** Every 3-5 features, or when things feel messy

```
Review mode: Let's step back and assess our progress.

We've recently built:
- [Feature 1]
- [Feature 2]
- [Feature 3]

Strategic review:
1. What patterns are emerging? What's working well?
2. What's getting messy or fragile?
3. What foundation work should we do now to make future features easier?
4. What am I NOT asking about that I should be?
5. What creative opportunities are we missing?
6. What will bite me in 3 months if we don't address it?

Be honest and proactive. Suggest improvements I haven't thought of.
```

**EXAMPLE:**
> Review mode: Let's step back and assess our progress.
>
> We've recently built:
> - Internal Systems page
> - Facts vs Myths page
> - Navigation between pages
>
> [same questions as above]

---

## 🚀 Quick Tips

**Start sessions with mode selection:**
- 🧠 Strategic = "What should we do?"
- 📋 Planning = "How should we do it?"
- ⚙️ Execution = "Do it"
- 🔍 Review = "How did it go?"

**Mix and match:**
- One session can use multiple modes
- Switch modes mid-conversation by saying the mode name

**When in doubt:**
- Start with Strategic mode
- Move to Planning when you've decided
- Only go to Execution when you have a clear plan

**Remember:**
- AI should suggest creative solutions
- AI should explore multiple options
- AI should think long-term
- AI should be proactive, not just reactive

---

## 💡 Pro Move: The Full Cycle

For major features, go through all 4 modes:

1. **Strategic:** Explore 3 approaches, pick one
2. **Planning:** Break into phases, identify risks
3. **Execution:** Build phase 1, test, iterate
4. **Review:** After 2-3 phases, assess and refine

---

**Keep this file handy and copy-paste as needed!**

Last Updated: 2025-11-19
