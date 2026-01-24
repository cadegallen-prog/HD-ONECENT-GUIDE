import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3002"

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  outputDir: "reports/playwright/results",
  snapshotDir: "reports/playwright/baseline",
  reporter: [["list"], ["html", { outputFolder: "reports/playwright/html", open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: "chromium-desktop-light",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        colorScheme: "light",
      },
    },
    {
      name: "chromium-desktop-dark",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        colorScheme: "dark",
      },
    },
    {
      name: "chromium-mobile-light",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 667 },
        colorScheme: "light",
      },
    },
    {
      name: "chromium-mobile-dark",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 667 },
        colorScheme: "dark",
      },
    },
  ],
  // If PLAYWRIGHT_BASE_URL is provided (e.g. CI starts its own server), do not start another server.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command:
          "node -e \"require('fs').rmSync('.next', { recursive: true, force: true })\" && cross-env PLAYWRIGHT=1 NEXT_PUBLIC_EZOIC_ENABLED=false npm run build && cross-env PLAYWRIGHT=1 NEXT_PUBLIC_EZOIC_ENABLED=false npx next start -p 3002",
        url: baseURL,
        reuseExistingServer:
          !process.env.CI && process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1",
        timeout: 120000,
      },
})
