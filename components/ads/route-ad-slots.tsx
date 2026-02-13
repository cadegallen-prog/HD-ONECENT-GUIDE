import { MONUMETRIC_LAUNCH_CONFIG } from "@/lib/ads/launch-config"
import { getActiveAdRoutePlan } from "@/lib/ads/slot-plan"

interface RouteAdSlotsProps {
  pathname: string
}

function toRouteToken(pathname: string): string {
  if (pathname === "/") return "home"
  return pathname
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

export function RouteAdSlots({ pathname }: RouteAdSlotsProps) {
  const plan = getActiveAdRoutePlan(pathname)

  if (plan.policy.eligibility === "exclude") {
    return null
  }

  const routeToken = toRouteToken(plan.pathname)

  const payload = {
    route: plan.pathname,
    eligibility: plan.policy.eligibility,
    inventory: plan.inventory,
    providerManaged: plan.providerManaged,
    launch: {
      placementMode: MONUMETRIC_LAUNCH_CONFIG.placement.mode,
      hardExclusionsOnly: MONUMETRIC_LAUNCH_CONFIG.placement.hardExclusionsOnly,
      stickyEnabled: MONUMETRIC_LAUNCH_CONFIG.sticky.enabled,
      stickySize: MONUMETRIC_LAUNCH_CONFIG.sticky.size,
      interstitialFrequencyPerUserHours:
        MONUMETRIC_LAUNCH_CONFIG.interstitial.frequencyPerUserHours,
      voltEnabled: MONUMETRIC_LAUNCH_CONFIG.volt.enabled,
    },
  }

  return (
    <script
      id={`pc-ad-plan-${routeToken}`}
      type="application/json"
      data-ad-route-plan="true"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
