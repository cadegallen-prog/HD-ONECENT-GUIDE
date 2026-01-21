"use client"

import { useEffect, useState, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Loader2,
  Filter,
  Search,
  EyeOff,
  CheckCircle2,
  Star,
  Share2,
  Check,
  Store,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ListItemCard } from "@/components/list-item-card"
import { copyToClipboard } from "@/components/copy-sku-button"
import {
  getListWithItems,
  createShareToken,
  setActiveListId,
  type ListWithItems,
} from "@/lib/supabase/lists"
import { trackEvent } from "@/lib/analytics"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { toast } from "sonner"

interface ListDetailPageProps {
  params: Promise<{ id: string }>
}

type FilterMode = "all" | "must" | "hide_found" | "hide_ignored"

export default function ListDetailPage({ params }: ListDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [list, setList] = useState<ListWithItems | null>(null)
  const [pennyItems, setPennyItems] = useState<Record<string, PennyItem>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [sharing, setSharing] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [inStoreMode, setInStoreMode] = useState(false)

  // Load in-store mode preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("pennycentral_in_store_mode")
    if (stored === "true") {
      setInStoreMode(true)
    }
  }, [])

  const toggleInStoreMode = () => {
    const newValue = !inStoreMode
    setInStoreMode(newValue)
    localStorage.setItem("pennycentral_in_store_mode", String(newValue))
    trackEvent(newValue ? "in_store_mode_enabled" : "in_store_mode_disabled", { listId: id })
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/lists/${id}`)
    }
  }, [authLoading, user, router, id])

  // Load list and penny data
  const loadData = useCallback(async () => {
    try {
      const listData = await getListWithItems(id)
      if (!listData) {
        toast.error("List not found")
        router.replace("/lists")
        return
      }
      setList(listData)

      // Set this list as the active list (Phase 3: active list tracking)
      setActiveListId(id)

      // Fetch penny data to enrich items with names/images via API
      // Phase 3: Use skus= parameter for efficient, targeted enrichment
      if (listData.items.length > 0) {
        try {
          const skus = listData.items.map((item) => item.sku).join(",")
          const response = await fetch(
            `/api/penny-list?skus=${encodeURIComponent(skus)}&includeHot=0`
          )
          if (response.ok) {
            const data = await response.json()
            const pennyMap: Record<string, PennyItem> = {}
            ;(data.items || []).forEach((item: PennyItem) => {
              pennyMap[item.sku] = item
            })
            setPennyItems(pennyMap)
          }
        } catch (error) {
          console.warn("Failed to fetch penny data for enrichment:", error)
          // Continue without enrichment
        }
      }
    } catch (error) {
      console.error("Failed to load list:", error)
      toast.error("Failed to load list")
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  const handleItemRemove = (itemId: string) => {
    setList((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((i) => i.id !== itemId),
          }
        : null
    )
  }

  const handleShare = async () => {
    if (!list) return
    setSharing(true)

    try {
      const token = await createShareToken(list.id)
      const shareUrl = `${window.location.origin}/s/${token}`
      const success = await copyToClipboard(shareUrl)

      if (success) {
        trackEvent("share_link_copied", { listId: list.id })
        setShareCopied(true)
        toast.success("Share link copied!", {
          description: "Anyone with this link can view your list",
        })
        setTimeout(() => setShareCopied(false), 3000)
      }
    } catch (error) {
      console.error("Failed to create share link:", error)
      toast.error("Failed to create share link")
    } finally {
      setSharing(false)
    }
  }

  // Filter and search items
  const filteredItems = (list?.items || []).filter((item) => {
    // Filter mode
    if (filterMode === "must" && item.priority !== "must") return false
    if (filterMode === "hide_found" && item.found_status === "found") return false
    if (filterMode === "hide_ignored" && item.priority === "ignore") return false

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const pennyData = pennyItems[item.sku]
      const name = pennyData?.name || ""
      if (!item.sku.includes(query) && !name.toLowerCase().includes(query)) {
        return false
      }
    }

    return true
  })

  // Group items: Ignored at bottom
  const activeItems = filteredItems.filter((i) => i.priority !== "ignore")
  const ignoredItems = filteredItems.filter((i) => i.priority === "ignore")

  // Stats
  const totalItems = list?.items.length || 0
  const mustHitCount = list?.items.filter((i) => i.priority === "must").length || 0
  const foundCount = list?.items.filter((i) => i.found_status === "found").length || 0

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
      </div>
    )
  }

  if (!list) {
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/lists"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Lists</span>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{list.title}</h1>
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing || totalItems === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                shareCopied
                  ? "bg-[color-mix(in_srgb,var(--status-success)_18%,var(--bg-card))] text-[var(--status-success)]"
                  : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              } disabled:opacity-50`}
              title={totalItems === 0 ? "Add items to share" : "Share this list"}
            >
              {sharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : shareCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {shareCopied ? "Copied!" : "Share"}
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--text-muted)]">
            <span>
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
            {mustHitCount > 0 && (
              <span className="flex items-center gap-1 text-[var(--status-warning)]">
                <Star className="w-3.5 h-3.5" />
                {mustHitCount} must-hit
              </span>
            )}
            {foundCount > 0 && (
              <span className="flex items-center gap-1 text-[var(--status-success)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {foundCount} found
              </span>
            )}
          </div>

          {/* In-Store Mode Toggle */}
          {totalItems > 0 && (
            <button
              type="button"
              onClick={toggleInStoreMode}
              className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                inStoreMode
                  ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                  : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              }`}
              aria-pressed={inStoreMode ? "true" : "false"}
            >
              <Store className="w-4 h-4" />
              In-Store Mode {inStoreMode ? "ON" : "OFF"}
            </button>
          )}
        </div>

        {/* Search and Filter */}
        {totalItems > 0 && (
          <div className="mb-6 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[var(--text-muted)] flex items-center gap-1.5">
                <Filter className="w-4 h-4" />
                Filter:
              </span>
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterMode === "all"
                    ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                    : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode("must")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  filterMode === "must"
                    ? "bg-[var(--status-warning)] text-[var(--cta-text)]"
                    : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <Star className="w-3 h-3" />
                Must-hit only
              </button>
              <button
                onClick={() => setFilterMode("hide_found")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  filterMode === "hide_found"
                    ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                    : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                Hide found
              </button>
              <button
                onClick={() => setFilterMode("hide_ignored")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  filterMode === "hide_ignored"
                    ? "bg-[var(--cta-primary)] text-[var(--cta-text)]"
                    : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <EyeOff className="w-3 h-3" />
                Hide ignored
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalItems === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-muted)] mb-4">
              <Star className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              This list is empty
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              Save items from the Penny List to add them here
            </p>
            <Link
              href="/penny-list"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 transition-opacity"
            >
              Browse Penny List
            </Link>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">
              No items match your filters.{" "}
              <button
                onClick={() => {
                  setSearchQuery("")
                  setFilterMode("all")
                }}
                className="text-[var(--link-default)] hover:underline"
              >
                Clear filters
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Active items */}
            {activeItems.map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                pennyData={pennyItems[item.sku]}
                onRemove={handleItemRemove}
                onUpdate={loadData}
                inStoreMode={inStoreMode}
              />
            ))}

            {/* Ignored items section */}
            {ignoredItems.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() =>
                    setFilterMode(filterMode === "hide_ignored" ? "all" : "hide_ignored")
                  }
                  className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-3 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>
                    Ignored ({ignoredItems.length}){" "}
                    {filterMode === "hide_ignored" ? "- click to show" : ""}
                  </span>
                </button>
                {filterMode !== "hide_ignored" && (
                  <div className="space-y-3">
                    {ignoredItems.map((item) => (
                      <ListItemCard
                        key={item.id}
                        item={item}
                        pennyData={pennyItems[item.sku]}
                        onRemove={handleItemRemove}
                        onUpdate={loadData}
                        inStoreMode={inStoreMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add more items CTA */}
        {totalItems > 0 && (
          <div className="mt-8 text-center">
            <Link href="/penny-list" className="text-[var(--link-default)] hover:underline text-sm">
              Add more items from Penny List
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
