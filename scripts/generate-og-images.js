/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs")
const path = require("path")
const https = require("https")

// Pages and their headlines
const pages = [
  { name: "og-homepage", headline: "Home Depot Penny List" },
  { name: "og-penny-list", headline: "Home Depot Penny List" },
  { name: "og-report-find", headline: "Report a Penny Find" },
  { name: "og-store-finder", headline: "Store Finder" },
  { name: "og-guide", headline: "Complete Guide" },
]

// Ensure output directory exists
const outputDir = path.join(__dirname, "..", "public", "og")
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`))
          return
        }
        response.pipe(file)
        file.on("finish", () => {
          file.close()
          console.log(`Downloaded: ${outputPath}`)
          resolve()
        })
      })
      .on("error", (err) => {
        fs.unlink(outputPath, () => {}) // Delete partial file
        reject(err)
      })
  })
}

async function main() {
  console.log("Generating static OG images from production API...\n")

  for (const page of pages) {
    const url = `https://www.pennycentral.com/api/og?headline=${encodeURIComponent(page.headline)}&v=8`
    const outputPath = path.join(outputDir, `${page.name}.png`)

    try {
      await downloadImage(url, outputPath)
    } catch (error) {
      console.error(`Failed to generate ${page.name}: ${error.message}`)
    }
  }

  console.log("\nDone!")
}

main()
