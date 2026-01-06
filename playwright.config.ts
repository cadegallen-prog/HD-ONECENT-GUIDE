import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  outputDir: "reports/playwright/results",
  snapshotDir: "reports/playwright/baseline",
  reporter: [["list"], ["html", { outputFolder: "reports/playwright/html", open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002",
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
  webServer: {
    command:
      "cross-env PLAYWRIGHT=1 npm run build && cross-env PLAYWRIGHT=1 npm run start -- --port 3002",
    url: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3002",
    reuseExistingServer: false,
    timeout: 120000,
  },
})
