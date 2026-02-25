# Visual Pointing Tool v1 (Two-Route Pilot) Plan (Canonical)

**Status:** Implemented (all 6 slices complete, verified)  
**Owner:** AI agents (implementation), Cade (scope and rollout approval)  
**Last updated:** 2026-02-22  
**Canonical file:** `.ai/impl/visual-pointing-tool.md`

---

## Objective

Bridge non-technical UX feedback into precise, implementable element references for localhost work on port `3001`.

---

## Success Criteria (Done Means)

1. Founder can enable Feedback Mode and capture targets on `/penny-list` and `/store-finder`.
2. Every capture includes a non-empty `primarySelector` plus ranked fallback selectors.
3. Anchored targets return component + file + line metadata; unanchored targets return explicit `source_unavailable`.
4. Capture packets can be copied for AI chat and optionally persisted as local JSON artifacts.
5. Playwright replay can re-locate captured targets from an artifact and output proof screenshots.
6. Mobile-first behavior is verified at `375x667` and `390x844`.

---

## Locked Product Decisions

1. Capture surface: in-app overlay (dev-only).
2. Source precision: best-effort via stable IDs + explicit source registry.
3. Initial scope: two-route pilot only (`/penny-list`, `/store-finder`).
4. Traffic weighting: mobile-first behavior and test coverage are mandatory.

---

## Scope

### In scope

1. Dev-only feedback overlay and capture flow.
2. Selector fingerprint engine and source anchor registry.
3. Two-route anchor instrumentation.
4. Dev-only artifact persistence API.
5. Playwright replay/proof script.
6. Unit and Playwright coverage for capture + replay.

### Out of scope

1. Browser extension.
2. Production/public feedback widget.
3. Auto-created GitHub issues.
4. Sitewide anchor rollout beyond pilot routes.

---

## Runtime Model

1. A dev-only client shell mounts from `layout.tsx`.
2. Founder enables capture mode via floating toggle.
3. Next tap/click captures one target and suppresses that navigation event.
4. Capture engine builds selector bundle and source metadata packet.
5. Drawer shows packet preview with:
   - copy for AI,
   - save local artifact.
6. Optional `POST` writes JSON under `reports/visual-pointing/...`.
7. Replay script consumes artifact, re-locates target, and writes proof screenshots.

Playwright is the replay/proof layer, not the primary capture UI.

---

## Core Modules

| Module                                       | Responsibility                                             |
| -------------------------------------------- | ---------------------------------------------------------- |
| `visual-pointer-toggle.tsx`                  | Dev-only floating toggle + armed/disarmed state            |
| `visual-pointer-overlay.tsx`                 | Hover highlight + click/tap capture + one-interaction lock |
| `visual-pointer-drawer.tsx`                  | Packet preview + copy + save actions                       |
| `selector-fingerprint.ts`                    | Ranked selector generation + confidence assignment         |
| `source-registry.ts`                         | `pcId -> component/file/line` mapping                      |
| `types.ts`                                   | Shared contracts                                           |
| `app/api/dev/visual-pointer/report/route.ts` | Dev-only artifact writer                                   |
| `scripts/visual-pointer-proof.ts`            | Playwright replay + screenshot proof                       |

---

## Interface Contracts

### `data-pc-id` naming convention

Format: `"<route>.<surface>.<element>"`

Examples:

- `penny-list.search-input`
- `penny-list.report-cta`
- `store-finder.search-input`
- `store-finder.popup-directions`

### Shared types

```ts
export type SelectorStrategy = "data-pc-id" | "data-testid" | "aria-role-name" | "text" | "css-path"

export interface SelectorCandidate {
  strategy: SelectorStrategy
  selector: string
  confidence: "high" | "medium" | "low"
}

export interface SourceAnchorMeta {
  pcId: string
  route: string
  component: string
  file: string
  line: number
  column?: number
}

export interface VisualPointerCapture {
  captureId: string
  capturedAt: string
  url: string
  pathname: string
  query: string
  viewportWidth: number
  viewportHeight: number
  dpr: number
  theme: "light" | "dark" | "unknown"
  targetTag: string
  targetTextSnippet: string
  targetRole: string | null
  targetLabel: string | null
  primarySelector: string
  selectorCandidates: SelectorCandidate[]
  pcId: string | null
  source: SourceAnchorMeta | "source_unavailable"
}
```

