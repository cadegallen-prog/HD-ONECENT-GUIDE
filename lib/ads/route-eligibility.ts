export type AdRouteEligibility = "allow" | "exclude"

export type AdInventoryUnit = "provider_managed"

export interface AdRoutePolicy {
  key: string
  eligibility: AdRouteEligibility
  inventory: readonly AdInventoryUnit[]
  notes: string
}

export const HARD_AD_EXCLUDED_ROUTES = [
  "/report-find",
  "/store-finder",
  "/support",
  "/transparency",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/do-not-sell-or-share",
  "/unsubscribed",
  "/go/rakuten",
  "/go/befrugal",
  "/login",
  "/auth/callback",
  "/robots.txt",
  "/sitemap.xml",
] as const

const HARD_AD_EXCLUDED_ROUTE_SET = new Set<string>(HARD_AD_EXCLUDED_ROUTES)

const HARD_AD_EXCLUDED_PREFIXES = ["/lists/", "/s/", "/api/", "/admin/"]

const PROVIDER_MANAGED_POLICY: AdRoutePolicy = {
  key: "provider-managed",
  eligibility: "allow",
  inventory: ["provider_managed"],
  notes:
    "Provider-managed placement is enabled by default on all non-excluded routes. Hard exclusions remain enforced.",
}

const EXCLUDED_POLICY: AdRoutePolicy = {
  key: "excluded",
  eligibility: "exclude",
  inventory: [],
  notes: "Ad-disabled route category (trust/safety/system).",
}

export const AD_ROUTE_MATRIX: ReadonlyArray<{
  route: string
  policy: AdRoutePolicy
}> = [
  { route: "ALL_NON_EXCLUDED_ROUTES", policy: PROVIDER_MANAGED_POLICY },
  ...HARD_AD_EXCLUDED_ROUTES.map((route) => ({ route, policy: EXCLUDED_POLICY })),
  { route: "/lists/*", policy: EXCLUDED_POLICY },
  { route: "/s/*", policy: EXCLUDED_POLICY },
  { route: "/api/*", policy: EXCLUDED_POLICY },
  { route: "/admin/*", policy: EXCLUDED_POLICY },
]

export function normalizeRoutePath(pathname: string): string {
  if (!pathname) return "/"

  const pathOnly = pathname.split(/[?#]/)[0] || "/"
  if (pathOnly === "/") return "/"
  return pathOnly.endsWith("/") ? pathOnly.slice(0, -1) : pathOnly
}

function isHardExcludedPath(pathname: string): boolean {
  if (pathname === "/lists") return true
  if (HARD_AD_EXCLUDED_ROUTE_SET.has(pathname)) return true
  return HARD_AD_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function getAdRoutePolicy(pathname: string): AdRoutePolicy {
  const normalized = normalizeRoutePath(pathname)
  return isHardExcludedPath(normalized) ? EXCLUDED_POLICY : PROVIDER_MANAGED_POLICY
}

export function isRouteAdEligible(pathname: string): boolean {
  return getAdRoutePolicy(pathname).eligibility === "allow"
}
