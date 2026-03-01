# GitHub Copilot — Penny Central

PennyCentral is the Home Depot penny-shopping companion for Cade, a solo founder who cannot code. Use plain English, make technical decisions explicitly, verify before claiming completion, and protect the founder from hidden risk and scope creep.

---

## Founder Context

- Cade cannot code, so explain what changed and why it matters in plain English.
- Push back if a request would break stability, skip verification, or expand scope carelessly.
- If the request is clear, implement directly. If it is ambiguous, ask one clarifying question.

---

## Non-Negotiable Rules

### 1. Verification

- `npm run verify:fast` is always required for meaningful changes.
- `npm run e2e:smoke` is required for route, form, API, navigation, or UI-flow changes.
- UI changes need Playwright screenshots and proof, not summaries.

### 2. Port 3001

- Check first: `netstat -ano | findstr :3001`
- If running, use it and do not kill it.
- Playwright runs on port `3002`.

### 3. Colors

- Never use raw Tailwind colors such as `blue-500` or `gray-600`.
- Use CSS variables only: `var(--cta-primary)`, `var(--bg-*)`, `var(--text-*)`.

### 4. Internet SKU

- `internet_sku` is backend-only.
- Never expose it in client code or UI.
- Store SKU is the display SKU; SO SKU is an alias path.

### 5. Shared Memory Safety

- `.ai/SESSION_LOG.md`, `.ai/STATE.md`, `.ai/BACKLOG.md`, and `.ai/HANDOFF.md` are shared-memory files.
- Claim the writer lock before editing them:
  - `npm run ai:writer-lock:claim -- <agent-name> "<task>"`
- Release it after updates:
  - `npm run ai:writer-lock:release -- <agent-name>`

---

## Fragile Files

Do not touch these without explicit approval:

- `app/globals.css`
- `components/store-map.tsx`
- `middleware.ts`

---

## Native Copilot Workflow

Use Copilot custom agents in VS Code from `.github/agents/` and prompt files from `.github/prompts/`.

- Supported path: native Copilot agents and prompts inside the IDE
- Unsupported path: repo-local CLI orchestration or `npm run ai:copilot*`

For small, clear tasks, the default loop is:

1. Implement
2. Verify
3. Report back with proof

For larger work, use the native agent pipeline:

- `@planner`
- `@coder`
- `@tester`
- `@reviewer`
- `@documenter`

`@orchestrator` may coordinate those agents, but it must:

- wait for approval before user-facing or structural work,
- pass exact scope to reviewer, tester, and documenter,
- avoid repo-wide review requests,
- avoid shared-memory edits unless writer-lock ownership is confirmed.

---

## Prompt Files

Use the built-in prompt files in `.github/prompts/` for repeatable workflows:

- `implement`
- `debug`
- `verify`
- `review`
- `session-end`
- `explore`

These prompts are IDE-native guidance. They are not npm commands.

---

## Git and MCP Notes

- Work on `dev`, keep changes scoped, and verify before push.
- Copilot uses the repo MCP configuration in `.vscode/mcp.json`.
- Do not claim missing CLI tools when MCP access exists.

---

## Learning Loop

When something fails:

1. Stop
2. Document the failure in `.ai/LEARNINGS.md`
3. Try a different approach
