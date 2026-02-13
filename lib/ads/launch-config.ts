import { type AdInventoryUnit } from "@/lib/ads/route-eligibility"

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
    enabled: true,
    frequencyPerUserHours: 1,
  },
  volt: {
    enabled: true,
    pilotRoutes: GUIDE_CHAPTER_ROUTES,
    includeGuideHub: false,
  },
  pennyListPromptPause: {
    enabledDuringStickyTest: true,
    pausedComponents: PENNY_LIST_PROMPTS_TO_PAUSE,
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
