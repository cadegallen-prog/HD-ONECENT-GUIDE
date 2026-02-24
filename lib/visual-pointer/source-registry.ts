import type { SourceAnchorMeta } from "@/lib/visual-pointer/types"

/**
 * Explicit mapping from data-pc-id values to their source component location.
 *
 * This registry is maintained manually so that AI agents receiving a capture
 * packet can jump directly to the file and line that owns the target element.
 *
 * Convention: pcId format is "<route>.<surface>.<element>"
 */

const REGISTRY: Record<string, Omit<SourceAnchorMeta, "pcId">> = {
  // ── /penny-list ──────────────────────────────────────────────
  "penny-list.search-input": {
    route: "/penny-list",
    component: "PennyListFilters",
    file: "components/penny-list-filters.tsx",
    line: 274,
  },
  "penny-list.state-filter": {
    route: "/penny-list",
    component: "PennyListFilters",
    file: "components/penny-list-filters.tsx",
    line: 187,
  },
  "penny-list.sort-trigger": {
    route: "/penny-list",
    component: "PennyListFilters",
    file: "components/penny-list-filters.tsx",
    line: 323,
  },
  "penny-list.report-cta": {
    route: "/penny-list",
    component: "PennyListClient",
    file: "components/penny-list-client.tsx",
    line: 1145,
  },
  "penny-list.pagination-prev": {
    route: "/penny-list",
    component: "PennyListClient",
    file: "components/penny-list-client.tsx",
    line: 942,
  },
  "penny-list.pagination-next": {
    route: "/penny-list",
    component: "PennyListClient",
    file: "components/penny-list-client.tsx",
    line: 955,
  },
  "penny-list.card-sku": {
    route: "/penny-list",
    component: "PennyListCard",
    file: "components/penny-list-card.tsx",
    line: 196,
  },
  "penny-list.card-report-action": {
    route: "/penny-list",
    component: "PennyListCard",
    file: "components/penny-list-card.tsx",
    line: 268,
  },

  // ── /store-finder ────────────────────────────────────────────
  "store-finder.search-input": {
    route: "/store-finder",
    component: "StoreFinderPage",
    file: "app/store-finder/page.tsx",
    line: 954,
  },
  "store-finder.search-submit": {
    route: "/store-finder",
    component: "StoreFinderPage",
    file: "app/store-finder/page.tsx",
    line: 965,
  },
  "store-finder.locate-recenter": {
    route: "/store-finder",
    component: "StoreFinderPage",
    file: "app/store-finder/page.tsx",
    line: 977,
  },
  "store-finder.view-map": {
    route: "/store-finder",
    component: "StoreFinderPage",
    file: "app/store-finder/page.tsx",
    line: 1035,
  },
  "store-finder.view-list": {
    route: "/store-finder",
    component: "StoreFinderPage",
    file: "app/store-finder/page.tsx",
    line: 1048,
  },
  "store-finder.list-item": {
    route: "/store-finder",
    component: "StoreFinderPage",
    file: "app/store-finder/page.tsx",
    line: 1205,
  },
  "store-finder.popup-directions": {
    route: "/store-finder",
    component: "StoreMap",
    file: "components/store-map.tsx",
    line: 598,
  },
  "store-finder.popup-directions-mobile": {
    route: "/store-finder",
    component: "StoreMap",
    file: "components/store-map.tsx",
    line: 512,
  },
  "store-finder.popup-store-page": {
    route: "/store-finder",
    component: "StoreMap",
    file: "components/store-map.tsx",
    line: 611,
  },
}

export function lookupSource(pcId: string): SourceAnchorMeta | "source_unavailable" {
  const entry = REGISTRY[pcId]
  if (!entry) {
    return "source_unavailable"
  }
  return { pcId, ...entry }
}

export function getAllRegisteredIds(): string[] {
  return Object.keys(REGISTRY)
}
