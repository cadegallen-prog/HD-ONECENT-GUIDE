const fs = require("fs")
const file = process.argv[2]
const content = fs.readFileSync(file, "utf8")
const json = JSON.parse(content)
const audit = json.audits["color-contrast"]
if (audit && audit.details && audit.details.items) {
  console.log("Color Contrast Issues:")
  audit.details.items.forEach((item) => {
    console.log(`- ${item.node.snippet} (Contrast: ${item.contrastRatio})`)
  })
} else {
  console.log("No color contrast issues found in details.")
}
