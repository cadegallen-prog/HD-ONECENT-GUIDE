function normalizeBaseUrl(value) {
  if (!value) return ""
  const trimmed = String(value).trim()
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed
}

function inferPortFromPackageJson() {
  try {
    const pkgPath = require("node:path").join(process.cwd(), "package.json")
    const pkgText = require("node:fs").readFileSync(pkgPath, "utf8")
    const pkg = JSON.parse(pkgText)
    const scripts = pkg?.scripts ?? {}
    const candidates = [scripts.dev, scripts.start].filter(Boolean)
    for (const cmd of candidates) {
      const match = String(cmd).match(/(?:^|\s)(?:-p|--port)(?:\s+|=)?(\d{2,5})(?:\s|$)/)
      if (match?.[1]) return match[1]
    }
  } catch {
    // ignore
  }
  return ""
}

function getBaseUrl() {
  const envBaseUrl = normalizeBaseUrl(process.env.BASE_URL)
  if (envBaseUrl) return envBaseUrl

  const envPort = String(process.env.PORT || "").trim()
  if (envPort) return `http://localhost:${envPort}`

  const inferredPort = inferPortFromPackageJson()
  if (inferredPort) return `http://localhost:${inferredPort}`

  throw new Error(
    "BASE_URL is not set and no port could be inferred from package.json. Set BASE_URL, e.g. http://localhost:<dev-port>."
  )
}

module.exports = { getBaseUrl }
