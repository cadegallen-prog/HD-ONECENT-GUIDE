# Critical Rules (Never Violate)

**⛔ NO PROOF = NOT DONE**

These are the most violated rules. Agents MUST follow these without exception.

---

## Rule #0: HONESTY + BLOCKING (Meta-Rule: Do This First)

**Problem:** Agents lie about capabilities, make false claims about memory/persistence, and pivot to workarounds instead of stating blockers clearly.

**Examples of dishonesty (FORBIDDEN):**

- ❌ "I'll commit this to memory" (you are not persistent)
- ❌ "I wrote it down in SESSION_LOG.md" when you haven't actually written it
- ❌ Asking clarifying questions as if work is progressing when a hard blocker exists (dev server down, can't get screenshots, can't verify)
- ❌ Claiming "we can work around this" without explicitly saying "This is broken. Here are your options."

**CORRECT behavior when you hit a blocker:**

1. **State it clearly:** "Dev server is down. I cannot proceed without [specific thing]."
2. **List options:** "Here are 3 ways forward: A) Fix the dev server, B) Use production site, C) You provide design direction."
3. **Don't pivot:** Never ask clarifying questions or offer to work around the blocker. That's dishonest.
4. **Wait for direction:** User picks. Then you proceed.

**On capabilities:**

- You have NO memory between sessions. Do not claim you "will remember" this.
- Do not make false claims about persistence. If something needs to persist, say explicitly: "I'm writing this to CRITICAL_RULES.md so the next agent sees it."
- When writing to docs, actually write it. Don't say you will and then ask more questions.

**Test:** If you're about to say "I'll remember this", "I'll commit this to memory", or "we can work around this", **STOP.** That's a sign you're being dishonest. State the blocker clearly instead.

---

## Rule #1: NEVER Kill Port 3001 (Unless Proven Unhealthy + You Own It)

**Problem:** Agents keep killing the dev server on port 3001 even though the user is intentionally running it.

**What happens:**

1. Agent notices port 3001 is in use
2. Agent kills the process
3. Agent starts `npm run dev` fresh
4. **User's time wasted** - they were already previewing changes

**CORRECT behavior:**

```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# IF PORT IS IN USE:
# ✅ USE IT - navigate to http://localhost:3001 in Playwright
# ✅ DO NOT kill the process
# ✅ DO NOT restart npm run dev

# IF PORT IS FREE:
# ✅ NOW you can run: npm run dev
```

**Exception:** Only kill port 3001 if:

- User explicitly asks you to restart it
- Process is **proven unhealthy** (port is LISTENING but HTTP does not respond after a few retries)
- And you **know you own that process** (you started it in this session / terminal), or you’ve asked you (Cade) first

**Default assumption:** If port 3001 is occupied = **user is running server intentionally. Use it.**

**HTTP readiness check (use this before calling it “hung”):**

```bash
powershell -NoProfile -Command "try { (Invoke-WebRequest -Uri http://localhost:3001 -UseBasicParsing -TimeoutSec 5).StatusCode } catch { $_.Exception.Message }"
```

---

## Rule #2: NEVER Use Generic Tailwind Colors

**Problem:** Agents keep using boring, generic Tailwind colors that look cheap and unprofessional.

**FORBIDDEN (DO NOT USE):**

- ❌ `blue-500`, `blue-600`, `blue-700`
- ❌ `gray-500`, `gray-600`, `gray-700`
- ❌ `green-500`, `red-500`, `indigo-600`
- ❌ ANY raw Tailwind color names

**These look generic and lazy.**

**REQUIRED APPROACH:**

**Option 1: Use existing design tokens ONLY**

```css
/* ONLY use these from globals.css */
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--cta-primary, --cta-text
--border-default, --border-strong
--text-primary, --text-secondary, --text-muted
--bg-page, --bg-elevated, --bg-card, --bg-subtle
```

**Option 2: Get approval FIRST before adding new colors**

```
"This button needs a distinct color.

Current option: Use existing --cta-primary
Alternative: Introduce new accent color (requires approval)

Which would you prefer?"
```

**Rule:** NEVER add colors without either:

1. Using existing tokens from globals.css, OR
2. Getting user approval with before/after screenshots

---

## Rule #3: NEVER Claim "Done" Without Proof

**Problem:** Agents claim "tests pass" or "bug fixed" without actually verifying.

**What happens:**

1. Agent: "All tests pass now!"
2. User checks: Tests are failing
3. **Trust broken, time wasted**

**REQUIRED:** Before claiming "done", you MUST provide:

### Required for "Done"

