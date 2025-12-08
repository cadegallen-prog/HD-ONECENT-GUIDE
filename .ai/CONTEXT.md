# Project Context

**Purpose:** Understanding WHY this project exists and WHO it serves. This context informs every technical decision.

---

## The Community

### Who Are Penny Hunters?

**Facebook Group:** "Home Depot One Cent Items" (40,000+ members and growing)

**Profile:**
- Savvy shoppers, not casual bargain browsers
- Experienced with clearance cycles and markdown timing
- Want actionable intel, not hype or fluff
- Value education over entertainment
- Skew practical: "Will this item actually be useful?"

**What They Care About:**
- ✅ Real-time intel on what's clearing to penny right NOW
- ✅ Tools to find stores and plan efficient trips
- ✅ Understanding HOW clearance works (not just getting lucky)
- ✅ Community-validated finds (crowd-sourced quality control)

**What They Don't Care About:**
- ❌ Gamification (badges, points, leaderboards)
- ❌ Social features (comments, profiles, likes)
- ❌ Hype or clickbait ("You won't BELIEVE what cleared!")
- ❌ Overly curated lists (they trust the crowd more than one person)

---

## The Problem This Solves

### Before PennyCentral.com

- Info scattered across Facebook posts (hard to search)
- No central reference for HOW clearance works
- Store finder tools were generic (not HD-specific)
- No easy way to see "what's clearing this week"
- High-value finds got buried in group noise

### After PennyCentral.com

- ✅ One authoritative guide on clearance mechanics
- ✅ HD-specific store finder with all 51 locations
- ✅ Community-powered penny list (updated hourly)
- ✅ Trip planning tool (plan multi-store routes)
- ✅ Clean, fast, mobile-friendly experience

---

## The Vision

### Core Value Proposition

**"The utility/reference guide for penny hunting at Home Depot"**

Not a marketplace. Not a forum. Not a blog. A **reference tool** that:
- Works fast on mobile (in parking lots, on the road)
- Stays accurate and trustworthy
- Requires minimal maintenance (Cade is a solo operator)
- Grows through community contributions (not manual curation)

### Success Looks Like

**For Users:**
- Find what they need in < 30 seconds
- Return weekly to check new penny finds
- Recommend the site to other penny hunters
- Feel confident the info is current and accurate

**For Cade:**
- Site runs itself (minimal daily maintenance)
- Community self-moderates quality (crowd-sourced validation)
- No stress about technical debt or fragility
- Easy to hand off tasks to AI (clear, repeatable processes)

---

## Why Cade Built This

Cade is the admin of the 40k-member Facebook group. The group kept asking:
- "How does clearance work?"
- "Where's the nearest Home Depot?"
- "What's clearing this week?"

Answering these questions repeatedly was unsustainable. PennyCentral.com is the **permanent answer** to those questions.

### Cade's Constraints

- **Non-coder:** Directs AI to build features, doesn't write code
- **Solo operator:** No team, no co-founder, no tech support
- **Limited time:** Managing 40k-member group + this site
- **Risk-averse:** Stability > fancy features

### Cade's Philosophy

"I can learn to code without coding" — Through hundreds of hours of AI orchestration, Cade understands:
- What's possible technically
- How to communicate goals clearly
- How to evaluate trade-offs
- How to maintain quality without knowing syntax

This project is proof that **natural language + AI collaboration** can create professional-grade software.

---

## Current State (Dec 2025)

### What's Live

| Feature | Status | Impact |
|---------|--------|--------|
| Penny Guide | ✅ Live | Educational foundation |
| Store Finder | ✅ Live | High utility, mobile-friendly |
| Trip Tracker | ✅ Live | Planning tool |
| Penny List | ⭐ NEW | Game-changer (community-powered) |
| Cashback Guide | ✅ Live | Monetization path (BeFrugal referral) |
| Resources | ✅ Live | External links |
| About | ✅ Live | Community context |

### The Big Win: Autonomous Penny List

**Launched:** December 7, 2025

**What It Does:**
- Community submits penny finds via Google Form
- Site auto-fetches responses every hour
- Zero manual moderation (just delete spam in Sheet if needed)
- Privacy-safe (emails/timestamps stay server-side)

**Why It Matters:**
- Converts 40k members into data sources
- Creates real-time intelligence feed
- Increases daily return reasons (users check for new finds)
- Requires no Cade time to maintain

This single feature transformed the site from "reference guide" to **"living, community-powered tool"**.

---

## What This Means for AI Assistants

### Prioritize:
1. **Stability** — Don't break what works
2. **Mobile experience** — Users are on phones in parking lots
3. **Speed** — Fast page loads, instant interactions
4. **Simplicity** — Clear, uncluttered UX
5. **Low maintenance** — Cade can't debug complex systems

### Avoid:
1. Over-engineering — "Good enough" beats "perfect"
2. Fancy UI — Clean and functional > impressive but complex
3. New dependencies — Each one adds maintenance burden
4. Requiring Cade's daily input — Must be self-sustaining

### Remember:
- This serves real people with real needs (not a portfolio project)
- The community trusts Cade; don't erode that trust with instability
- Every change should ask: "Does this help penny hunters?"

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial context document
