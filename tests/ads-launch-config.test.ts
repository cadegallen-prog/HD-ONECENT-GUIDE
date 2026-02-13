import assert from "node:assert"
import test from "node:test"

import {
  getLaunchInventoryForRoute,
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
})

test("provider-managed mode resolves generic inventory marker", () => {
  assert.deepStrictEqual(getLaunchInventoryForRoute("/guide"), ["provider_managed"])
  assert.deepStrictEqual(getLaunchInventoryForRoute("/penny-list"), ["provider_managed"])
})
