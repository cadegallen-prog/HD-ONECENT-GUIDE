#!/usr/bin/env tsx

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import net from 'net';

async function gotoWithRetries(page: any, url: string, attempts = 3) {
  let lastError: unknown = undefined;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });

      try {
        await page.waitForLoadState('networkidle', { timeout: 5_000 });
      } catch {
        // ignore
      }

      await page.waitForTimeout(350);
      return;
    } catch (err) {
      lastError = err;
      await page.waitForTimeout(500 * attempt);
    }
  }

  throw lastError;
}

async function checkServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
      server.close();
    });

    server.once('listening', () => {
      server.close();
      resolve(false);
    });

    server.listen(3001);
  });
}

async function captureUiState(
  page: any,
  outDir: string,
  slug: string,
  mode: 'light' | 'dark'
) {
  const perPageSelect = page.locator('#penny-list-items-per-page');

  try {
    if ((await perPageSelect.count()) > 0) {
      await perPageSelect.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
    } else {
      await page.evaluate(() => window.scrollTo(0, 700));
      await page.waitForTimeout(200);
    }
  } catch {
    // Best-effort only.
  }

  await page.screenshot({
    path: path.join(outDir, `${slug}-ui-${mode}.png`),
    fullPage: false,
  });
}

async function main() {
  const routes = process.argv.slice(2);

  if (routes.length === 0) {
    console.error('❌ Error: No routes specified');
    console.error('Usage: npm run ai:proof -- /penny-list /store-finder');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════');
  console.log('   AI Proof Screenshot Capture');
  console.log('═══════════════════════════════════════\n');

  // Check if dev server is running
  const serverRunning = await checkServerRunning();
  if (!serverRunning) {
    console.error(
      '❌ Error: Dev server not running on port 3001\n' +
        'Please run "npm run dev" in another terminal first.\n'
    );
    process.exit(1);
  }

  console.log('✅ Dev server detected on port 3001\n');

  // Create timestamp and output directory
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const outDir = path.join('reports', 'proof', timestamp);

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`📁 Output directory: ${outDir}\n`);
  console.log(`📸 Capturing screenshots for ${routes.length} route(s)...\n`);

  // Launch browser
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Track console errors
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${msg.location().url}] ${msg.text()}`);
    }
  });

  // Capture screenshots for each route
  for (const route of routes) {
    const slug = route.replace(/\//g, '-').slice(1) || 'home';

    console.log(`  Processing ${route}...`);

    try {
      // Light mode
      await page.emulateMedia({ colorScheme: 'light' });
      await gotoWithRetries(page, `http://localhost:3001${route}`);
      await page.screenshot({
        path: path.join(outDir, `${slug}-light.png`),
        fullPage: false,
      });
      console.log(`    ✅ ${slug}-light.png`);
      await captureUiState(page, outDir, slug, 'light');
      console.log(`    ✅ ${slug}-ui-light.png`);

      // Dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await gotoWithRetries(page, `http://localhost:3001${route}`);
      await page.screenshot({
        path: path.join(outDir, `${slug}-dark.png`),
        fullPage: false,
      });
      console.log(`    ✅ ${slug}-dark.png`);
      await captureUiState(page, outDir, slug, 'dark');
      console.log(`    ✅ ${slug}-ui-dark.png`);
    } catch (err: any) {
      console.error(`    ❌ Error capturing ${route}: ${err.message}`);
    }
  }

  // Save console errors
  const errorsPath = path.join(outDir, 'console-errors.txt');
  if (consoleErrors.length > 0) {
    fs.writeFileSync(errorsPath, consoleErrors.join('\n'));
    console.log(`\n⚠️  ${consoleErrors.length} console error(s) recorded`);
  } else {
    fs.writeFileSync(errorsPath, 'No console errors detected');
    console.log(`\n✅ No console errors detected`);
  }

  await browser.close();

  console.log('\n═══════════════════════════════════════');
  console.log('   Screenshot Capture Complete');
  console.log('═══════════════════════════════════════\n');
  console.log(`📁 Outputs saved to: ${outDir}\n`);
}

main().catch((err) => {
  console.error('Error running screenshot capture:', err);
  process.exit(1);
});
