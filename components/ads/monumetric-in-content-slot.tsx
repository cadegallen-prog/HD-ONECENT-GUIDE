"use client"

import {
  getMonumetricSlotDomId,
  getMonumetricSlotPolicy,
  MONUMETRIC_IN_CONTENT_SLOT_ID,
  MONUMETRIC_LAUNCH_CONFIG,
} from "@/lib/ads/launch-config"
import { MonumetricSlotShell } from "@/lib/ads/monumetric-slot-shell"

const MONUMETRIC_IN_CONTENT_DOM_ID = getMonumetricSlotDomId(MONUMETRIC_IN_CONTENT_SLOT_ID)
const MONUMETRIC_ENABLED = process.env.NEXT_PUBLIC_MONUMETRIC_ENABLED === "true"
const IN_CONTENT_SLOT_POLICY = getMonumetricSlotPolicy(MONUMETRIC_IN_CONTENT_SLOT_ID)
const FALLBACK_MIN_HEIGHT_PX = 250
const FALLBACK_COLLAPSE_AFTER_MS = 7000

const MONUMETRIC_IN_CONTENT_SCRIPT = `
window.$MMT = window.$MMT || {};
window.$MMT.cmd = window.$MMT.cmd || [];
window.$MMT.cmd.push(function () {
  window.$MMT.display = window.$MMT.display || {};
  window.$MMT.display.slots = window.$MMT.display.slots || [];
  window.$MMT.display.slots.push(["${MONUMETRIC_IN_CONTENT_SLOT_ID}"]);
});
`.trim()

export function MonumetricInContentSlot() {
  if (!MONUMETRIC_ENABLED) return null

  const reserveMinHeightPx = IN_CONTENT_SLOT_POLICY?.reserveMinHeightPx ?? FALLBACK_MIN_HEIGHT_PX
  const collapseAfterMs = IN_CONTENT_SLOT_POLICY?.collapseAfterMs ?? FALLBACK_COLLAPSE_AFTER_MS

  return (
    <MonumetricSlotShell
      enabled={MONUMETRIC_ENABLED}
      slotId="monumetric-in-content-repeatable"
      slotDomId={MONUMETRIC_IN_CONTENT_DOM_ID}
      reserveMinHeightPx={reserveMinHeightPx}
      collapseAfterMs={collapseAfterMs}
      collapseEnabled={MONUMETRIC_LAUNCH_CONFIG.slotShell.collapseEmptyEnabled}
      containerClassName="min-h-[250px]"
    >
      <script
        id="pc-monumetric-in-content-repeatable"
        type="text/javascript"
        data-cfasync="false"
        dangerouslySetInnerHTML={{ __html: MONUMETRIC_IN_CONTENT_SCRIPT }}
      />
    </MonumetricSlotShell>
  )
}
