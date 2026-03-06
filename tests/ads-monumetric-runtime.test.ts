import assert from "node:assert"
import test from "node:test"

import {
  getViewportBandForWidth,
  refreshMonumetricRuntimeOnce,
} from "../lib/ads/monumetric-runtime"

function withWindow(windowValue: unknown, run: () => void) {
  const originalWindow = (globalThis as { window?: unknown }).window
  ;(globalThis as { window?: unknown }).window = windowValue

  try {
    run()
  } finally {
    if (typeof originalWindow === "undefined") {
      delete (globalThis as { window?: unknown }).window
    } else {
      ;(globalThis as { window?: unknown }).window = originalWindow
    }
  }
}

test("viewport band helper maps width ranges to mobile/tablet/desktop", () => {
  assert.strictEqual(getViewportBandForWidth(320), "mobile")
  assert.strictEqual(getViewportBandForWidth(767), "mobile")
  assert.strictEqual(getViewportBandForWidth(768), "tablet")
  assert.strictEqual(getViewportBandForWidth(1023), "tablet")
  assert.strictEqual(getViewportBandForWidth(1024), "desktop")
})

test("runtime refresh returns false when window is unavailable", () => {
  withWindow(undefined, () => {
    assert.strictEqual(refreshMonumetricRuntimeOnce(), false)
  })
})

test("runtime refresh initializes $MMT and cmd when runtime is missing", () => {
  withWindow({}, () => {
    assert.strictEqual(refreshMonumetricRuntimeOnce(), false)

    const runtime = (globalThis as { window?: { $MMT?: { cmd?: unknown[] } } }).window?.$MMT ?? null
    assert.ok(runtime)
    assert.ok(Array.isArray(runtime.cmd))
  })
})

test("runtime refresh calls setNumMonuAdUnits and refreshOnce when available", () => {
  let setNumCalls = 0
  let refreshCalls = 0

  withWindow(
    {
      $MMT: {
        setNumMonuAdUnits: () => {
          setNumCalls += 1
        },
        refreshOnce: () => {
          refreshCalls += 1
        },
      },
    },
    () => {
      assert.strictEqual(refreshMonumetricRuntimeOnce(), true)
      assert.strictEqual(setNumCalls, 1)
      assert.strictEqual(refreshCalls, 1)
    }
  )
})

test("runtime refresh fails closed when refreshOnce throws", () => {
  let setNumCalls = 0

  withWindow(
    {
      $MMT: {
        setNumMonuAdUnits: () => {
          setNumCalls += 1
        },
        refreshOnce: () => {
          throw new Error("simulated refresh failure")
        },
      },
    },
    () => {
      assert.strictEqual(refreshMonumetricRuntimeOnce(), false)
      assert.strictEqual(setNumCalls, 1)
    }
  )
})
