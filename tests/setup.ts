/**
 * Test setup file to mock server-only package.
 *
 * The server-only package throws when imported in non-React-Server-Component contexts.
 * Since tests run in Node.js (not RSC), we need to mock it globally.
 *
 * This file is loaded via tsx --import before test execution.
 */

import Module from "node:module"

const originalRequire = Module.prototype.require

Module.prototype.require = function (id: string) {
  if (id === "server-only") {
    // Return empty object instead of throwing
    return {}
  }
  // eslint-disable-next-line prefer-rest-params
  return originalRequire.apply(this, arguments as any)
}
