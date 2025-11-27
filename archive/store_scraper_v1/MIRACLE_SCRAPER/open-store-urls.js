#!/usr/bin/env node
/**
 * Open Home Depot store URLs in your real browser in batches.
 *
 * Flow:
 * - Reads c:\Users\<you>\Downloads\home_depot_store_urls.txt
 * - Opens BATCH_SIZE URLs starting at OFFSET, with a delay between each
 * - Your Tampermonkey script runs on each tab and scrapes the store
 *
 * Adjust BATCH_SIZE, DELAY_MS, and OFFSET as needed.
 */

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Path to Edge (matches the Playwright launch path you've been using)
const EDGE_PATH = `"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"`;

// Text file created earlier, one URL per line
const URL_FILE = path.join(
  process.env.USERPROFILE,
  "Downloads",
  "home_depot_store_urls.txt",
);

// How many URLs to open in this run
const BATCH_SIZE = 50;

// Delay between opening tabs (milliseconds) - small for "burst fire"
const DELAY_MS = 200;

// Skip the first N URLs (set this to 50, 100, 150, etc. for later batches)
const OFFSET = 0;

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function main() {
  if (!fs.existsSync(URL_FILE)) {
    console.error(`URL file not found: ${URL_FILE}`);
    console.error("Make sure home_depot_store_urls.txt exists in your Downloads folder.");
    process.exit(1);
  }

  const raw = fs.readFileSync(URL_FILE, "utf8");
  const allUrls = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (!allUrls.length) {
    console.error("No URLs found in home_depot_store_urls.txt");
    process.exit(1);
  }

  const start = OFFSET;
  const end = Math.min(start + BATCH_SIZE, allUrls.length);
  const urls = allUrls.slice(start, end);

  console.log(`Opening ${urls.length} URLs (offset ${OFFSET}) from: ${URL_FILE}`);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i + 1}/${urls.length}] ${url}`);

    // Open explicitly in Edge so Tampermonkey in Edge runs
    exec(`${EDGE_PATH} "${url}"`);

    if (i < urls.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log("Done launching this batch. Let Tampermonkey scrape the tabs.");
}

main().catch((err) => {
  console.error("Error in open-store-urls:", err);
  process.exit(1);
});
