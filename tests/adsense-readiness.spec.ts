import { test, expect } from "@playwright/test"
import fs from "node:fs/promises"
import path from "node:path"
import "dotenv/config"

const PROOF_DIR = path.join(process.cwd(), "reports", "proof", "adsense-readiness")

test("admin endpoints require bearer auth", async ({ request }) => {
  const noAuth = await request.get("/api/admin/submissions")
  expect(noAuth.status()).toBe(401)

  const wrongToken = await request.get("/api/admin/submissions", {
    headers: { Authorization: "Bearer wrong" },
  })
  expect(wrongToken.status()).toBe(403)

  if (process.env.ADMIN_SECRET) {
    const correctToken = await request.get("/api/admin/submissions", {
      headers: { Authorization: `Bearer ${process.env.ADMIN_SECRET}` },
    })
    expect(correctToken.status()).toBe(200)
  }
})

test("auth-gated routes emit expected robots directives", async ({ page }) => {
  await page.goto("/lists")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow")

  await page.goto("/login")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow")

  await page.goto("/s/test-token")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow")
})

test("sitemap remains pillar-only with 18 urls", async ({ request }) => {
  const response = await request.get("/sitemap.xml")
  expect(response.ok()).toBeTruthy()

  const body = await response.text()
  const locMatches = body.match(/<loc>/g) ?? []
  expect(locMatches.length).toBe(18)

  expect(body).not.toContain("/lists")
  expect(body).not.toContain("/login")
  expect(body).not.toContain("/internal-systems")
})

test("privacy policy includes required ad-service disclosures and embed", async ({
  page,
}, testInfo) => {
  await page.goto("/privacy-policy")
  await expect(page.locator("body")).toContainText(/Google Analytics tracking via GA4/i)
  await expect(page.locator("body")).toContainText(/Monumetric/i)
  await expect(page.locator("body")).toContainText(/Ezoic/i)
  await expect(page.locator("body")).toContainText(/Resend/i)
  await expect(page.locator("#ezoic-privacy-policy-embed")).toHaveCount(1)

  await fs.mkdir(PROOF_DIR, { recursive: true })
  await page.screenshot({
    path: path.join(PROOF_DIR, `privacy-policy-${testInfo.project.name}.png`),
    fullPage: true,
  })

  await page.goto("/")
  await page.screenshot({
    path: path.join(PROOF_DIR, `home-footer-${testInfo.project.name}.png`),
    fullPage: true,
  })
})
