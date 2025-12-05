# AGENTS GUIDE

This file is the single source of truth for how any AI assistant should work in this repo.

If you are Claude, GitHub Copilot Chat, ChatGPT, or any other agent reading this, follow these rules.

---

## 1. About the user

- The user **cannot read, write, debug, or review code** in a meaningful way.
- They can:
  - Copy and paste.
  - Follow clear, concrete instructions.
  - Understand concepts if explained in plain language.

Assume:

- You are the engineer.
- They are the product owner and tester.
- You must protect them from complexity and accidental damage.

---

## 2. General behavior rules

1. **Minimal disruption**
   - Do not restructure the whole codebase unless explicitly asked.
   - Prefer small, targeted changes that solve the current problem.

2. **Explain what you did**
   - After making changes, always write a short summary:
     - Which files you touched.
     - What each change does in plain language.

3. **No surprise refactors**
   - Do not rename lots of files, move folders, or introduce heavy new dependencies without a clear reason and explicit approval in the prompt.

4. **Be conservative with deletions**
   - If something looks unused, prefer to:
     - Mark it as deprecated in a comment, or
     - Move it to a clearly named `archive/` folder,
       before actually deleting it.

---

## 2.5 Copilot and Credit Awareness

GitHub Copilot Chat consumes metered credits per interaction.

**Efficiency rules:**

- Short, superficial replies are wasteful. Each response should deliver substantial, multi-step progress.
- Prefer dense, well-structured answers that move several related pieces forward at once.
- Respect the user's energy limits. Be information-dense rather than long-winded.
- Use clear headings and bullet points over walls of prose.
- For strategic decisions, provide at most 3 options and clearly recommend one.

---

## 3. Documentation structure

There are a few key docs that you must treat as a system:

| File                              | Purpose                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `README.md`                       | High level explanation of what this project is and how to run it. Links to the other docs. |
| `AGENTS.md` (this file)           | How agents should behave. User preferences and constraints. Safety rules. Design system.   |
| `SKILLS.md`                       | Compact reference for technical stack, domain skills, MCP servers, and tooling.            |
| `CLAUDE.md`                       | Claude specific instructions that reference `AGENTS.md` and `SKILLS.md`.                   |
| `.github/copilot-instructions.md` | Copilot Chat specific instructions that reference `AGENTS.md` and `SKILLS.md`.             |
| `PROJECT_ROADMAP.md`              | High level features, status, and upcoming work.                                            |
| `CHANGELOG.md`                    | Brief chronological log of completed work for progress visibility.                         |

These files should **not** drift apart or contradict each other.

---

## 4. Auto tidy rule for agents

At the end of any **feature implementation**, **meaningful refactor**, or **config change**, run this mental checklist:

1. Does `README.md` still describe the project accurately?
   - If new commands, new entry points, or new features were added, update README briefly.

2. Does `PROJECT_ROADMAP.md` need an update?
   - If you completed, abandoned, or significantly changed a planned feature, reflect that in the roadmap.

3. Does `AGENTS.md` need an update?
   - Only if:
     - The user preferences changed.
     - The structure of the project changed in a way that affects how agents should work.
   - Keep this file stable. Update it only when truly necessary.

4. Do `CLAUDE.md` or `.github/copilot-instructions.md` need tweaks?
   - Only if we changed how we expect those tools to be used.
   - They should mostly just point to `AGENTS.md`.

If you change any of these docs:

- Keep edits minimal.
- Do not rewrite the user's voice.
- Note the change in your summary.

---

## 5. How to use this file inside a session

At the start of a new session, do this:

1. Locate and open:
   - `AGENTS.md` (this file)
   - `README.md`
   - `PROJECT_ROADMAP.md`
   - Tool specific file for your client:
     - `CLAUDE.md` if you are Claude.
     - `.github/copilot-instructions.md` if you are Copilot Chat.

2. Build a short mental model:
   - What this repo is for.
   - What the current state of the project is.
   - What the user's constraints are.

3. While working:
   - Always stack your decisions against:
     - "Does this help the user move forward with minimal mess?"
     - "Is this consistent with the docs?"

---

## 6. Style constraints

- No unnecessary files.
- No huge monolithic "god" modules if you can avoid it.
- Favor clarity over cleverness.
- Prefer explicit names and simple flows.

When in doubt:

- Leave a short comment in code explaining why something exists, especially if it is a hack or temporary workaround.

---

## 7. When you are not sure

If you are unsure where to put something or whether to change a global pattern:

- Default to:
  - Minimal change.
  - A small comment in the relevant doc.
