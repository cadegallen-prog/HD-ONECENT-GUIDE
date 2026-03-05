import {
  getMonumetricSlotPolicy,
  getRouteInContentSlotIds,
  getRouteRequeueSlotIds,
  MONUMETRIC_LAUNCH_CONFIG,
  MONUMETRIC_MOBILE_STICKY_SLOT_ID,
  type MonumetricSlotPolicy,
} from "@/lib/ads/launch-config"
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
  inContentSlotIds: readonly string[]
  requeueSlotIds: readonly string[]
  slotPolicies: Record<string, MonumetricSlotPolicy>
}

function buildSlotPolicies(pathname: string, inContentSlotIds: readonly string[]) {
  const slotPolicies: Record<string, MonumetricSlotPolicy> = {}

  for (const slotId of inContentSlotIds) {
    const policy = getMonumetricSlotPolicy(slotId)
    if (policy) {
      slotPolicies[slotId] = policy
    }
  }

  const normalizedStickyRoute = normalizeRoutePath(MONUMETRIC_LAUNCH_CONFIG.sticky.route)
  if (normalizedStickyRoute === pathname) {
    const stickyPolicy = getMonumetricSlotPolicy(MONUMETRIC_MOBILE_STICKY_SLOT_ID)
    if (stickyPolicy) {
      slotPolicies[MONUMETRIC_MOBILE_STICKY_SLOT_ID] = stickyPolicy
    }
  }

  return slotPolicies
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
      inContentSlotIds: [],
      requeueSlotIds: [],
      slotPolicies: {},
    }
  }

  const inContentSlotIds = getRouteInContentSlotIds(normalizedPathname)
  const requeueSlotIds = getRouteRequeueSlotIds(normalizedPathname)

  return {
    pathname: normalizedPathname,
    policy,
    inventory:
      MONUMETRIC_LAUNCH_CONFIG.placement.mode === "provider-managed"
        ? ["provider_managed"]
        : policy.inventory,
    providerManaged: MONUMETRIC_LAUNCH_CONFIG.placement.mode === "provider-managed",
    inContentSlotIds,
    requeueSlotIds,
    slotPolicies: buildSlotPolicies(normalizedPathname, inContentSlotIds),
  }
}
