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

test("public legal and transparency pages do not reference retired referral/donation programs", () => {
  const targets = [
    "app/privacy-policy/page.tsx",
    "app/terms-of-service/page.tsx",
    "app/transparency/page.tsx",
  ]

  for (const target of targets) {
    const source = readSource(target)

    const retiredTerms = [
      "rakuten",
      "befrugal",
      "affiliate",
      "referral compensation",
      "paypal",
      "donation",
      "tip jar",
    ]

    for (const term of retiredTerms) {
      assert.ok(!source.includes(term), `${target} must not reference retired term: ${term}`)
    }

    assert.ok(
      !source.includes("not affiliated with rakuten"),
      `${target} must not reference Rakuten relationship language`
    )
    assert.ok(
      !source.includes("not associated with rakuten"),
      `${target} must not reference Rakuten relationship language`
    )
  }
})

test("transparency page contains advertising disclosure without promotional language", () => {
  const source = readSource("app/transparency/page.tsx")
  const normalized = normalizeWhitespace(source)

  assert.ok(normalized.includes("advertising"), "transparency page must reference advertising")

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

test("privacy and terms pages contain factual advertising disclosure", () => {
  const targets = ["app/privacy-policy/page.tsx", "app/terms-of-service/page.tsx"]

  for (const target of targets) {
    const source = readSource(target)
    const normalized = normalizeWhitespace(source)
    assert.ok(normalized.includes("advertising"), `${target} must reference advertising`)
    assert.ok(!normalized.includes("rakuten"), `${target} must not reference Rakuten`)
    assert.ok(!normalized.includes("affiliate"), `${target} must not reference affiliate programs`)
    assert.ok(
      !normalized.includes("referral compensation"),
      `${target} must not reference referral compensation`
    )
  }
})
