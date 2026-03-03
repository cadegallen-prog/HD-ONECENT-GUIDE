import { test, expect } from "@playwright/test"

test.describe("Report Find Batch Submit", () => {
  test("shows mixed success summary and keeps failed item for retry", async ({ page }) => {
    let submitCount = 0

    await page.route("**/api/submit-find", async (route) => {
      submitCount += 1
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          mode: "batch",
          attempted: 2,
          successCount: 1,
          failedCount: 1,
          succeeded: [{ index: 0, sku: "1009258128" }],
          failed: [{ index: 1, sku: "1009258127", message: "Simulated failure" }],
          message: "Submitted 1 of 2 item(s).",
        }),
      })
    })

    await page.goto("/report-find")

    await page.locator("#storeState").selectOption("FL")
    await page.locator("#dateFound").fill(new Date().toISOString().split("T")[0])

    await page.locator("#sku").fill("1009258128")
    await page.locator("#itemName").fill("Batch Item One")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.locator("#sku").fill("1009258127")
    await page.locator("#itemName").fill("Batch Item Two")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.getByRole("button", { name: /Submit all \(2\)/i }).click()

    await expect(page.getByText("Submitted 1 of 2 item(s).")).toBeVisible()
    await expect(page.getByText(/Simulated failure/)).toBeVisible()

    await expect(page.locator("[data-testid='basket-item-1009258127']")).toBeVisible()
    await expect(page.locator("[data-testid='basket-item-1009258128']")).toHaveCount(0)
    expect(submitCount).toBe(1)
  })

  test("submits a restored large basket even when the draft item fields are blank", async ({
    page,
  }) => {
    const restoredBasket = Array.from({ length: 16 }, (_, index) => ({
      sku: `1009258${String(100 + index).padStart(3, "0")}`,
      itemName: `Restored Item ${index + 1}`,
      quantity: null,
      addedVia: "prefill",
    }))

    let submitCount = 0
    let submittedPayload: { items?: Array<{ sku: string; itemName: string }> } | null = null

    await page.addInitScript((basket) => {
      window.sessionStorage.setItem("pc_report_basket_v1", JSON.stringify(basket))
    }, restoredBasket)

    await page.route("**/api/submit-find", async (route) => {
      submitCount += 1
      submittedPayload = JSON.parse(route.request().postData() ?? "{}") as {
        items?: Array<{ sku: string; itemName: string }>
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          mode: "batch",
          attempted: restoredBasket.length,
          successCount: restoredBasket.length,
          failedCount: 0,
          succeeded: restoredBasket.map((item, index) => ({ index, sku: item.sku })),
          failed: [],
          message: `Submitted ${restoredBasket.length} of ${restoredBasket.length} item(s).`,
        }),
      })
    })

    await page.goto("/report-find")

    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(
      restoredBasket.length
    )
    await expect(page.locator("#itemName")).toHaveValue("")

    await page.locator("#storeState").selectOption("FL")
    await page.locator("#dateFound").fill(new Date().toISOString().split("T")[0])
    await page.getByRole("button", { name: /Submit all \(16\)/i }).click()

    await expect(page.getByText("Submitted 16 of 16 item(s).")).toBeVisible()
    expect(submitCount).toBe(1)
    expect(submittedPayload?.items).toHaveLength(restoredBasket.length)
  })
})
