# AdSense Evidence Folder

Use this folder for persistent monetization evidence artifacts so future agents do not depend on chat-only screenshots.

## Required artifacts

1. AdSense site status screenshots (Needs Attention / Ready / Approved).
2. AdSense rejection emails/screenshots with visible timestamp and reason text.
3. Ad Manager domain decline artifact (if applicable).
4. Route audit snapshots proving status/canonical/noindex checks.

## Current artifacts

- `2026-02-13-route-snapshot.json` — live production route snapshot used to validate canonical/noindex status.
- `2026-02-13-sku-route-snapshot.json` — live production snapshot for 5 representative `/sku/[sku]` routes (200, self-canonical, `noindex, follow`).
- `2026-02-12-needs-attention-policy-violations.md` — transcription of founder-provided AdSense "Needs attention" screenshot.
- `2026-02-13-monumetric-email-ocr-extract.md` — OCR extract of timeline-critical lines from the Monumetric email thread PDF.
- `2026-02-13-policy-route-audit.md` — page-level policy-risk audit across required AdSense remediation routes (includes post-remediation pass notes).

## Pending import

- Optional binary archival: if screenshot image file becomes available later, store as `2026-02-12-needs-attention-policy-violations.png` alongside the transcription.
