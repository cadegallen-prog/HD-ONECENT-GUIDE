import assert from "node:assert"
import test from "node:test"

import {
  isProductionDeployment,
  isVisualPointerEnvironmentEnabled,
} from "../lib/visual-pointer/env"

function withEnv(overrides: Record<string, string | undefined>, run: () => void) {
  const previous = new Map<string, string | undefined>()
  for (const key of Object.keys(overrides)) {
    previous.set(key, process.env[key])
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }

  try {
    run()
  } finally {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
  }
}

test("visual pointer is disabled by default in production deployment", () => {
  withEnv(
    {
      VERCEL_ENV: "production",
      NEXT_PUBLIC_VERCEL_ENV: "production",
      NODE_ENV: "production",
      NEXT_PUBLIC_VISUAL_POINTER_ENABLED: undefined,
    },
    () => {
      assert.strictEqual(isProductionDeployment(), true)
      assert.strictEqual(isVisualPointerEnvironmentEnabled(), false)
    }
  )
})

test("visual pointer is enabled by default in preview deployment", () => {
  withEnv(
    {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_VERCEL_ENV: "preview",
      NODE_ENV: "production",
      NEXT_PUBLIC_VISUAL_POINTER_ENABLED: undefined,
    },
    () => {
      assert.strictEqual(isProductionDeployment(), false)
      assert.strictEqual(isVisualPointerEnvironmentEnabled(), true)
    }
  )
})

test("visual pointer is enabled by default in local development", () => {
  withEnv(
    {
      VERCEL_ENV: undefined,
      NEXT_PUBLIC_VERCEL_ENV: undefined,
      NODE_ENV: "development",
      NEXT_PUBLIC_VISUAL_POINTER_ENABLED: undefined,
    },
    () => {
      assert.strictEqual(isProductionDeployment(), false)
      assert.strictEqual(isVisualPointerEnvironmentEnabled(), true)
    }
  )
})

test("visual pointer env override can force-disable in non-production", () => {
  withEnv(
    {
      VERCEL_ENV: "preview",
      NEXT_PUBLIC_VERCEL_ENV: "preview",
      NODE_ENV: "production",
      NEXT_PUBLIC_VISUAL_POINTER_ENABLED: "false",
    },
    () => {
      assert.strictEqual(isVisualPointerEnvironmentEnabled(), false)
    }
  )
})
