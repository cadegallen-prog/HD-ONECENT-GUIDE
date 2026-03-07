"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { getAdRoutePolicy, normalizeRoutePath } from "@/lib/ads/route-eligibility"

const MONUMETRIC_ENABLED = process.env.NEXT_PUBLIC_MONUMETRIC_ENABLED === "true"
const MONUMETRIC_SCRIPT_ID = "pc-monumetric-delivery-script"
const MONUMETRIC_SCRIPT_SRC = "https://monu.delivery/site/1/d/65ab12-7f57-43c6-a5b7-76b6b4c6548c.js"
const AD_NODE_SELECTORS = [
  "#mmt-sticky-header-div",
  "#mmt-sticky-footer-div",
  "[id^='mmt-']",
  "iframe[id*='google_ads_iframe']",
  "iframe[src*='doubleclick']",
  "iframe[src*='googlesyndication']",
  "iframe[src*='adnxs']",
  "iframe[src*='lijit']",
  "iframe[src*='pubmatic']",
  "iframe[src*='rubiconproject']",
].join(", ")

function ensureMonumetricScript(): void {
  if (document.getElementById(MONUMETRIC_SCRIPT_ID)) {
    return
  }

  const script = document.createElement("script")
  script.id = MONUMETRIC_SCRIPT_ID
  script.type = "text/javascript"
  script.src = MONUMETRIC_SCRIPT_SRC
  script.setAttribute("data-cfasync", "false")
  script.async = true
  document.head.appendChild(script)
}

function disableMonumetricRuntime(): void {
  const runtime = window.$MMT
  if (!runtime) return

  try {
    runtime.stopRefresh?.()
  } catch {
    // Runtime shutdown is best effort only.
  }
}

function cleanupAdNodesOnExcludedRoute(): void {
  for (const node of document.querySelectorAll(AD_NODE_SELECTORS)) {
    node.remove()
  }
}

export function MonumetricScriptGate() {
  const pathname = usePathname() ?? "/"

  useEffect(() => {
    if (!MONUMETRIC_ENABLED || process.env.PLAYWRIGHT === "1") {
      return
    }

    const normalizedPath = normalizeRoutePath(pathname)
    const isEligible = getAdRoutePolicy(normalizedPath).eligibility === "allow"

    if (isEligible) {
      ensureMonumetricScript()
      return
    }

    disableMonumetricRuntime()
    cleanupAdNodesOnExcludedRoute()
  }, [pathname])

  return null
}
