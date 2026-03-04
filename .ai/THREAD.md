# Current Thread (Agent Continuity)

**Purpose:** This file carries the _reasoning chain_ forward between sessions. Not what happened (that's SESSION*LOG), not what's next (that's BACKLOG), but \_why we're doing what we're doing and how each piece connects to the last.*

**Rule:** Every agent — Claude, Codex, Copilot — must read this file at session start and update it at session end. If you don't update this file, the next agent starts disconnected. That wastes everything you just did.

**Last updated:** 2026-03-04 by GitHub Copilot (GPT-5.3-Codex)

---

## The Active Thread

### What we're building toward (near-term)

The product thread is still the same: make PennyCentral more trustworthy and easier to use so the core loop compounds (`/penny-list` habit → submit finds → better data → stronger trust).

Two active tracks now matter in parallel:

1. **Site Recovery Program** (`.ai/impl/site-recovery-program.md`) continues, with `S3 - Guide Core Rebuild` as the next major product slice.
2. **Manual data pipeline hardening** is now explicit and split into two workflows so founder operations do not accidentally consume SerpAPI credits or create malformed rows.

Manual workflow split (now canonical):

- `manual:enrich` = enrich existing Penny List rows only (no row creation)
- `manual:cade-fast-track` = founder direct submit path (Item Cache upsert + Penny List create + apply enrichment), designed to avoid scrape-credit spend for pre-scraped payloads

### Where we just were

The immediate operational issue was data-path confusion: manual enrichment logic had drifted into row-creation behavior, which broke founder expectations and created non-standard entries (for example, `store_city_state="Manual Add"` instead of `Georgia` in a founder-owned context).

In this session chain, we:

- fixed the DAP manual-created row state to `Georgia`
- repaired `manual:cade-fast-track` parsing + SKU validation contract so founder keyed JSON payloads process correctly
- successfully submitted a founder payload through fast-track with no SerpAPI path involved
- updated founder and engineering docs so the workflow split is explicit and repeatable

The key reasoning update: **manual enrichment and founder submission are different jobs and must stay separate by design.**

### Where the next link goes

Next sessions should prioritize:

1. **Keep manual workflow boundaries strict.**
   - Use `manual:enrich` only when Penny List rows already exist.
   - Use `manual:cade-fast-track` for founder direct submissions from pre-scraped payloads.
2. **Continue Site Recovery at `S3 - Guide Core Rebuild`** once current branch hygiene is clean.
3. **Preserve no-credit founder path** when Cade already has scraped item payloads; do not route those through scrape fallback.

The thread connection: reducing founder operational friction and preserving scrape budget directly supports the same trust/quality goals as the recovery program.

### What the agent must understand before working

**Surface briefs still apply.** Before modifying any user-facing surface, read its brief in `.ai/SURFACE_BRIEFS.md`. The brief tells you:

- What job this surface does for the user
- What success looks like (with metrics where available)
- What would make it worse
- Current baseline performance

If you make a change that doesn't serve the surface's stated job, or if you can't articulate _why_ your change makes the surface better at its job, stop and reconsider. "Tests pass" is not the same as "this is an improvement."

**Manual workflow contract is now part of continuity.** Future agents should not assume `/manual` is allowed to create Penny List rows. Creation is founder-only fast-track behavior via `/manual:cade` / `manual:cade-fast-track`.

---

## How to Update This File

At the end of your session, rewrite the sections above to reflect the new state. Be specific:

- **"What we're building toward"** — only update if the direction changed
- **"Where we just were"** — describe the reasoning behind what you did, not just what you did. What hypothesis were you working under? What did you learn?
- **"Where the next link goes"** — what should the next session accomplish, and _why_ does it matter in the chain?
- **"What the agent must understand"** — add anything the next agent needs to know that isn't obvious from the code

**Do not** append to this file. Rewrite the active sections so they stay current. This is a living document, not a log.

**Do not** rush this update. The 5 minutes you spend writing a thoughtful thread saves the next agent 30 minutes of re-discovery and prevents disconnected work.
