#!/usr/bin/env tsx
/**
 * Generate PWA icons from SVG
 * Creates 192x192 and 512x512 PNG icons required for PWA installation
 */

import { chromium } from "playwright"
import * as fs from "fs/promises"
import * as path from "path"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const ICON_SVG = path.join(PUBLIC_DIR, "icon.svg")
const SIZES = [192, 512] as const

async function generateIcons() {
  console.log("🎨 Generating PWA icons from SVG...")

  // Read the SVG file
  const svgContent = await fs.readFile(ICON_SVG, "utf-8")

  // Launch browser
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const size of SIZES) {
    const outputPath = path.join(PUBLIC_DIR, `icon-${size}.png`)

    // Create HTML page with SVG scaled to desired size
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; background: transparent; }
            svg { display: block; }
          </style>
        </head>
        <body>
          ${svgContent.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`)}
        </body>
      </html>
    `

    await page.setContent(html)
    await page.setViewportSize({ width: size, height: size })

    // Screenshot the SVG
    await page.screenshot({
      path: outputPath,
      type: "png",
      omitBackground: false,
    })

    console.log(`✅ Created ${size}x${size} icon: ${outputPath}`)
  }

  await browser.close()
  console.log("🎉 All PWA icons generated successfully!")
}

generateIcons().catch((error) => {
  console.error("❌ Failed to generate icons:", error)
  process.exit(1)
})
