# GitHub Copilot Instructions — Penny Central

## Project Overview
**Penny Central** (pennycentral.com) is a utility guide for finding Home Depot $0.01 clearance items, serving a 37,000+ member Facebook community. It's a **practical field guide with tools**, not a blog, forum, or SaaS.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Vercel

---

## Critical Files to Know

| File | Purpose |
|------|---------|
| `AGENTS.md` | **Master source of truth** — design system, user constraints, behavior rules |
| `SKILLS.md` | Technical stack reference, domain knowledge, MCP patterns |
| `lib/constants.ts` | Centralized constants (member count, URLs) — update here, not inline |
| `PROJECT_ROADMAP.md` | Current priorities and feature status |

---

## User Context
The user **cannot code**. They can copy/paste and follow instructions. You are the engineer; they are the product owner. Provide complete, working code — never stubs or "fill in here" comments.

---

## Design System — Slate Steel (Strict)

**Light:** `#FAFAFA` bg, `#0F172A` text, `#475569` accent  
**Dark:** `#0F172A` bg, `#FAFAFA` text, `#64748B` accent

**Forbidden:** Gradients, shadows, animations >150ms, emoji in UI, colored cards, orange/amber/teal/cyan/pink/purple/indigo accents, gamification, decorative graphics.

**Accent rule:** Max 3 accent elements per screen (1 primary button, active nav, hover states).

---

## Key Patterns

### Constants (Single Source of Truth)
```typescript
// ✅ Use constants from lib/constants.ts
import { COMMUNITY_MEMBER_COUNT_DISPLAY, BEFRUGAL_REFERRAL_PATH } from "@/lib/constants"

// ❌ Never hardcode
<p>Join 37,000+ hunters</p>  // Wrong
```

### Component Imports
```typescript
// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Icons (lucide-react only)
import { MapPin, Search, ExternalLink } from "lucide-react"
```

### Page Structure
All pages use App Router in `app/`. Each page exports metadata:
```typescript
export const metadata: Metadata = {
  title: "Page Title | Penny Central",
  description: "...",
}
```

### Affiliate Redirects
Use `/go/` routes for trackable affiliate links:
```typescript
// In components, link to the redirect path
<a href={BEFRUGAL_REFERRAL_PATH}>Get Cashback</a>

// The redirect lives at app/go/befrugal/route.ts
// Returns 301 to the actual affiliate URL
```

---

## Commands
```bash
npm run dev      # Dev server (localhost:3001)
npm run build    # Production build — run before committing
npm run lint     # ESLint check
```

---

## Workflow Rules

1. **Minimal edits** — No reorganizing folders or renaming files without explicit ask
2. **Build before push** — Always run `npm run build` to verify
3. **Summarize changes** — After edits, list files changed and what changed
4. **Update docs** — If meaningful work done, update `PROJECT_ROADMAP.md` or `CHANGELOG.md`
5. **Commit messages** — Use descriptive messages explaining the "what" and "why"

---

## Don't Touch (Without Good Reason)
- `package.json` (unless adding necessary deps)
- `.env*` files
- `next.config.js`
- `tailwind.config.ts` (unless design system change)

---

## When Unsure
1. Ask one clarifying question
2. Or state your assumption: "I interpreted this as X. If you meant Y, let me know."
3. Default to minimal change with comments for future extension
