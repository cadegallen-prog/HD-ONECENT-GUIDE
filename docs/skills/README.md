# Skills Index

Short, task-focused guides to avoid repo-wide searching.

**How to use this (for you, Cade):**

- You do **not** need to remember skill names.
- Default request opener:
  - **"Read `docs/skills/README.md` first. Choose and run the right skills automatically. Do the work end-to-end and verify before reporting back."**
- If the skill doesn’t exist yet, ask the agent to **add a short new skill after finishing the task** so future sessions get faster.
- Keep `docs/FOUNDER-COMMAND-CENTER.md` open for a plain-English decision tree + copy/paste prompt bank.

## Skills

- [supabase-penny-identity-upsert](./supabase-penny-identity-upsert.md) — **When to use:** Penny List rows split across SO SKU vs regular SKU, report counts look wrong, or manual upsert behavior is confusing.

- [solo-dev-ads-approval-triage](./solo-dev-ads-approval-triage.md) — **When to use:** You want a low-stress, repeatable triage flow after AdSense/Ad Manager approval rejections.
- [legal-sitemap-trust-pages](./legal-sitemap-trust-pages.md) — **When to use:** You need a complete sitemap + legal/trust page package (URL architecture, nav placement, draft policy copy, and CCPA/CPRA choices route).
- [repo-map](./repo-map.md) — **When to use:** You’re unsure where things live (pages, data, scripts, tests).
- [adsense-domain-email-setup](./adsense-domain-email-setup.md) — **When to use:** You need a professional domain email plus an AdSense reviewer checklist.
- [ads-txt-update](./ads-txt-update.md) — **When to use:** You need to append or remove ad network blocks in `public/ads.txt` safely.
- [adsense-low-value-content-audit](./adsense-low-value-content-audit.md) — **When to use:** AdSense is rejecting for “low value content” and you need a repeatable audit for `/sku/[sku]` pages (images, content volume, Googlebot render, CSP).
- [feature-to-files](./feature-to-files.md) — **When to use:** You know the feature but not the exact starting files.
- [local-dev-faststart](./local-dev-faststart.md) — **When to use:** You need to run the site locally or debug a dev server issue.
- [backfill-homedepot-enrichment-json](./backfill-homedepot-enrichment-json.md) — **When to use:** You have a HomeDepot.com scrape JSON and want to refresh Penny List enrichment fields only (including retail price).
- [run-local-staging-warmer](./run-local-staging-warmer.md) — **When to use:** GitHub Actions is blocked (Cloudflare) and you need to refresh `enrichment_staging` from your home IP.
- [ship-safely](./ship-safely.md) — **When to use:** You’re getting ready to commit, verify, or roll back safely.
- [single-writer-lock](./single-writer-lock.md) — **When to use:** More than one agent/session may be active and you need conflict-safe shared-memory updates while keeping parallel feature work.
- [codex-mcp-setup](./codex-mcp-setup.md) — **When to use:** Codex can’t see MCP tools/data or env vars, or you need to update Codex.
- [google-ga4-gsc-local-archive](./google-ga4-gsc-local-archive.md) — **When to use:** You need repeatable, additive local snapshots from GA4 + GSC for trend analysis and optimization decisions.
- [archive-first-prune](./archive-first-prune.md) — **When to use:** You need to reduce AI/doc/script bloat safely by archiving legacy files with restore manifests instead of deleting.
- [stash-hygiene](./stash-hygiene.md) — **When to use:** Stashes/untracked junk are creating invisible state that confuses agents; bundle+drop to keep `git stash list` near-zero.
- [task-completion-handoff](./task-completion-handoff.md) — **When to use:** You want strict closeout behavior (verify + memory updates + next-agent handoff) so context persists across windows.
- [memory-integrity-trend-reporting](./memory-integrity-trend-reporting.md) — **When to use:** You need a weekly fail-closed readout of checkpoint pass-rate + memory integrity score trends for autonomy hardening.
- [plan-canonicality](./plan-canonicality.md) — **When to use:** A plan exists in tool-local locations (like `.claude/plans`) and you need one repo-canonical source of truth in `.ai/impl/`.
- [ux-loop-improvement](./ux-loop-improvement.md) — **When to use:** You want to improve the core user loop (`/penny-list` -> `/sku/[sku]` -> `/report-find`) without scope creep.
- [ui-refinement-aaa](./ui-refinement-aaa.md) — **When to use:** You need UI polish/hierarchy/interaction cleanup while staying inside token-based AAA standards.
- [writing-clarity-grammar](./writing-clarity-grammar.md) — **When to use:** You need plain-English rewrite quality, grammar cleanup, and trust-safe copy.
- [presentation-polish](./presentation-polish.md) — **When to use:** You need better structure and scanability for long pages (guide/faq/transparency/legal).
- [privacy-compliance-ad-readiness](./privacy-compliance-ad-readiness.md) — **When to use:** You need trust/legal/compliance checks and ad-network readiness hardening.
- [legal-monetization-copy-guard](./legal-monetization-copy-guard.md) — **When to use:** Monetization channels changed (added/paused/retired) and legal/disclosure copy must match live reality with no stale claims.
- [color-typography-aaa](./color-typography-aaa.md) — **When to use:** You need color/typography consistency and contrast-safe token enforcement.
