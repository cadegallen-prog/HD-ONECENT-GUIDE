const { spawnSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")
const { getBaseUrl } = require("./get-base-url")

const baseUrl = getBaseUrl()
const reportDir = path.join(process.cwd(), "reports")
const reportPath = "reports/axe-report.json"

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true })

const axeBin = path.join(
  process.cwd(),
  "node_modules",
  "@axe-core",
  "cli",
  "dist",
  "src",
  "bin",
  "cli.js"
)

const result = spawnSync(
  process.execPath,
  [axeBin, baseUrl, "--save", reportPath, "--exit"],
  { stdio: "inherit" }
)

process.exit(typeof result.status === "number" ? result.status : 1)
