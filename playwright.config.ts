import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: 'reports/playwright/results',
  snapshotDir: 'reports/playwright/baseline',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright/html', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    actionTimeout: 60000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium-desktop-light',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        colorScheme: 'light',
      },
    },
    {
      name: 'chromium-desktop-dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        colorScheme: 'dark',
      },
    },
    {
      name: 'chromium-mobile-light',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
        colorScheme: 'light',
      },
    },
    {
      name: 'chromium-mobile-dark',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
        colorScheme: 'dark',
      },
    },
  ],
  webServer: {
    command: 'cross-env PLAYWRIGHT=1 npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
