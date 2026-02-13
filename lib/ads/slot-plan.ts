import { MONUMETRIC_LAUNCH_CONFIG } from "@/lib/ads/launch-config"
import {
  getAdRoutePolicy,
  normalizeRoutePath,
  type AdRoutePolicy,
  type AdInventoryUnit,
} from "@/lib/ads/route-eligibility"

export interface ActiveAdRoutePlan {
  pathname: string
  policy: AdRoutePolicy
  inventory: readonly AdInventoryUnit[]
  providerManaged: boolean
}

export function getActiveAdRoutePlan(pathname: string): ActiveAdRoutePlan {
  const normalizedPathname = normalizeRoutePath(pathname)
  const policy = getAdRoutePolicy(normalizedPathname)

  if (policy.eligibility === "exclude") {
    return {
      pathname: normalizedPathname,
      policy,
      inventory: [],
      providerManaged: false,
    }
  }

  return {
    pathname: normalizedPathname,
    policy,
    inventory:
      MONUMETRIC_LAUNCH_CONFIG.placement.mode === "provider-managed"
        ? ["provider_managed"]
        : policy.inventory,
    providerManaged: MONUMETRIC_LAUNCH_CONFIG.placement.mode === "provider-managed",
  }
}
