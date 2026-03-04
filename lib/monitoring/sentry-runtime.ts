export type SentryRuntime = "client" | "server" | "edge"

type SentryStackFrameLike = {
  abs_path?: string | null
  filename?: string | null
}

type SentryExceptionValueLike = {
  stacktrace?: {
    frames?: Array<SentryStackFrameLike | null> | null
  } | null
  type?: string | null
  value?: string | null
}

export type SentryEventLike = {
  exception?: {
    values?: Array<SentryExceptionValueLike | null> | null
  } | null
  logentry?: {
    formatted?: string | null
    message?: string | null
  } | null
  message?: string | null
}

const PRODUCTION_SENTRY_HOSTS = new Set(["pennycentral.com", "www.pennycentral.com"])
const LOCAL_SENTRY_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"])
const BROWSER_EXTENSION_URL_PATTERN = /(?:chrome|moz|safari)-extension:\/\//i

export const RUNTIME_SENTRY_DSN =
  "https://6c97a22cc0a22bf546df09e9051202f6@o4510605822394368.ingest.us.sentry.io/4510605823246336"

export const FIRST_PARTY_URL_ALLOWLIST: Array<string | RegExp> = [
  /^https:\/\/(?:www\.)?pennycentral\.com(?:$|\/)/i,
  /^webpack-internal:\/\//i,
  /\/_next\//i,
]

export const INITIAL_NOISE_PATTERNS: Array<string | RegExp> = [
  /geolocation/i,
  /failed to fetch/i,
  /network ?request failed/i,
  /xmlhttprequest/i,
  /content security policy/i,
  /refused to load the script/i,
  /\bcors\b/i,
  /cross-origin/i,
  /resizeobserver loop limit exceeded/i,
  /econnrefused/i,
  /etimedout/i,
  /pool exhausted/i,
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /safari-extension:\/\//i,
  /metamask/i,
  /grammarly/i,
]

function normalizeEnvValue(value: string | undefined | null): string | null {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()

  return normalized.length > 0 ? normalized : null
}

function normalizeHostname(hostname: string | undefined | null): string {
  return String(hostname ?? "")
    .trim()
    .toLowerCase()
}

function isProductionHostname(hostname: string): boolean {
  return PRODUCTION_SENTRY_HOSTS.has(hostname)
}

function isLocalHostname(hostname: string): boolean {
  return LOCAL_SENTRY_HOSTS.has(hostname) || hostname.endsWith(".local")
}

function looksLikePreviewHostname(hostname: string): boolean {
  return hostname.endsWith(".vercel.app")
}

function normalizeText(value: string | undefined | null): string | null {
  const normalized = String(value ?? "").trim()
  return normalized.length > 0 ? normalized : null
}

function getExceptionMessages(event: SentryEventLike): string[] {
  return (
    event.exception?.values?.flatMap((exception) => {
      const type = normalizeText(exception?.type)
      const value = normalizeText(exception?.value)

      if (type && value) return [`${type}: ${value}`]
      if (type) return [type]
      if (value) return [value]
      return []
    }) ?? []
  )
}

function getExceptionFrameUrls(event: SentryEventLike): string[] {
  return (
    event.exception?.values?.flatMap(
      (exception) =>
        exception?.stacktrace?.frames?.flatMap((frame) => {
          const filename = normalizeText(frame?.filename)
          const absolutePath = normalizeText(frame?.abs_path)
          return [filename, absolutePath].filter((value): value is string => Boolean(value))
        }) ?? []
    ) ?? []
  )
}

export function getClientSentryEnvironment(
  hostname = typeof window === "undefined" || !window.location ? "" : window.location.hostname,
  publicVercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV,
  nodeEnv = process.env.NODE_ENV
): string {
  const normalizedHostname = normalizeHostname(hostname)

  if (isProductionHostname(normalizedHostname)) return "production"

  const normalizedVercelEnv = normalizeEnvValue(publicVercelEnv)
  if (normalizedVercelEnv) return normalizedVercelEnv

  if (looksLikePreviewHostname(normalizedHostname)) return "preview"
  if (isLocalHostname(normalizedHostname)) return "development"

  return normalizeEnvValue(nodeEnv) ?? "development"
}

export function getServerSentryEnvironment(
  vercelEnv = process.env.VERCEL_ENV,
  nodeEnv = process.env.NODE_ENV
): string {
  return normalizeEnvValue(vercelEnv) ?? normalizeEnvValue(nodeEnv) ?? "development"
}

export function getSentryRuntimeTag(runtime: SentryRuntime): SentryRuntime {
  return runtime
}

export function normalizeSentryEventMessage(event: SentryEventLike): string {
  const messageParts = [
    normalizeText(event.message),
    normalizeText(event.logentry?.formatted),
    normalizeText(event.logentry?.message),
    ...getExceptionMessages(event),
  ].filter((value): value is string => Boolean(value))

  return messageParts.join(" | ").toLowerCase()
}

export function shouldDropSentryEvent(event: SentryEventLike): boolean {
  const normalizedMessage = normalizeSentryEventMessage(event)

  if (normalizedMessage.length > 0) {
    const matchesNoisePattern = INITIAL_NOISE_PATTERNS.some((pattern) => {
      if (typeof pattern === "string") {
        return normalizedMessage.includes(pattern.toLowerCase())
      }

      return pattern.test(normalizedMessage)
    })

    if (matchesNoisePattern) return true
  }

  return getExceptionFrameUrls(event).some((url) => BROWSER_EXTENSION_URL_PATTERN.test(url))
}
