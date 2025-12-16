# Verification Required

**⛔ NO PROOF = NOT DONE**

## Before Claiming "Done"

**You MUST provide:**

1. **Test output** (all 4 - paste below):
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
   - `README.md`, `.ai/STATE.md`, `.ai/BACKLOG.md`, `.ai/SESSION_LOG.md`, `CHANGELOG.md`

4. **GitHub Actions** (if applicable):
   - Paste URL: `https://github.com/.../runs/{id}`
   - Status must be ✅ green

5. **Proof problem is fixed**:
   - Show bug existed
   - Show bug is gone

**No exceptions.**

---

## Port 3001 Rule

```bash
# Check if running
netstat -ano | findstr :3001

# IF RUNNING → USE IT (don't kill)
# IF NOT RUNNING → npm run dev
```

**Never kill port 3001 unless user asks.**

---

## Color Rule

**FORBIDDEN:**
- ❌ `blue-500`, `gray-600`, `bg-blue-500`
- ❌ ANY raw Tailwind color

**REQUIRED:**
- ✅ Use CSS variables: `var(--cta-primary)`, `var(--background)`
- ✅ Or get approval first

---

## Playwright (UI Changes)

**Required steps:**
1. Navigate: `http://localhost:3001/[page]`
2. Screenshot BEFORE
3. Make changes
4. Screenshot AFTER
5. Check console errors
6. Test light + dark mode
7. Show user: "Does this match?"

**When required:**
- All UI changes (buttons, forms, layouts, colors)
- All JavaScript changes (Store Finder, interactive)
- All "bug fixed" claims (visual bugs)

---

## Template: Claiming Done

```markdown
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
```

**Use this template. No shortcuts.**
