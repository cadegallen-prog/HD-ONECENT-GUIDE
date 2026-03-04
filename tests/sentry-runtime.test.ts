import assert from "node:assert"
import test from "node:test"

import {
  FIRST_PARTY_URL_ALLOWLIST,
  getClientSentryEnvironment,
  getSentryRuntimeTag,
  getServerSentryEnvironment,
  normalizeSentryEventMessage,
  shouldDropSentryEvent,
} from "../lib/monitoring/sentry-runtime"

test("client production hostname is always tagged as production", () => {
  const environment = getClientSentryEnvironment("www.pennycentral.com", "preview", "production")
  assert.strictEqual(environment, "production")
})

test("client preview hostname stays preview outside the production domain", () => {
  const environment = getClientSentryEnvironment("hd-onecent-guide-git-test.vercel.app", undefined)
  assert.strictEqual(environment, "preview")
})

test("server environment prefers Vercel environment when present", () => {
  const environment = getServerSentryEnvironment("preview", "production")
  assert.strictEqual(environment, "preview")
})

test("runtime tag helper returns the requested runtime", () => {
  assert.strictEqual(getSentryRuntimeTag("edge"), "edge")
})

test("normalizeSentryEventMessage combines top-level, logentry, and exception messages", () => {
  const normalized = normalizeSentryEventMessage({
    message: "Top Level Message",
    logentry: { formatted: "Formatted entry" },
    exception: {
      values: [{ type: "TypeError", value: "Failed to fetch" }],
    },
  })

  assert.strictEqual(normalized, "top level message | formatted entry | typeerror: failed to fetch")
})

test("shouldDropSentryEvent drops known fetch noise", () => {
  assert.strictEqual(
    shouldDropSentryEvent({
      exception: {
        values: [{ type: "TypeError", value: "Failed to fetch" }],
      },
    }),
    true
  )
})

test("shouldDropSentryEvent drops browser-extension stack frames", () => {
  assert.strictEqual(
    shouldDropSentryEvent({
      exception: {
        values: [
          {
            stacktrace: {
              frames: [{ filename: "chrome-extension://abcdef/content.js" }],
            },
            type: "Error",
            value: "Unexpected extension error",
          },
        ],
      },
    }),
    true
  )
})

test("shouldDropSentryEvent keeps first-party application errors", () => {
  assert.strictEqual(
    shouldDropSentryEvent({
      exception: {
        values: [{ type: "ReferenceError", value: "reportCardState is not defined" }],
      },
    }),
    false
  )
})

test("client allowlist stays pinned to first-party and Next internals", () => {
  assert.strictEqual(FIRST_PARTY_URL_ALLOWLIST.length, 3)
  assert.match(String(FIRST_PARTY_URL_ALLOWLIST[0]), /pennycentral/)
  assert.match(String(FIRST_PARTY_URL_ALLOWLIST[1]), /webpack-internal/)
  assert.match(String(FIRST_PARTY_URL_ALLOWLIST[2]), /_next/)
})