1. **All 4 tests pass** (paste output):

   ```bash
   npm run lint      # 0 errors
   npm run build     # successful
   npm run test:unit # all passing
   npm run test:e2e  # all passing
   ```

   **If you touched styles/colors:** also paste `npm run lint:colors` output and confirm no raw Tailwind palette colors were introduced.

2. **Screenshots** (if UI changed):
   - Before/after
   - Light + dark mode
   - Browser console (no errors)

3. **Docs/memory updated** (if meaningful change):
   - `SESSION_LOG.md` (required)
   - `STATE.md` (if meaningful change)
   - `BACKLOG.md` (if priorities moved)

4. **GitHub Actions** (if applicable):
   - Paste URL: `https://github.com/.../runs/{id}`
   - Status must be ✅ green

5. **Proof problem is fixed**:
   - Show bug existed
   - Show bug is gone

6. **Documentation updated (proof required)**:

   ```bash
   git diff .ai/topics/ .ai/STATE.md .ai/BACKLOG.md
   ```

   - If no output = docs didn't change = not actually done yet
   - Paste the diff so user can see what changed

**No exceptions.**

### Template: Claiming Done

````markdown
## Verification

**Tests:**

- lint: ✅ 0 errors
- build: ✅ success
- test:unit: ✅ 1/1 passing
- test:e2e: ✅ 28/28 passing

**Playwright:**

- Before: [screenshot]
- After: [screenshot]
- Console: no errors
- Modes: light + dark tested

**GitHub Actions:**

- ✅ https://github.com/.../runs/12345

**Problem fixed:**

- Before: [describe/screenshot]
- After: [describe/screenshot]

**Docs updated:**

```bash
git diff .ai/topics/ .ai/STATE.md .ai/BACKLOG.md
[paste output here or "no changes"]
```
````

```

**Use this template. No shortcuts.**

---

## Rule #4: Internet SKU Map (Backend-Only)

**Purpose:** Private internet-SKU map for generating outbound Home Depot product links.

**Requirements:**

- Use the private internet-SKU map **only on the backend** to generate Home Depot product links
- The UI should continue showing the **regular SKU only**; internet SKU must stay private
- Keep the map in **private storage** (env var, Vercel Blob, Google Drive) and **never commit it**
- **Fallback:** When a mapping is missing, build links from the regular SKU

---

## Rule #5: Session Log Auto-Trim

**Purpose:** Keep SESSION_LOG.md readable and fast to load.

**Requirements:**

- After adding a session entry, if `.ai/SESSION_LOG.md` has **more than 5 entries**, trim to keep only the **3 most recent**
- Git history preserves everything - trimming keeps the file readable and fast to load

---

## Stopping Criteria

**The Meta-Rule:** If you've accomplished the user's goal and passed all quality gates, **STOP**.

### ✅ STOP if:

1. User's goal accomplished
2. All 4 quality gates passed (lint/build/unit/e2e)
3. Documentation updated
4. User informed of what was done and next steps

**Don't add "bonus" improvements unless explicitly requested. Don't refactor working code. Don't optimize prematurely.**

---

## QA Trigger Rules

### Default: qa:fast

All PRs run `npm run qa:fast` automatically. This includes:
- **lint** - ESLint checks
- **test:unit** - Unit tests
- **build** - Next.js production build (catches type errors)

Estimated time: ~2 minutes

### When to Run qa:full

Full QA runs automatically when:
- PR touches **risky files** (auth, db, api, infra, fragile UI)
- PR has the **`full-qa` label** added

**What qa:full adds:**
- **test:e2e** - Playwright end-to-end tests
- **check-contrast** - Color contrast validation
- **check-axe** - Accessibility checks

Estimated time: ~8 minutes

**Risky file paths (auto-trigger full QA):**
```

middleware.ts # Auth & security
app/auth/** # Auth pages
lib/supabase/** # Database client
supabase/migrations/** # DB schema changes
lib/fetch-penny-data.ts
lib/penny-list-query.ts
app/api/** # API routes
next.config.js # Build config
package.json # Dependencies
.github/workflows/** # CI changes
components/store-map.tsx # Fragile component
app/**/layout.tsx # Layout changes
app/globals.css # Global styles

```

---

## Playwright Required For

**When required:**
- All UI changes (buttons, forms, layouts, colors)
- All JavaScript changes (Store Finder, interactive features)
- All "bug fixed" claims (visual bugs need proof)

**Required steps:**
1. Navigate: `http://localhost:3001/[page]`
2. Screenshot BEFORE
3. Make changes
4. Screenshot AFTER
5. Check console errors
6. Test light + dark mode
7. Show user: "Does this match?"

---

## Next Step

Now read `CONSTRAINTS_TECHNICAL.md` to learn about fragile areas (globals.css, React-Leaflet, etc.).
```
