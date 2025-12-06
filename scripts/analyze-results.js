const fs = require("fs")
const path = require("path")

const resultsDir = path.join(__dirname, "../test-results")
const files = fs
  .readdirSync(resultsDir)
  .filter((f) => f.startsWith("lighthouse-") && f.endsWith(".json"))

const scores = []

files.forEach((file) => {
  const content = fs.readFileSync(path.join(resultsDir, file), "utf8")
  const json = JSON.parse(content)
  const categories = json.categories

  scores.push({
    file: file,
    url: json.finalUrl,
    performance: categories.performance.score * 100,
    accessibility: categories.accessibility.score * 100,
    bestPractices: categories["best-practices"].score * 100,
    seo: categories.seo.score * 100,
  })
})

console.log("| Page | Device | Perf | A11y | BP | SEO |")
console.log("|---|---|---|---|---|---|")
scores
  .sort((a, b) => a.file.localeCompare(b.file))
  .forEach((s) => {
    const name = s.file.replace("lighthouse-", "").replace(".json", "")
    const parts = name.split("-")
    const device = parts.pop() // mobile or desktop
    const page = parts.join("-")

    console.log(
      `| ${page} | ${device} | ${s.performance} | ${s.accessibility} | ${s.bestPractices} | ${s.seo} |`
    )
  })