- Do not invent completely new directory structures unless the prompt clearly asks for an architectural rework.

---

## 8. Project specific details

### What this project is

Penny Central is a **utility/reference guide** for finding Home Depot clearance items marked to $0.01. It serves a 37,000+ member Facebook community.

**Mission:** Build and maintain PennyCentral.com as the central hub for:

- Education on Home Depot penny items and deep discounts
- Tools that help members find, plan, and evaluate deals
- Practical guidance on whether items are worth buying to keep, donate, or resell, with realistic time vs money tradeoffs

**Site type:** Practical field guide with utility tools (Store Finder, Trip Tracker)  
**Not:** A blog, forum, marketplace, SaaS, or gamified learning platform

**Live site:** https://pennycentral.com

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Font:** Inter (headings + body)
- **Hosting:** Vercel

### Design System — WCAG AAA Compliant

**Full specification:** See `docs/COLOR-SYSTEM.md` for complete contrast ratios and verification.

**Target:** WCAG AAA (7:1 normal text, 4.5:1 large text, 3:1 UI components)

#### Color Philosophy

- **60-30-10 Rule:** 60% neutral backgrounds, 30% supporting elements, 10% CTA accent
- **Warm neutrals + Cool CTA:** Stone/cream backgrounds with blue accent for maximum pop
- **Complementary contrast:** Warm vs cool creates clear visual hierarchy

#### Light Mode (Quick Reference)

| Role            | Hex       | Contrast | WCAG   |
| --------------- | --------- | -------- | ------ |
| Page background | `#FFFFFF` | —        | —      |
| Card surface    | `#F8F8F7` | —        | —      |
| Primary text    | `#1C1917` | 15.4:1   | ✓ AAA  |
| Secondary text  | `#44403C` | 9.7:1    | ✓ AAA  |
| Muted text      | `#57534E` | 7.1:1    | ✓ AAA  |
| CTA button      | `#1D4ED8` | 8.6:1    | ✓ AAA  |
| Borders         | `#E7E5E4` | —        | —      |

#### Dark Mode (Quick Reference)

| Role            | Hex       | Contrast | WCAG   |
| --------------- | --------- | -------- | ------ |
| Page background | `#171412` | —        | —      |
| Card surface    | `#231F1C` | —        | —      |
| Primary text    | `#FAFAF9` | 16.2:1   | ✓ AAA  |
| Secondary text  | `#D6D3D1` | 11.8:1   | ✓ AAA  |
| Muted text      | `#A8A29E` | 7.1:1    | ✓ AAA  |
| CTA button      | `#3B82F6` | 4.7:1    | ✓ AA   |
| Borders         | `#3D3835` | —        | —      |

#### CTA Accent Rules

The CTA blue (`#1D4ED8` / `#3B82F6`) may ONLY appear on:

1. ONE primary button per page (the main action)
2. Active navigation state
3. Inline links (must also be underlined)
4. Focus rings

Maximum 3 accent elements visible per screen.

#### Interactive Element Requirements

- **Inline links:** MUST be underlined AND use CTA color (not just on hover)
- **Buttons:** Solid background, 44x44px minimum touch target, visible hover/focus states
- **Focus rings:** 2px solid outline with offset, visible on all focusable elements

### Forbidden Elements

Never add:

- Illustrations or decorative graphics
- Gradients (except subtle button gradients)
- Shadows (except subtle card elevation)
- Animations longer than 150ms
- Text larger than 22px
- Emoji in UI
- Colored card backgrounds
- Multiple accent colors
- Orange, amber, teal, cyan, pink, purple, or indigo as accents
- Gamification (XP, levels, achievements, badges)
- Price tag icons or shopping illustrations

### Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run linter
```

### Don't Touch (without good reason)

- `package.json` (unless adding necessary dependencies)
- `.env*` files
- `next.config.*` (unless fixing routes)

---

## 9. Skills, Tools, and MCP

**For technical stack, domain skills, MCP servers, and tooling guidance, see `SKILLS.md`.**

That file is the canonical reference for what this project can do and how to work efficiently with its tools.

---

## 10. Handling Unclear Requests

When the user's request is vague or ambiguous:

1. **Do not guess wildly.** Ask one targeted clarifying question.

2. **Offer bounded options.** Present at most 3 interpretations and ask which they meant.

3. **Default to minimal.** If you must proceed, choose the smallest change that could plausibly satisfy the request.

4. **State your assumption.** Begin your implementation with "I interpreted this as X. If you meant Y, let me know."

5. **Suggest adjacent value.** After completing a task, you may optionally suggest one related improvement. Mark it clearly as optional and do not implement without approval.
