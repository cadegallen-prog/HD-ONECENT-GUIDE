function parseBooleanEnv(value: string | undefined): boolean | null {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()

  if (!normalized) return null
  if (["1", "true", "yes", "on"].includes(normalized)) return true
  if (["0", "false", "no", "off"].includes(normalized)) return false
  return null
}

export function isProductionDeployment(): boolean {
  const vercelEnv = (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || "").trim()
  if (vercelEnv.length > 0) {
    return vercelEnv.toLowerCase() === "production"
  }

  return process.env.NODE_ENV === "production"
}

export function isVisualPointerEnvironmentEnabled(): boolean {
  const explicit = parseBooleanEnv(process.env.NEXT_PUBLIC_VISUAL_POINTER_ENABLED)
  if (explicit !== null) return explicit

  return !isProductionDeployment()
}
