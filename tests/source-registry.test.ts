import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { lookupSource, getAllRegisteredIds } from "../lib/visual-pointer/source-registry"

describe("source-registry", () => {
  it("returns anchor metadata for a known penny-list pcId", () => {
    const result = lookupSource("penny-list.search-input")
    assert.notEqual(result, "source_unavailable")
    if (result === "source_unavailable") return
    assert.equal(result.pcId, "penny-list.search-input")
    assert.equal(result.route, "/penny-list")
    assert.equal(result.component, "PennyListClient")
    assert.match(result.file, /penny-list-client\.tsx$/)
  })

  it("returns anchor metadata for a known store-finder pcId", () => {
    const result = lookupSource("store-finder.popup-directions")
    assert.notEqual(result, "source_unavailable")
    if (result === "source_unavailable") return
    assert.equal(result.pcId, "store-finder.popup-directions")
    assert.equal(result.route, "/store-finder")
    assert.equal(result.component, "StoreMap")
    assert.match(result.file, /store-map\.tsx$/)
  })

  it("returns source_unavailable for an unknown pcId", () => {
    const result = lookupSource("unknown.element")
    assert.equal(result, "source_unavailable")
  })

  it("getAllRegisteredIds returns all pilot anchors", () => {
    const ids = getAllRegisteredIds()
    assert.ok(ids.length >= 16, `expected at least 16 anchors, got ${ids.length}`)
    assert.ok(ids.includes("penny-list.search-input"))
    assert.ok(ids.includes("store-finder.popup-directions"))
  })
})
