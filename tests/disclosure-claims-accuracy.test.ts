import assert from "node:assert"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

function readSource(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8").toLowerCase()
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
    assert.ok(source.includes("rakuten"), `${target} must reference Rakuten disclosure`)
    assert.ok(source.includes("referral"), `${target} must reference referral disclosure`)
  }
})
