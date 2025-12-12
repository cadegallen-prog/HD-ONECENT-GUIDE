import { test, expect } from '@playwright/test';

test('homepage loads and has a title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/penny/i);
});

test('navbar shows Report a Find link after hydration', async ({ page }) => {
  await page.goto('/');
  const width = page.viewportSize()?.width ?? 1280;

  if (width < 768) {
    await page.getByRole('button', { name: /toggle menu/i }).click();
  }

  await expect(page.getByRole('link', { name: 'Report a Find' })).toBeVisible();
});
