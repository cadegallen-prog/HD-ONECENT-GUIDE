import sharp from "sharp"
import { writeFileSync } from "fs"
import { join } from "path"

const DEFAULT_SOURCE = join(process.cwd(), "public", "og", "og-background.jpg")
const SOURCE = process.env.OG_BACKGROUND_SOURCE || DEFAULT_SOURCE
const OUTPUT_JPG = join(process.cwd(), "public", "og", "og-background.jpg")
const OUTPUT_BASE64 = join(process.cwd(), "lib", "og-background-base64.ts")

const OG_WIDTH = 1200
const OG_HEIGHT = 630

async function main() {
  console.log("Preparing OG background image...")
  console.log(`Source: ${SOURCE}`)

  // Get source image info
  const metadata = await sharp(SOURCE).metadata()
  console.log(`Source dimensions: ${metadata.width}x${metadata.height}`)

  // Resize to exact OG dimensions (1200x630)
  const resizedBuffer = await sharp(SOURCE)
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 92 })
    .toBuffer()

  console.log(`✓ Resized to ${OG_WIDTH}x${OG_HEIGHT}`)

  // Save the resized JPG
  writeFileSync(OUTPUT_JPG, resizedBuffer)
  const sizeKB = Math.round(resizedBuffer.length / 1024)
  console.log(`✓ Saved: ${OUTPUT_JPG} (${sizeKB}KB)`)

  // Convert to base64 for Edge runtime embedding
  const base64 = resizedBuffer.toString("base64")
  const tsContent = `// OG background image (pennies + textured background, no text)
// Dimensions: ${OG_WIDTH}x${OG_HEIGHT}
// Source: ${SOURCE}
// Generated: ${new Date().toISOString()}

export const OG_BACKGROUND_BASE64 = "${base64}"
`

  writeFileSync(OUTPUT_BASE64, tsContent)
  const base64SizeKB = Math.round(base64.length / 1024)
  console.log(`✓ Saved base64: ${OUTPUT_BASE64} (${base64SizeKB}KB)`)

  console.log("\nDone!")
}

main().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
