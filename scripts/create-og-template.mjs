import sharp from "sharp"
import { writeFileSync } from "fs"
import { join } from "path"

const SOURCE = join(process.cwd(), "public", "og", "pennycentral-og-fixed-1200x630-balanced.jpg")
const OUTPUT = join(process.cwd(), "public", "og", "template-background.jpg")
const OUTPUT_BASE64 = join(process.cwd(), "lib", "og-background-base64.ts")

const OG_WIDTH = 1200
const OG_HEIGHT = 630

// Create a white mask to cover the original text area (left 70%)
const WHITE_MASK_WIDTH = 840

async function main() {
  console.log("Creating OG background template...")
  console.log(`Source: ${SOURCE}`)

  // Step 1: Create white rectangle to mask original text
  const whiteMask = await sharp({
    create: {
      width: WHITE_MASK_WIDTH,
      height: OG_HEIGHT,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer()

  console.log("✓ Created white mask")

  // Step 2: Load original image and composite white mask over text area
  const templateBuffer = await sharp(SOURCE)
    .composite([
      {
        input: whiteMask,
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 90 })
    .toBuffer()

  console.log("✓ Created template with masked text area")

  // Step 3: Save the template
  writeFileSync(OUTPUT, templateBuffer)
  const sizeKB = Math.round(templateBuffer.length / 1024)
  console.log(`✓ Saved template: ${OUTPUT} (${sizeKB}KB)`)

  // Step 4: Convert to base64 and create TypeScript module
  const base64 = templateBuffer.toString("base64")
  const tsContent = `// Auto-generated OG background template
// Contains pennies photo on right side, white background for text on left
// Source: pennycentral-og-fixed-1200x630-balanced.jpg
// Generated: ${new Date().toISOString()}

export const OG_BACKGROUND_BASE64 = "${base64}"
`

  writeFileSync(OUTPUT_BASE64, tsContent)
  const base64SizeKB = Math.round(base64.length / 1024)
  console.log(`✓ Saved base64 module: ${OUTPUT_BASE64} (${base64SizeKB}KB)`)

  console.log("\nDone! Background template created successfully.")
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
