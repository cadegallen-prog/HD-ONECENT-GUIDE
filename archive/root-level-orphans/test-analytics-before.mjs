import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function captureAnalytics() {
  console.log('='.repeat(80));
  console.log('ANALYTICS BEHAVIOR CAPTURE - BEFORE FIX');
  console.log('='.repeat(80));
  console.log('');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  const cspViolations = [];
  const networkErrors = [];

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({
      type: msg.type(),
      text: text,
      timestamp: new Date().toISOString()
    });
    
    if (text.includes('CSP') || text.includes('Content Security Policy')) {
      cspViolations.push(text);
    }
  });

  // Capture network failures
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown error'
    });
  });

  try {
    console.log('[TEST 1] Navigating to homepage...');
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit for analytics to initialize
    await page.waitForTimeout(2000);

    console.log('\n[CHECKPOINT 1] Homepage loaded\n');

    // Check dataLayer on homepage
    const homeDataLayer = await page.evaluate(() => {
      return window.dataLayer || [];
    });

    console.log('dataLayer on homepage:');
    console.log(JSON.stringify(homeDataLayer, null, 2));
    console.log('');

    // Check if GTM container loaded
    const gtmLoaded = await page.evaluate(() => {
      return typeof window.google_tag_manager !== 'undefined';
    });
    console.log(`GTM Container Loaded: ${gtmLoaded}`);
    console.log('');

    // Navigate to penny-list
    console.log('[TEST 2] Navigating to /penny-list...');
    await page.goto('http://localhost:3001/penny-list', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);

    console.log('\n[CHECKPOINT 2] Penny List page loaded\n');

    // Check dataLayer on penny-list
    const pennyListDataLayer = await page.evaluate(() => {
      return window.dataLayer || [];
    });

    console.log('dataLayer on /penny-list:');
    console.log(JSON.stringify(pennyListDataLayer, null, 2));
    console.log('');

    // Report CSP violations
    console.log('\n' + '='.repeat(80));
    console.log('CSP VIOLATIONS DETECTED');
    console.log('='.repeat(80));
    if (cspViolations.length > 0) {
      cspViolations.forEach((violation, i) => {
        console.log(`\n[${i + 1}] ${violation}`);
      });
    } else {
      console.log('No CSP violations detected');
    }

    // Report network errors
    console.log('\n' + '='.repeat(80));
    console.log('NETWORK ERRORS');
    console.log('='.repeat(80));
    if (networkErrors.length > 0) {
      networkErrors.forEach((error, i) => {
        console.log(`\n[${i + 1}] ${error.url}`);
        console.log(`    Reason: ${error.failure}`);
      });
    } else {
      console.log('No network errors detected');
    }

    // Report all console messages
    console.log('\n' + '='.repeat(80));
    console.log('ALL CONSOLE MESSAGES');
    console.log('='.repeat(80));
    consoleMessages.forEach((msg, i) => {
      console.log(`\n[${i + 1}] [${msg.type.toUpperCase()}] ${msg.text}`);
    });

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total console messages: ${consoleMessages.length}`);
    console.log(`CSP violations: ${cspViolations.length}`);
    console.log(`Network errors: ${networkErrors.length}`);
    console.log(`Homepage dataLayer events: ${homeDataLayer.length}`);
    console.log(`Penny List dataLayer events: ${pennyListDataLayer.length}`);
    
    const pageViewEvents = [...homeDataLayer, ...pennyListDataLayer].filter(
      event => event.event === 'page_view'
    );
    console.log(`Total page_view events: ${pageViewEvents.length}`);
    console.log('');

  } catch (error) {
    console.error('\n[ERROR] Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('\n[COMPLETE] Browser closed');
  }
}

captureAnalytics().catch(console.error);
