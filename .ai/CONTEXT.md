# Project Context — Penny Central

**Last updated:** Jan 4, 2026

This file is the stable "why/what/who" for PennyCentral.com. It should change rarely. If you need current status or next tasks, see `.ai/STATE.md` and `.ai/BACKLOG.md`.

---

## The North Star (Read This First)

> **AI Agents: This section is foundational. Every design decision, feature choice, and UI change must align with this understanding. Do not deviate.**

### The Core Value Proposition (One Sentence)

**Penny Central provides aggregated community intel that Facebook structurally cannot provide: searchable, organized, SKU-aggregated data showing report counts, state distribution, and recency across the entire penny-hunting community.**

### The Flywheel (This Is How We Survive)

```
Users find penny items in-store
         ↓
They report to Penny Central (<30 seconds)
         ↓
Site aggregates by SKU (report counts, states, recency)
         ↓
Other users see credible, organized data
         ↓
They trust it, use it, and contribute back
         ↓
More reports = more value = more users = more reports
```

**Without contributions, the site dies.** Everything we build must reduce friction for contributions and show users that their contributions matter.

### What Facebook CAN'T Do (Our Moat)

The 50K-member Facebook group is valuable but has structural limitations:

- Posts get buried within hours
- No way to aggregate reports by SKU
- No way to see "this item reported 47 times across 12 states"
- No search by SKU
- No filtering by state or date

**Penny Central exists to fill these gaps.** We are not competing with the group - we are its structured memory.

### Report Counts & State Distribution Are CORE, Not Clutter

This is critical for UI/design decisions:

| Data Point         | Why It's Core                                       |
| ------------------ | --------------------------------------------------- |
| Report count       | Shows community validation ("47 people found this") |
| State distribution | Shows geographic spread ("active in 12 states")     |
| Recency            | Shows freshness ("reported 4 days ago")             |

**These are NOT clutter to be hidden.** They are the product. They show what Facebook cannot show. Any design that hides or de-emphasizes these signals undermines the core value proposition.

### The User Journey

1. **Home Research** - Browse list, build mental/physical hunt list, check recency and report counts to gauge confidence
2. **In-Store Hunting** - Quick visual scanning to match items from prepared list
3. **In-Store Discovery** - Check if a found item is on the list, confirm via SKU
4. **Contribution** - Report a find to help others, see the community grow

All four phases must be served. Optimizing only for Phase 2 (scanning) while ignoring Phase 1 (research) or Phase 4 (contribution) breaks the flywheel.

### Decision Frame (Keep Agents Oriented)

This is the primary “zoomed-out” framing that prevents local optimizations from drifting away from the core loop. Treat these as the main levers for the foreseeable future; the goal is 80-90% of “near-perfect” on the core loop, not endless expansion.

**Three growth levers (the why behind most work):**

1. **More submissions (Report a Find)**
   - **Steelman:** This is flywheel fuel. More verified reports makes the Penny List more valuable, brings users back, and creates more reports. It’s also the most controllable lever (reduce friction, increase trust, improve defaults).
   - **Strawman:** “Just make the form prettier.” Overbuild the form, increase abandonment, and/or accept lower-quality reports that erode trust.

2. **Better Penny List retention**
   - **Steelman:** Retention creates habit. The list must feel reliably useful (fresh, scannable, credible signals) so people return and contribute again.
   - **Strawman:** Endless UI polish/features that add complexity without improving usefulness, increasing maintenance cost and confusion.

3. **More Google traffic (SEO)**
   - **Steelman:** SEO diversifies beyond Facebook and compounds if it’s intent-matched and internally linked into the Penny List + Report Find loop.
   - **Strawman:** Generic content and keyword-chasing that drives vanity traffic without converting into retention or submissions.

**Two supporting categories (not “growth levers”, but often prerequisites):**

4. **Stability + verification + agent workflow**
   - If this is weak, everything else becomes stressful and expensive (regressions, “AI did the wrong thing”, lack of proof).

5. **Data pipeline correctness**
   - If this is weak, the Penny List can’t be trusted (freshness/credibility suffers) and SEO/retention gains won’t stick.

---

## Mission

PennyCentral.com is the companion utility site for the **“Home Depot One Cent Items”** Facebook community (~50,000 members).  
The mission is simple: **turn scattered penny‑hunting knowledge into a fast, reliable field guide + living intel feed.**

---

## Who We Serve

- **Primary users:** existing Facebook group members who already hunt pennies.
- **Secondary users:** organic searchers learning how pennies work.

The group is conversation and proof; the site is structured memory and tooling.

---

## Core Value Proposition

1. **Guide-first education**
   - Explains markdown lifecycle, clearance cadence, and in‑store strategy.
   - Goal: help users avoid wasted trips and confusion.

2. **Practical tools**
   - Store Finder for planning hunts.
   - Trip Tracker is optional/future and must stay low‑maintenance.

3. **Crowd Reports → Penny List (The Magnum Opus)**
   - Users report finds in <30 seconds via low-friction form.
   - The site aggregates by SKU and shows:
     - recent leads (last 30 days),
     - **report counts by state (CORE - shows community validation)**,
     - **state distribution (CORE - shows geographic spread)**,
     - auto‑calculated rarity tiers.
   - Goal: give a nationwide/regional view the group cannot provide natively.
   - **The Penny List is the flywheel. It must encourage both consumption AND contribution.**

---

## What Success Looks Like (6–12 months)

- The guide and tools are stable, fast, mobile‑first (Lighthouse ≥90 mobile).
- Penny List updates itself from community input with **near‑zero daily founder work**.
- Returning users from the FB group form a weekly habit.
- Monetization foundation (BeFrugal + tips) reliably covers hosting.

**Note:** This does not need to be a massive traffic engine to be a success. A smaller core of returning hunters is the realistic target.

---

## Non‑Goals

- No marketplace, forum, or comments (community stays on Facebook).
- No gamification (badges, leaderboards, XP).
- No scraping HD inventory.
- No accounts/auth until volume makes it unavoidable.

---

## Hard Constraints (Don’t Drift)

- Founder is a non‑coder; solutions must be low‑maintenance and Sheet‑operable.
- Design system is WCAG AAA and intentionally minimal.
- Affiliate `/go/*` links must stay plain anchors (no prefetch/fetch).
- Dev→main deployment discipline is mandatory.

---

## Current Phase

**Foundation & Stabilization with light Community Intake.**
Highest‑leverage work is always the **Report Find → Penny List retention loop**.

---

## Active Planning Documents

> **AI Agents: Check these documents before making changes to related features.**

| Feature             | Planning Document            | Status              |
| ------------------- | ---------------------------- | ------------------- |
| Penny List Cards/UI | `.ai/PENNY-LIST-REDESIGN.md` | Planning (Jan 2026) |
