import assert from "node:assert"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

function readSource(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8").toLowerCase()
}

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim()
}

test("public legal and transparency pages do not claim Amazon Associate status", () => {
  const targets = [
    "app/privacy-policy/page.tsx",
    "app/terms-of-service/page.tsx",
    "app/transparency/page.tsx",
  ]

  for (const target of targets) {
    const source = readSource(target)
    assert.ok(
      !source.includes("as an amazon associate"),
      `${target} must not claim Amazon Associate status`
    )
    assert.ok(
      !source.includes("amazon associates earns"),
      `${target} must not use Amazon Associates earnings claim`
    )
    assert.ok(
      !source.includes("amazon associates program"),
      `${target} must not mention Amazon Associates program status`
    )
  }
})

test("public legal and transparency pages do not deny Rakuten relationship", () => {
  const targets = [
    "app/privacy-policy/page.tsx",
    "app/terms-of-service/page.tsx",
    "app/transparency/page.tsx",
  ]

  for (const target of targets) {
    const source = readSource(target)
    assert.ok(
      !source.includes("not affiliated with rakuten"),
      `${target} must not deny Rakuten relationship`
    )
    assert.ok(
      !source.includes("not associated with rakuten"),
      `${target} must not deny Rakuten relationship`
    )
  }
})

test("transparency page contains affiliate disclosure without promotional language", () => {
  const source = readSource("app/transparency/page.tsx")
  const normalized = normalizeWhitespace(source)

  // Must contain a disclosure that affiliate links exist
  assert.ok(normalized.includes("affiliate"), "transparency page must reference affiliate links")

  // Must mention Rakuten relationship factually
  assert.ok(normalized.includes("rakuten"), "transparency page must reference Rakuten")

  // Must mention referral compensation
  assert.ok(
    normalized.includes("referral"),
    "transparency page must reference referral compensation"
  )

  // Must include "no extra cost" consumer protection language
  assert.ok(
    normalized.includes("no extra cost"),
    "transparency page must state no extra cost to user"
  )

  // Must NOT contain promotional/CTA-style language
  assert.ok(
    !normalized.includes("save money"),
    "transparency page must not use promotional 'save money' language"
  )
  assert.ok(
    !normalized.includes("sign up now"),
    "transparency page must not use 'sign up now' CTA language"
  )
  assert.ok(
    !normalized.includes("exclusive bonus"),
    "transparency page must not use 'exclusive bonus' language"
  )
  assert.ok(
    !normalized.includes("don't miss"),
    "transparency page must not use 'don't miss' urgency language"
  )
})

test("privacy and terms pages contain factual affiliate disclosure", () => {
  const targets = ["app/privacy-policy/page.tsx", "app/terms-of-service/page.tsx"]

  for (const target of targets) {
    const source = readSource(target)
    const normalized = normalizeWhitespace(source)
    assert.ok(normalized.includes("affiliate"), `${target} must reference affiliate disclosure`)
    assert.ok(normalized.includes("rakuten"), `${target} must reference Rakuten`)
    assert.ok(normalized.includes("referral"), `${target} must reference referral`)
  }
})
