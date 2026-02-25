import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

const testFiles = []

function collectTests(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      collectTests(fullPath)
      continue
    }
    if (fullPath.endsWith(".test.ts")) {
      testFiles.push(fullPath)
    }
  }
}

collectTests("tests")

if (testFiles.length === 0) {
  console.error("No unit tests found under ./tests.")
  process.exit(1)
}

const result = spawnSync("tsx", ["--import", "./tests/setup.ts", "--test", ...testFiles], {
  stdio: "inherit",
  shell: process.platform === "win32",
  timeout: Number.parseInt(process.env.UNIT_TEST_TIMEOUT_MS || "600000", 10),
  killSignal: "SIGTERM",
})

const timeoutMs = Number.parseInt(process.env.UNIT_TEST_TIMEOUT_MS || "600000", 10)
const timedOut =
  result.error?.code === "ETIMEDOUT" || (result.status === null && result.signal === "SIGTERM")

if (timedOut) {
  console.error(
    `Unit tests timed out after ${timeoutMs}ms. Set UNIT_TEST_TIMEOUT_MS to a higher value if needed.`
  )
  process.exit(124)
}

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
