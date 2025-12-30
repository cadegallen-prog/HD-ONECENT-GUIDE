import { config } from "dotenv"
import Module from "node:module"

config({ path: ".env.local", override: false })

/**
 * Test setup file to mock server-only package.
 *
 * This file is loaded via tsx --import before test execution.
 */

const originalRequire = Module.prototype.require

Module.prototype.require = function (id: string) {
  if (id === "server-only") {
    // Return empty object instead of throwing
    return {}
  }
  // eslint-disable-next-line prefer-rest-params
  return originalRequire.apply(this, arguments as any)
}
