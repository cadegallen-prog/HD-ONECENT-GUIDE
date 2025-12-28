"use client"

import { useEffect, useState, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Copy, Check, Loader2, BookmarkPlus, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { PennyThumbnail } from "@/components/penny-thumbnail"
import { copyToClipboard } from "@/components/copy-sku-button"
import { getSharedList, forkSharedList, type SharedListData } from "@/lib/supabase/lists"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { formatSkuForDisplay } from "@/lib/sku"
import { getHomeDepotProductUrl } from "@/lib/home-depot"
import { trackEvent } from "@/lib/analytics"

interface SharedListPageProps {
  params: Promise<{ token: string }>
}

export default function SharedListPage({ params }: SharedListPageProps) {
  const { token } = use(params)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [list, setList] = useState<SharedListData | null>(null)
  const [pennyItems, setPennyItems] = useState<Record<string, PennyItem>>({})
  const [loading, setLoading] = useState(true)
  const [forking, setForking] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Load shared list
  const loadData = useCallback(async () => {
    try {
      const listData = await getSharedList(token)
      if (!listData) {
        setNotFound(true)
        return
      }
      setList(listData)
      trackEvent("shared_list_viewed", { token: token.slice(0, 4) })

      // Fetch penny data for enrichment
      if (listData.items.length > 0) {
        try {
          const response = await fetch("/api/penny-list?perPage=1000")
          if (response.ok) {
            const data = await response.json()
            const pennyMap: Record<string, PennyItem> = {}
            ;(data.items || []).forEach((item: PennyItem) => {
              pennyMap[item.sku] = item
            })
            setPennyItems(pennyMap)
          }
        } catch (error) {
          console.warn("Failed to fetch penny data:", error)
        }
      }
    } catch (error) {
      console.error("Failed to load shared list:", error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFork = async () => {
    if (!user) {
      trackEvent("save_copy_clicked", { token: token.slice(0, 4), authenticated: false })
      router.push(`/login?redirect=/s/${token}`)
      return
    }

    trackEvent("save_copy_clicked", { token: token.slice(0, 4), authenticated: true })
    setForking(true)

    try {
      const newListId = await forkSharedList(token)
      trackEvent("save_copy_completed", { token: token.slice(0, 4) })
      toast.success("List saved to your account!")
      router.push(`/lists/${newListId}`)
    } catch (error) {
      console.error("Failed to fork list:", error)
      toast.error("Failed to save list")
    } finally {
      setForking(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">List not found</h1>
          <p className="text-[var(--text-muted)] mb-6">
            This shared list may have been deleted or the link is invalid.
          </p>
          <Link
            href="/penny-list"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 transition-opacity"
          >
            Browse Penny List
          </Link>
        </div>
      </div>
    )
  }

  if (!list) return null

  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Banner */}
        <div className="mb-6 p-4 bg-[var(--bg-muted)] rounded-xl border border-[var(--border-default)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">Shared penny list</p>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">{list.title}</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {list.item_count} item{list.item_count !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleFork}
              disabled={forking}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
            >
              {forking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BookmarkPlus className="w-4 h-4" />
              )}
              Save a Copy
            </button>
          </div>
        </div>

        {/* Items */}
        {list.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">This list is empty.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.items.map((item) => (
              <SharedListItemCard key={item.id} item={item} pennyData={pennyItems[item.sku]} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={handleFork}
            disabled={forking}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {forking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <BookmarkPlus className="w-5 h-5" />
            )}
            Save a Copy to My Lists
          </button>
          <p className="text-sm text-[var(--text-muted)]">
            Save this list to track your own progress and mark items as found
          </p>
        </div>
      </div>
    </div>
  )
}

// Read-only item card for shared view
function SharedListItemCard({
  item,
  pennyData,
}: {
  item: SharedListData["items"][0]
  pennyData?: PennyItem
}) {
  const [copied, setCopied] = useState(false)

  const itemName = pennyData?.name || `SKU ${formatSkuForDisplay(item.sku)}`
  const skuPageUrl = `/sku/${item.sku}`
  const homeDepotUrl = getHomeDepotProductUrl({
    sku: item.sku,
    internetNumber: pennyData?.internetNumber,
    homeDepotUrl: pennyData?.homeDepotUrl,
  })

  const handleCopy = async () => {
    const success = await copyToClipboard(item.sku)
    if (success) {
      trackEvent("sku_copy", { skuMasked: item.sku.slice(-4), source: "shared-list" })
      setCopied(true)
      toast.success(`Copied SKU ${formatSkuForDisplay(item.sku)}`, { duration: 2000 })
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-strong)] elevation-card p-4">
      <div className="flex gap-3 items-start">
        <Link
          href={skuPageUrl}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded flex-shrink-0"
        >
          <PennyThumbnail src={pennyData?.imageUrl} alt={itemName} size={48} />
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={skuPageUrl}>
            <h3
              className="font-semibold text-[var(--text-primary)] leading-tight truncate hover:text-[var(--cta-primary)] transition-colors"
              title={itemName}
            >
              {itemName}
            </h3>
          </Link>

          {/* Priority badge */}
          {item.priority === "must" && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[color-mix(in_srgb,var(--status-warning)_18%,var(--bg-card))] text-[var(--status-warning)]">
              Must-hit
            </span>
          )}

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {/* SKU copy */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-page)] hover:border-[var(--cta-primary)] transition-colors"
            >
              <span className="text-[var(--text-muted)]">SKU:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {formatSkuForDisplay(item.sku)}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--status-success)]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              )}
            </button>

            {/* HD link */}
            <a
              href={homeDepotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[var(--text-primary)] hover:text-[var(--cta-primary)] transition-colors"
            >
              Home Depot
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="mt-2 text-sm text-[var(--text-muted)] italic">{item.notes}</p>
          )}
        </div>
      </div>
    </div>
  )
}
