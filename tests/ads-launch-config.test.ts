import assert from "node:assert"
import test from "node:test"

import {
  getMonumetricSlotDomId,
  getLaunchInventoryForRoute,
  getRouteRequeueSlotIds,
  MONUMETRIC_IN_CONTENT_SLOT_ID,
  MONUMETRIC_LAUNCH_CONFIG,
  PENNY_LIST_PROMPTS_TO_PAUSE,
  shouldPausePennyListPromptStack,
} from "../lib/ads/launch-config"

test("pauses penny-list prompt stack when sticky test is active on mobile", () => {
  assert.strictEqual(
    shouldPausePennyListPromptStack({
      stickyTestEnabled: true,
      isMobile: true,
    }),
    true
  )
})

test("does not pause penny-list prompt stack on desktop", () => {
  assert.strictEqual(
    shouldPausePennyListPromptStack({
      stickyTestEnabled: true,
      isMobile: false,
    }),
    false
  )
})

test("does not pause penny-list prompt stack when sticky test is off", () => {
  assert.strictEqual(
    shouldPausePennyListPromptStack({
      stickyTestEnabled: false,
      isMobile: true,
    }),
    false
  )
})

test("launch config keeps sticky test prompt pause list stable", () => {
  assert.deepStrictEqual(PENNY_LIST_PROMPTS_TO_PAUSE, [
    "PWAInstallPrompt",
    "EmailSignupForm",
    "PennyListPageBookmarkBanner",
  ])
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.placement.mode, "provider-managed")
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.placement.hardExclusionsOnly, true)
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.sticky.enabled, false)
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.sticky.route, "/penny-list")
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.sticky.size, "320x50")
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.interstitial.enabled, false)
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.volt.enabled, false)
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.routeRequeue.enabled, true)
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.routeRequeue.debounceMs, 120)
  assert.strictEqual(MONUMETRIC_LAUNCH_CONFIG.experimentalSpa.enabled, false)
})

test("provider-managed mode resolves generic inventory marker", () => {
  assert.deepStrictEqual(getLaunchInventoryForRoute("/guide"), ["provider_managed"])
  assert.deepStrictEqual(getLaunchInventoryForRoute("/penny-list"), ["provider_managed"])
})

test("route requeue slot IDs only apply to guide surfaces", () => {
  assert.deepStrictEqual(getRouteRequeueSlotIds("/guide"), [MONUMETRIC_IN_CONTENT_SLOT_ID])
  assert.deepStrictEqual(getRouteRequeueSlotIds("/what-are-pennies"), [
    MONUMETRIC_IN_CONTENT_SLOT_ID,
  ])
  assert.deepStrictEqual(getRouteRequeueSlotIds("/penny-list"), [])
})

test("slot dom id helper keeps prefix contract stable", () => {
  assert.strictEqual(
    getMonumetricSlotDomId(MONUMETRIC_IN_CONTENT_SLOT_ID),
    `mmt-${MONUMETRIC_IN_CONTENT_SLOT_ID}`
  )
})
