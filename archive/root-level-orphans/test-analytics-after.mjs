import { chromium } from '@playwright/test';

const TIMEOUT = 10000;
const BASE_URL = 'http://localhost:3001';

async function testAnalytics() {
  console.log('=== ANALYTICS TEST - AFTER FIX ===\n');
  console.log('Test started:', new Date().toISOString());
  console.log('Testing URL:', BASE_URL);
  console.log('---\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  const cspViolations = [];
  const networkRequests = [];

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    consoleMessages.push({ type, text });
    
    if (type === 'error' || type === 'warning') {
      console.log(`[CONSOLE ${type.toUpperCase()}] ${text}`);
    }
  });

  // Capture CSP violations
  page.on('pageerror', error => {
    const errorText = error.toString();
    console.log('[PAGE ERROR]', errorText);
    
    if (errorText.includes('Content Security Policy') || 
        errorText.includes('adtrafficquality.google')) {
      cspViolations.push(errorText);
    }
  });

  // Track network requests for analytics
  page.on('request', request => {
    const url = request.url();
    if (url.includes('google-analytics.com') || 
        url.includes('googletagmanager.com') ||
        url.includes('adtrafficquality.google')) {
      networkRequests.push({
        url,
        method: request.method(),
        timestamp: new Date().toISOString()
      });
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('google-analytics.com') || 
        url.includes('googletagmanager.com')) {
      console.log(`[ANALYTICS RESPONSE] ${response.status()} - ${url.substring(0, 100)}...`);
    }
  });

  try {
    // TEST 1: Homepage
    console.log('\n--- TEST 1: Homepage Load ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
    
    // Wait for GTM to initialize
    await page.waitForTimeout(2000);

    const homepageDataLayer = await page.evaluate(() => {
      return window.dataLayer ? JSON.parse(JSON.stringify(window.dataLayer)) : null;
    });

    console.log('\nHomepage dataLayer:');
    if (homepageDataLayer) {
      console.log(JSON.stringify(homepageDataLayer, null, 2));
      
      const hasPageView = homepageDataLayer.some(event => 
        event.event === 'page_view' || event['gtm.start']
      );
      console.log(`\n✓ Has page_view or GTM init: ${hasPageView ? 'YES' : 'NO'}`);
    } else {
      console.log('❌ dataLayer is null or undefined');
    }

    // TEST 2: Navigation to /penny-list
    console.log('\n--- TEST 2: Navigation to /penny-list ---');
    await page.goto(`${BASE_URL}/penny-list`, { waitUntil: 'networkidle', timeout: TIMEOUT });
    
    // Wait for route change tracking
    await page.waitForTimeout(2000);

    const pennyListDataLayer = await page.evaluate(() => {
      return window.dataLayer ? JSON.parse(JSON.stringify(window.dataLayer)) : null;
    });

    console.log('\nPenny List dataLayer:');
    if (pennyListDataLayer) {
      console.log(JSON.stringify(pennyListDataLayer, null, 2));
      
      const pageViewEvents = pennyListDataLayer.filter(event => event.event === 'page_view');
      console.log(`\n✓ Total page_view events: ${pageViewEvents.length}`);
      
      if (pageViewEvents.length > 0) {
        console.log('✓ Most recent page_view:', JSON.stringify(pageViewEvents[pageViewEvents.length - 1], null, 2));
      }
    } else {
      console.log('❌ dataLayer is null or undefined');
    }

    // SUMMARY
    console.log('\n=== SUMMARY ===\n');
    
    console.log('CSP Violations:');
    if (cspViolations.length === 0) {
      console.log('✅ No CSP violations detected');
    } else {
      console.log(`❌ Found ${cspViolations.length} CSP violations:`);
      cspViolations.forEach((v, i) => console.log(`  ${i + 1}. ${v}`));
    }

    console.log('\nAdTrafficQuality Errors:');
    const adTrafficErrors = consoleMessages.filter(m => 
      m.text.includes('adtrafficquality.google')
    );
    if (adTrafficErrors.length === 0) {
      console.log('✅ No adtrafficquality.google errors');
    } else {
      console.log(`❌ Found ${adTrafficErrors.length} adtrafficquality errors:`);
      adTrafficErrors.forEach((e, i) => console.log(`  ${i + 1}. ${e.text}`));
    }

    console.log('\nDataLayer Status:');
    console.log(`✓ Homepage has dataLayer: ${homepageDataLayer ? 'YES' : 'NO'}`);
    console.log(`✓ Penny List has dataLayer: ${pennyListDataLayer ? 'YES' : 'NO'}`);
    
    if (homepageDataLayer) {
      const hasHomePageView = homepageDataLayer.some(e => e.event === 'page_view' || e['gtm.start']);
      console.log(`✓ Homepage has page_view: ${hasHomePageView ? 'YES' : 'NO'}`);
    }
    
    if (pennyListDataLayer) {
      const pageViewCount = pennyListDataLayer.filter(e => e.event === 'page_view').length;
      console.log(`✓ Penny List page_view count: ${pageViewCount}`);
    }

    console.log('\nAnalytics Network Requests:');
    if (networkRequests.length > 0) {
      console.log(`✓ Captured ${networkRequests.length} analytics requests:`);
      networkRequests.forEach((req, i) => {
        const shortUrl = req.url.substring(0, 80) + '...';
        console.log(`  ${i + 1}. ${req.method} ${shortUrl}`);
      });
    } else {
      console.log('⚠️  No analytics network requests captured');
    }

    console.log('\n=== TEST COMPLETE ===');
    console.log('Test finished:', new Date().toISOString());

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

testAnalytics().catch(console.error);