---

## API Contract

**Route:** `POST /api/dev/visual-pointer/report`

Request:

```json
{
  "capture": { "...VisualPointerCapture..." },
  "note": "optional founder note"
}
```

Response:

```json
{
  "ok": true,
  "artifactPath": "reports/visual-pointing/2026-02-22T22-10-35/capture.json"
}
```

### API guardrails

1. Return `403` when `NODE_ENV !== "development"`.
2. Return `400` for invalid payload schema.
3. Sanitize capture text fields and cap snippet lengths.
4. Write only under `reports/visual-pointing/`.

---

## Selector Ranking Algorithm

Ranking order:

1. Nearest ancestor selector using `[data-pc-id]`.
2. `[data-testid]`.
3. Role/name selector (ARIA + semantic attributes).
4. Text selector (trimmed, normalized, length-capped).
5. Structural CSS path fallback (minimal `:nth-of-type` usage).

`primarySelector` is the highest-confidence candidate in this chain.

---

## Pilot Anchor Inventory

### `/store-finder`

- `store-finder.search-input`
- `store-finder.search-submit`
- `store-finder.locate-recenter`
- `store-finder.view-map`
- `store-finder.view-list`
- `store-finder.list-item`
- `store-finder.popup-directions`
- `store-finder.popup-store-page`

### `/penny-list`

- `penny-list.search-input`
- `penny-list.state-filter`
- `penny-list.sort-trigger`
- `penny-list.report-cta`
- `penny-list.pagination-prev`
- `penny-list.pagination-next`
- `penny-list.card-sku`
- `penny-list.card-report-action`

---

## Implementation Slices (One User Outcome Per Slice)

Stop/go checkpoint is mandatory after each slice.

| Slice                        | Depends on | User outcome                                          | Files                                                                                            | Acceptance criteria                                                                   | Rollback                                             | Verification lane                                                  |
| ---------------------------- | ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| S1 Foundation                | none       | Dev-only toggle can arm/disarm capture mode           | `layout.tsx`, `visual-pointer-toggle.tsx`                                                        | Toggle visible only in dev; no UI impact when disabled                                | Remove mount from layout                             | `verify:fast`; `e2e:smoke`; FULL expected due `layout.tsx`         |
| S2 Capture Engine            | S1         | Click/tap capture returns selector bundle and preview | `visual-pointer-overlay.tsx`, `visual-pointer-drawer.tsx`, `selector-fingerprint.ts`, `types.ts` | Non-empty `primarySelector` + candidate list returned                                 | Disable overlay import path                          | `verify:fast`; targeted Playwright capture spec (desktop + mobile) |
| S3 Source Mapping            | S2         | Anchored captures resolve to file/line metadata       | `source-registry.ts`, pilot route components                                                     | Anchored capture includes component/file/line; unanchored explicitly returns fallback | Keep packet, mark source unavailable globally        | `verify:fast`; registry unit tests                                 |
| S4 Artifact Persistence      | S2         | Founder can save local JSON handoff artifact          | `app/api/dev/visual-pointer/report/route.ts`                                                     | Dev writes JSON and returns artifact path; non-dev blocked                            | Remove save API and keep copy-only mode              | `verify:fast`; route-level smoke                                   |
| S5 Two-Route Instrumentation | S3         | Reliable anchor coverage on pilot routes              | `penny-list-client.tsx`, `app/store-finder/page.tsx`, `store-map.tsx`                            | All pilot anchors present and capturable                                              | Remove added `data-pc-id` attrs and registry entries | `verify:fast`; `e2e:smoke`; Playwright route specs                 |
| S6 Replay Proof              | S4, S5     | Artifact replay produces screenshot proof             | `scripts/visual-pointer-proof.ts`, `package.json`, `tests/visual-pointer-capture.spec.ts`        | Script resolves selector from artifact and writes proof screenshots + summary         | Remove script and use manual reproduction            | `verify:fast`; targeted replay run                                 |

