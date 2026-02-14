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

test("public legal and transparency pages keep Rakuten referral disclosure", () => {
  const targets = [
    "app/privacy-policy/page.tsx",
    "app/terms-of-service/page.tsx",
    "app/transparency/page.tsx",
  ]

  for (const target of targets) {
    const source = readSource(target)
    const normalized = normalizeWhitespace(source)
    assert.ok(normalized.includes("rakuten"), `${target} must reference Rakuten disclosure`)
    assert.ok(normalized.includes("referral"), `${target} must reference referral disclosure`)
    assert.ok(
      normalized.includes("qualifying signup") || normalized.includes("qualifying signups"),
      `${target} must specify qualifying-signup condition`
    )
  }
})
