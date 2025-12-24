import sharp from "sharp"
import { writeFileSync } from "fs"
import { join } from "path"

const SOURCE = join(process.cwd(), "public", "og", "pennycentral-og-fixed-1200x630-balanced.jpg")
const OUTPUT = join(process.cwd(), "public", "og", "template-background.jpg")

const OG_WIDTH = 1200
const OG_HEIGHT = 630

// Create a white mask to cover the original text area (left 70%)
const WHITE_MASK_WIDTH = 840

async function main() {
  console.log("Creating OG background template...")
  console.log(`Source: ${SOURCE}`)

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

  writeFileSync(OUTPUT, templateBuffer)
  const sizeKB = Math.round(templateBuffer.length / 1024)
  console.log(`✓ Saved template: ${OUTPUT} (${sizeKB}KB)`)

  console.log("\nDone! Background template created successfully.")
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
