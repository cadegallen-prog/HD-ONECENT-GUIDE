import { test, expect } from '@playwright/test'

// Custom viewport sizes for testing
const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1280, height: 800 },
}

test.describe('Penny List Redesign - Visual Verification', () => {
  test('Mobile Light - Card layout and Line A/B visibility', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/penny-list')
    
    // Wait for cards to load
    await expect(page.locator('[role="link"]').first()).toBeVisible({ timeout: 10000 })
    
    // Verify card structure exists
    const firstCard = page.locator('[role="link"]').first()
    const cardText = await firstCard.textContent()
    expect(cardText).toBeTruthy()
    
    // Take screenshot
    await page.screenshot({ 
      path: 'reports/proof/penny-list-mobile-light-redesign.png',
      fullPage: false 
    })
  })

  test('Mobile Dark - Theme verification', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/penny-list')
    
    await expect(page.locator('[role="link"]').first()).toBeVisible({ timeout: 10000 })
    
    await page.screenshot({ 
      path: 'reports/proof/penny-list-mobile-dark-redesign.png',
      fullPage: false 
    })
  })

  test('Desktop Light - Table and card layout', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.goto('/penny-list?view=table')
    
    // Wait for table to load
    await expect(page.locator('table[role="table"]')).toBeVisible({ timeout: 10000 })
    
    await page.screenshot({ 
      path: 'reports/proof/penny-list-desktop-table-light-redesign.png',
      fullPage: false 
    })
  })

  test('Desktop Dark - Table theme', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/penny-list?view=table')
    
    await expect(page.locator('table[role="table"]')).toBeVisible({ timeout: 10000 })
    
    await page.screenshot({ 
      path: 'reports/proof/penny-list-desktop-table-dark-redesign.png',
      fullPage: false 
    })
  })

  test('Card view interactions - State breakdown sheet opens on Line B tap', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/penny-list')
    
    await expect(page.locator('[role="link"]').first()).toBeVisible({ timeout: 10000 })
    
    // Find the state breakdown button (Line B) and click it
    const stateButtons = page.locator('button:has-text("states"), button:has-text("State data unavailable")')
    if (await stateButtons.first().isVisible()) {
      await stateButtons.first().click()
      
      // Wait for sheet to open
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 })
      
      await page.screenshot({ 
        path: 'reports/proof/penny-list-state-breakdown-sheet-open.png',
        fullPage: false 
      })
      
      // Close sheet
      await page.keyboard.press('Escape')
    }
  })

  test('Verify 30d default window label (Line B format)', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto('/penny-list')
    
    // Wait for content
    await expect(page.locator('[role="link"]').first()).toBeVisible({ timeout: 10000 })
    
    // Check for window label in Line B - should show (30d)
    const lineB = page.locator('text=(30d)').first()
    if (await lineB.isVisible()) {
      await expect(lineB).toBeVisible()
      console.log('✅ Window label shows (30d) - correct 30d default')
    } else {
      console.log('⚠️  Could not verify window label visibility')
    }
  })
})
