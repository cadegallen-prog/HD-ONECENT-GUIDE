import { type AdInventoryUnit } from "@/lib/ads/route-eligibility"
import { normalizeRoutePath } from "@/lib/ads/route-eligibility"

export const GUIDE_CHAPTER_ROUTES = [
  "/what-are-pennies",
  "/clearance-lifecycle",
  "/digital-pre-hunt",
  "/in-store-strategy",
  "/inside-scoop",
  "/facts-vs-myths",
  "/faq",
] as const

export const PENNY_LIST_PROMPTS_TO_PAUSE = [
  "PWAInstallPrompt",
  "EmailSignupForm",
  "PennyListPageBookmarkBanner",
] as const

export const MONUMETRIC_IN_CONTENT_SLOT_ID = "39b97adf-dc3e-4795-b4a4-39f0da3c68dd"
export const MONUMETRIC_MOBILE_STICKY_SLOT_ID = "pc-mobile-sticky-anchor"
export const MONUMETRIC_IN_CONTENT_DOM_ID_PREFIX = "mmt-"
export const MONUMETRIC_REQUEUE_SLOT_ROUTES = ["/guide", ...GUIDE_CHAPTER_ROUTES] as const

export interface MonumetricSlotPolicy {
  reserveMinHeightPx: number
  collapseAfterMs: number
  maxPerRoute: number
  mobileEnabled: boolean
  desktopEnabled: boolean
}

const MONUMETRIC_REQUEUE_SLOT_ROUTE_SET = new Set<string>(MONUMETRIC_REQUEUE_SLOT_ROUTES)
const MONUMETRIC_ROUTE_REQUEUE_FLAG = process.env.NEXT_PUBLIC_MONU_ROUTE_REQUEUE
const MONUMETRIC_COLLAPSE_EMPTY_FLAG = process.env.NEXT_PUBLIC_MONU_COLLAPSE_EMPTY
const MONUMETRIC_EXPERIMENTAL_SPA_FLAG = process.env.NEXT_PUBLIC_MONU_EXPERIMENTAL_SPA

export const MONUMETRIC_LAUNCH_CONFIG = {
  placement: {
    mode: "provider-managed",
    hardExclusionsOnly: true,
  },
  sticky: {
    enabled: false,
    route: "/penny-list",
    mobileOnly: true,
    size: "320x50",
  },
  interstitial: {
    enabled: false,
    frequencyPerUserHours: 1,
  },
  volt: {
    enabled: false,
    pilotRoutes: GUIDE_CHAPTER_ROUTES,
    includeGuideHub: false,
  },
  pennyListPromptPause: {
    enabledDuringStickyTest: true,
    pausedComponents: PENNY_LIST_PROMPTS_TO_PAUSE,
  },
  routeRequeue: {
    enabled: MONUMETRIC_ROUTE_REQUEUE_FLAG !== "0",
    debounceMs: 120,
    knownInContentSlotIds: [MONUMETRIC_IN_CONTENT_SLOT_ID],
  },
  slotShell: {
    collapseEmptyEnabled: MONUMETRIC_COLLAPSE_EMPTY_FLAG !== "0",
    observerDebounceMs: 150,
  },
  slotPolicies: {
    [MONUMETRIC_IN_CONTENT_SLOT_ID]: {
      reserveMinHeightPx: 250,
      collapseAfterMs: 7000,
      maxPerRoute: 2,
      mobileEnabled: true,
      desktopEnabled: true,
    },
    [MONUMETRIC_MOBILE_STICKY_SLOT_ID]: {
      reserveMinHeightPx: 50,
      collapseAfterMs: 7000,
      maxPerRoute: 1,
      mobileEnabled: true,
      desktopEnabled: false,
    },
  },
  experimentalSpa: {
    enabled: MONUMETRIC_EXPERIMENTAL_SPA_FLAG === "1",
  },
} as const

export function getLaunchInventoryForRoute(pathname: string): readonly AdInventoryUnit[] {
  void pathname
  if (MONUMETRIC_LAUNCH_CONFIG.placement.mode === "provider-managed") {
    return ["provider_managed"]
  }
  return []
}

export function shouldPausePennyListPromptStack(options: {
  stickyTestEnabled: boolean
  isMobile: boolean
}): boolean {
  return (
    MONUMETRIC_LAUNCH_CONFIG.pennyListPromptPause.enabledDuringStickyTest &&
    options.stickyTestEnabled &&
    options.isMobile
  )
}

export function getRouteRequeueSlotIds(pathname: string): readonly string[] {
  const normalizedPath = normalizeRoutePath(pathname)
  if (!MONUMETRIC_REQUEUE_SLOT_ROUTE_SET.has(normalizedPath)) {
    return []
  }
  return [MONUMETRIC_IN_CONTENT_SLOT_ID]
}

export function getMonumetricSlotDomId(slotId: string): string {
  return `${MONUMETRIC_IN_CONTENT_DOM_ID_PREFIX}${slotId}`
}

export function getMonumetricSlotPolicy(slotId: string): MonumetricSlotPolicy | null {
  const policy =
    MONUMETRIC_LAUNCH_CONFIG.slotPolicies[
      slotId as keyof typeof MONUMETRIC_LAUNCH_CONFIG.slotPolicies
    ]
  if (!policy) return null

  return {
    reserveMinHeightPx: policy.reserveMinHeightPx,
    collapseAfterMs: policy.collapseAfterMs,
    maxPerRoute: policy.maxPerRoute,
    mobileEnabled: policy.mobileEnabled,
    desktopEnabled: policy.desktopEnabled,
  }
}
