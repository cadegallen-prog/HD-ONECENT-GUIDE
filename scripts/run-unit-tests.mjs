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

const result = spawnSync(
  "tsx",
  ["--import", "./tests/setup.ts", "--test", ...testFiles],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  }
)

process.exit(result.status ?? 1)
