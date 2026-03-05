"use client"

import {
  getMonumetricSlotDomId,
  getMonumetricSlotPolicy,
  MONUMETRIC_IN_CONTENT_SLOT_ID,
  MONUMETRIC_LAUNCH_CONFIG,
} from "@/lib/ads/launch-config"
import { MonumetricSlotShell } from "@/lib/ads/monumetric-slot-shell"

const MONUMETRIC_ENABLED = process.env.NEXT_PUBLIC_MONUMETRIC_ENABLED === "true"
const FALLBACK_MIN_HEIGHT_PX = 250
const FALLBACK_COLLAPSE_AFTER_MS = 7000

interface MonumetricInContentSlotProps {
  slotId?: string
  slotKey?: string
  className?: string
  containerClassName?: string
}

function toToken(value: string): string {
  return value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function buildMonumetricInContentScript(slotId: string): string {
  return `
window.$MMT = window.$MMT || {};
window.$MMT.cmd = window.$MMT.cmd || [];
window.$MMT.cmd.push(function () {
  window.$MMT.display = window.$MMT.display || {};
  window.$MMT.display.slots = window.$MMT.display.slots || [];
  window.$MMT.display.slots.push(["${slotId}"]);
});
`.trim()
}

export function MonumetricInContentSlot({
  slotId = MONUMETRIC_IN_CONTENT_SLOT_ID,
  slotKey,
  className,
  containerClassName = "min-h-[250px]",
}: MonumetricInContentSlotProps = {}) {
  if (!MONUMETRIC_ENABLED) return null

  const slotDomId = getMonumetricSlotDomId(slotId)
  const slotPolicy = getMonumetricSlotPolicy(slotId)
  const reserveMinHeightPx = slotPolicy?.reserveMinHeightPx ?? FALLBACK_MIN_HEIGHT_PX
  const collapseAfterMs = slotPolicy?.collapseAfterMs ?? FALLBACK_COLLAPSE_AFTER_MS
  const token = toToken(slotKey ?? slotId)
  const scriptId = `pc-monumetric-in-content-${token}`

  return (
    <MonumetricSlotShell
      enabled={MONUMETRIC_ENABLED}
      slotId={`monumetric-in-content-${token}`}
      slotDomId={slotDomId}
      reserveMinHeightPx={reserveMinHeightPx}
      collapseAfterMs={collapseAfterMs}
      collapseEnabled={MONUMETRIC_LAUNCH_CONFIG.slotShell.collapseEmptyEnabled}
      className={className}
      containerClassName={containerClassName}
    >
      <script
        id={scriptId}
        type="text/javascript"
        data-cfasync="false"
        dangerouslySetInnerHTML={{ __html: buildMonumetricInContentScript(slotId) }}
      />
    </MonumetricSlotShell>
  )
}
