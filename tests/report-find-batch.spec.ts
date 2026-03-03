import { test, expect } from "@playwright/test"
import { REPORT_FIND_BASKET_ITEM_LIMIT } from "../lib/constants"

function buildRestoredBasket(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    sku: `1009258${String(100 + index).padStart(3, "0")}`,
    itemName: `Restored Item ${index + 1}`,
    quantity: null,
    addedVia: "prefill" as const,
  }))
}

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

  test("shows SKU-only Facebook preview text and copies the exact same text", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: (text: string) => {
            ;(window as Window & { __copiedFacebookText?: string }).__copiedFacebookText = text
            return Promise.resolve(text)
          },
        },
      })
    })

    await page.route("**/api/submit-find", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          mode: "batch",
          attempted: 3,
          successCount: 3,
          failedCount: 0,
          succeeded: [
            { index: 0, sku: "1009258128" },
            { index: 1, sku: "1002374965" },
            { index: 2, sku: "1010352067" },
          ],
          failed: [],
          message: "Submitted 3 of 3 item(s).",
        }),
      })
    })

    await page.goto("/report-find")

    await page.locator("#storeCity").fill("Atlanta")
    await page.locator("#storeState").selectOption("GA")
    await page.locator("#dateFound").fill("2026-03-03")

    await page.locator("#sku").fill("1009258128")
    await page.locator("#itemName").fill("s")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.locator("#sku").fill("1002374965")
    await page.locator("#itemName").fill("Bad Draft Name")
    await page.locator("#quantity").fill("2")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.locator("#sku").fill("1010352067")
    await page.locator("#itemName").fill("Another Draft Name")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.getByRole("button", { name: /Submit all \(3\)/i }).click()

    await expect(page.getByText("Submitted 3 of 3 item(s).")).toBeVisible()
    await expect(page.getByText("Copies plain text with SKUs only.")).toBeVisible()
    await expect(page.getByTestId("copy-facebook-button")).toHaveText("Copy Facebook post")

    await page.getByTestId("facebook-copy-preview-summary").click()

    const preview = page.getByTestId("facebook-copy-preview")
    const previewText = await preview.innerText()
    const expectedText = [
      "Atlanta, GA on 2026-03-03",
      "",
      "SKUs:",
      "- 1009-258-128",
      "- 1002-374-965 x2",
      "- 1010-352-067",
      "",
      "Report your own finds: https://www.pennycentral.com/report-find",
    ].join("\n")

    expect(previewText).toBe(expectedText)
    expect(previewText).not.toContain("Bad Draft Name")
    expect(previewText).not.toContain("Another Draft Name")
    expect(previewText).not.toContain("\ns\n")

    await page.getByTestId("copy-facebook-button").click()
    await expect(page.getByText("Copied Facebook post text. Paste it into Facebook.")).toBeVisible()

    const copiedText = await page.evaluate(
      () => (window as Window & { __copiedFacebookText?: string }).__copiedFacebookText
    )
    expect(copiedText).toBe(expectedText)
  })

  test("submits a restored valid basket even when the draft item fields are blank", async ({
    page,
  }) => {
    const restoredBasket = buildRestoredBasket(REPORT_FIND_BASKET_ITEM_LIMIT)

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
    await page
      .getByRole("button", { name: new RegExp(`Submit all \\(${restoredBasket.length}\\)`, "i") })
      .click()

    await expect(
      page.getByText(`Submitted ${restoredBasket.length} of ${restoredBasket.length} item(s).`)
    ).toBeVisible()
    expect(submitCount).toBe(1)
    expect(submittedPayload?.items).toHaveLength(restoredBasket.length)
  })

  test("blocks a restored over-limit basket until the user trims it back to the current cap", async ({
    page,
  }) => {
    const restoredBasket = buildRestoredBasket(REPORT_FIND_BASKET_ITEM_LIMIT + 1)

    await page.addInitScript((basket) => {
      window.sessionStorage.setItem("pc_report_basket_v1", JSON.stringify(basket))
    }, restoredBasket)

    await page.goto("/report-find")

    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(
      restoredBasket.length
    )
    await expect(page.getByTestId("report-basket-limit-warning")).toHaveText(
      `This saved basket has ${restoredBasket.length} items. The current limit is ${REPORT_FIND_BASKET_ITEM_LIMIT}. Remove 1 item, submit this batch, then send the rest in a second batch.`
    )

    const blockedSubmitButton = page.getByRole("button", {
      name: new RegExp(`Submit all \\(${restoredBasket.length}\\)`, "i"),
    })
    await expect(blockedSubmitButton).toBeDisabled()

    await page.getByRole("button", { name: /Remove Restored Item 1 from basket/i }).click()

    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(
      REPORT_FIND_BASKET_ITEM_LIMIT
    )
    await expect(page.getByTestId("report-basket-limit-warning")).toHaveCount(0)
    await expect(
      page.getByRole("button", {
        name: new RegExp(`Submit all \\(${REPORT_FIND_BASKET_ITEM_LIMIT}\\)`, "i"),
      })
    ).toBeEnabled()
  })
})
