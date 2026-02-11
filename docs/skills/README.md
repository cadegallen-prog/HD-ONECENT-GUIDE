# Skills Index

Short, task-focused guides to avoid repo-wide searching.

**How to use this (for you, Cade):**

- When you start a new request, tell the agent: **"Read `docs/skills/README.md` first and follow the relevant skill."**
- If the skill doesn’t exist yet, ask the agent to **add a short new skill after finishing the task** so future sessions get faster.

## Skills

- [repo-map](./repo-map.md) — **When to use:** You’re unsure where things live (pages, data, scripts, tests).
- [adsense-domain-email-setup](./adsense-domain-email-setup.md) — **When to use:** You need a professional domain email plus an AdSense reviewer checklist.
- [ads-txt-update](./ads-txt-update.md) — **When to use:** You need to append or remove ad network blocks in `public/ads.txt` safely.
- [adsense-low-value-content-audit](./adsense-low-value-content-audit.md) — **When to use:** AdSense is rejecting for “low value content” and you need a repeatable audit for `/sku/[sku]` pages (images, content volume, Googlebot render, CSP).
- [feature-to-files](./feature-to-files.md) — **When to use:** You know the feature but not the exact starting files.
- [local-dev-faststart](./local-dev-faststart.md) — **When to use:** You need to run the site locally or debug a dev server issue.
- [backfill-homedepot-enrichment-json](./backfill-homedepot-enrichment-json.md) — **When to use:** You have a HomeDepot.com scrape JSON and want to refresh Penny List enrichment fields only (including retail price).
- [run-local-staging-warmer](./run-local-staging-warmer.md) — **When to use:** GitHub Actions is blocked (Cloudflare) and you need to refresh `enrichment_staging` from your home IP.
- [ship-safely](./ship-safely.md) — **When to use:** You’re getting ready to commit, verify, or roll back safely.
- [codex-mcp-setup](./codex-mcp-setup.md) — **When to use:** Codex can’t see MCP tools/data or env vars, or you need to update Codex.
- [archive-first-prune](./archive-first-prune.md) — **When to use:** You need to reduce AI/doc/script bloat safely by archiving legacy files with restore manifests instead of deleting.
- [stash-hygiene](./stash-hygiene.md) — **When to use:** Stashes/untracked junk are creating invisible state that confuses agents; bundle+drop to keep `git stash list` near-zero.
- [task-completion-handoff](./task-completion-handoff.md) — **When to use:** You want strict closeout behavior (verify + memory updates + next-agent handoff) so context persists across windows.
- [plan-canonicality](./plan-canonicality.md) — **When to use:** A plan exists in tool-local locations (like `.claude/plans`) and you need one repo-canonical source of truth in `.ai/impl/`.