---

## File-Level Change Plan

| File                                         | Planned change                                               |
| -------------------------------------------- | ------------------------------------------------------------ |
| `app/layout.tsx`                             | Mount dev-only visual pointer shell under existing providers |
| `components/dev/visual-pointer-toggle.tsx`   | Floating enable/disable control with mobile-safe hit target  |
| `components/dev/visual-pointer-overlay.tsx`  | Capture listener, hover outline, one-tap capture semantics   |
| `components/dev/visual-pointer-drawer.tsx`   | JSON preview, copy action, save action                       |
| `lib/visual-pointer/types.ts`                | Shared packet/selector/source types                          |
| `lib/visual-pointer/selector-fingerprint.ts` | Candidate generation + confidence scoring                    |
| `lib/visual-pointer/source-registry.ts`      | Explicit `pcId` to component/file/line mapping               |
| `app/api/dev/visual-pointer/report/route.ts` | Dev-only artifact writer                                     |
| `scripts/visual-pointer-proof.ts`            | Replay artifact + screenshot output                          |
| `package.json`                               | Add visual-pointer scripts                                   |
| `components/penny-list-client.tsx`           | Add pilot route `data-pc-id` anchors                         |
| `app/store-finder/page.tsx`                  | Add pilot route `data-pc-id` anchors                         |
| `components/store-map.tsx`                   | Add popup action anchors                                     |

---

## Test Coverage Plan

### Unit tests

1. Selector ranking prefers `data-pc-id` over weaker strategies.
2. Fallback chain works when anchors are absent.
3. Source registry lookup returns correct metadata for known IDs.
4. Text sanitization truncates and redacts unsafe payload fields.

### Playwright scenarios

1. `/penny-list` mobile capture on search input returns anchored `pcId`.
2. `/penny-list` capture on unanchored text block returns selector-only packet.
3. `/store-finder` capture on popup directions button returns anchored packet.
4. Capture mode suppresses navigation for the capture tap.
5. Dev artifact API returns path and writes JSON in development.
6. Replay script re-locates target and writes proof screenshot.
7. Overlay controls remain usable with touch targets `>=44x44` on mobile.

### Verification commands

```bash
npm run verify:fast
npm run e2e:smoke
npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-mobile-light --workers=1
npx playwright test tests/visual-pointer-capture.spec.ts --project=chromium-desktop-light --workers=1
npm run visual-pointer:proof -- --artifact <artifact-path>
```

---

## Rollout Plan

1. Ship pilot on `/penny-list` and `/store-finder`.
2. Collect founder usage for one week.
3. Expand anchor registry route-by-route based on feedback volume.
4. Keep production disabled by default unless explicitly approved later.

---

## Risks and Mitigations

| Risk                                          | Mitigation                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| Source file/line drift after refactors        | Keep explicit source registry and validate via unit tests                  |
| Leaflet internals are hard to anchor reliably | Anchor actionable popup controls and list items, not raw map SVG internals |
| Overlay interferes with normal interactions   | One-tap capture mode with auto-disarm after capture                        |
| Sensitive text leakage in packet              | Sanitize snippets and cap lengths before copy/save                         |

---

## Assumptions

1. Implementation branch is `dev`.
2. No new dependencies unless blocker is discovered and approved.
3. Artifact storage remains local and dev-only under `reports/`.
4. Capture UX prioritizes mobile because traffic is mobile-heavy.

---

## Glossary

- **Overlay:** temporary UI layer above the page used for capture interactions.
- **Selector:** rule string used to identify one DOM element.
- **Anchor (`data-pc-id`):** stable ID applied to important targets for reliable mapping.
- **Replay:** automated re-location of a captured target to validate selector resilience.
- **Artifact:** saved JSON/screenshot output used for handoff and proof.
