import { chromium } from 'playwright';

async function testNavigation() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Testing Guide Page Navigation\n');
  console.log('='.repeat(60));

  const tests = [
    {
      name: 'Root pages load directly (no redirects)',
      tests: [
        { url: 'http://localhost:3001/clearance-lifecycle', expected: '/clearance-lifecycle' },
        { url: 'http://localhost:3001/digital-pre-hunt', expected: '/digital-pre-hunt' },
        { url: 'http://localhost:3001/in-store-strategy', expected: '/in-store-strategy' },
        { url: 'http://localhost:3001/inside-scoop', expected: '/inside-scoop' },
        { url: 'http://localhost:3001/facts-vs-myths', expected: '/facts-vs-myths' },
      ]
    },
    {
      name: 'Legacy /guide/ paths redirect correctly',
      tests: [
        { url: 'http://localhost:3001/guide/clearance-lifecycle', expected: '/clearance-lifecycle' },
        { url: 'http://localhost:3001/guide/digital-pre-hunt', expected: '/digital-pre-hunt' },
        { url: 'http://localhost:3001/guide/in-store-strategy', expected: '/in-store-strategy' },
        { url: 'http://localhost:3001/guide/inside-scoop', expected: '/inside-scoop' },
        { url: 'http://localhost:3001/guide/fact-vs-fiction', expected: '/facts-vs-myths' },
      ]
    },
    {
      name: 'Cross-links within pages work',
      tests: [
        {
          startUrl: 'http://localhost:3001/digital-pre-hunt',
          linkText: 'In-Store Strategy',
          expected: '/in-store-strategy'
        },
        {
          startUrl: 'http://localhost:3001/in-store-strategy',
          linkText: 'The Digital Pre-Hunt',
          expected: '/digital-pre-hunt'
        },
        {
          startUrl: 'http://localhost:3001/facts-vs-myths',
          linkText: 'Understanding the Clearance Lifecycle',
          expected: '/clearance-lifecycle'
        }
      ]
    }
  ];

  for (const section of tests) {
    console.log(`\n${section.name}:`);

    for (const test of section.tests) {
      if (test.linkText) {
        await page.goto(test.startUrl, { waitUntil: 'networkidle' });
        try {
          await page.click(`text="${test.linkText}"`);
          await page.waitForLoadState('networkidle');
          const finalUrl = new URL(page.url()).pathname;
          const passed = finalUrl === test.expected;
          console.log(`  ${passed ? '✅' : '❌'} Link "${test.linkText}" → ${finalUrl} ${passed ? '' : `(expected ${test.expected})`}`);
        } catch (e) {
          console.log(`  ❌ Link "${test.linkText}" not found or failed`);
        }
      } else {
        const response = await page.goto(test.url, { waitUntil: 'networkidle' });
        const finalUrl = new URL(page.url()).pathname;
        const passed = finalUrl === test.expected;
        const status = response.status();
        console.log(`  ${passed ? '✅' : '❌'} ${test.url.replace('http://localhost:3001', '')} → ${finalUrl} (${status}) ${passed ? '' : `(expected ${test.expected})`}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  await browser.close();
}

testNavigation().catch(console.error);
