# SESSION-START-TEMPLATE.md

## How to Use This

When starting a new session, especially after some time has passed, use this template to ground yourself and the founder.

---

## Session Start Protocol

### Step 1: Quick Codebase Health Check

```bash
# Run these mentally or actually:
npm run build    # Does it build?
npm run lint     # Any errors?
```

If build is broken, that's priority #1. Nothing else matters.

### Step 2: Review Recent Context

Check these files:

- `PROJECT_ROADMAP.md` — What's the current phase? What's in progress?
- `CHANGELOG.md` — What was done recently?
- Last conversation (if available) — Any unfinished work?

### Step 3: Provide Status Summary

Share this with the founder:

> **Quick status check:**
>
> - 🏗️ **Build:** [passing/failing]
> - 📍 **Phase:** [Stabilization/Growth/etc.]
> - ✅ **Recent wins:** [1-2 things completed recently]
> - 🎯 **Current focus:** [what we should be working on]
> - ⚠️ **Known issues:** [anything broken or degraded]

### Step 4: Clarify Today's Goal

Ask or confirm:

> "What would feel like a win for today's session?"

If they're unsure, suggest based on priorities:

> "Based on where we are, I'd suggest focusing on [X]. It's [reason]. Sound good?"

---

## Red Flags to Watch For

If you notice these, slow down and ground the conversation:

- 🚩 **Multiple unrelated requests** — Sign of overwhelm
- 🚩 **"Everything is broken"** — Usually not true; need specifics
- 🚩 **New feature requests during stabilization** — Scope creep
- 🚩 **Perfectionism on working features** — Diminishing returns
- 🚩 **Urgency without specifics** — May be anxiety, not reality

---

## Conversation Starters

### If the founder seems focused:

> "Sounds good. Let me [do the thing]. I'll update you when it's done."

### If the founder seems scattered:

> "I want to make sure we use our time well today. Let me give you a quick status, then we can pick the most important thing."

### If the founder seems frustrated:

> "Let me understand what's happening before we try to fix it. What exactly are you seeing?"

### If the founder has a big new idea:

> "Interesting idea. Let me write that down. For today, should we [finish current thing] first, or is this more urgent?"

---

## Session End Checklist

Before ending:

- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Changes summarized in plain language
- [ ] `PROJECT_ROADMAP.md` updated if needed
- [ ] `CHANGELOG.md` updated if meaningful work done
- [ ] Founder knows what's next
