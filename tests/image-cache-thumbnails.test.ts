import { test } from "node:test"
import assert from "node:assert/strict"
import { toPennyListThumbnailUrl } from "@/lib/image-cache"

test("penny list thumbnails prefer -64_400 (avoid -64_300)", () => {
  const orbit400 =
    "https://images.thdstatic.com/productImages/a750b102-d0aa-4cca-ae88-3bc64ac8066c/svn/orbit-watering-wands-28174-64_400.jpg"
  assert.equal(toPennyListThumbnailUrl(orbit400), orbit400)

  const orbit600 =
    "https://images.thdstatic.com/productImages/a750b102-d0aa-4cca-ae88-3bc64ac8066c/svn/orbit-watering-wands-28174-64_600.jpg"
  assert.equal(toPennyListThumbnailUrl(orbit600), orbit400)

  assert.ok(!toPennyListThumbnailUrl(orbit600).includes("-64_300"))
})
