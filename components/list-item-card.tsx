"use client"

import { useState, useCallback } from "react"
import {
  Copy,
  Check,
  Trash2,
  Star,
  CircleDashed,
  CheckCircle2,
  XCircle,
  EyeOff,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { copyToClipboard } from "@/components/copy-sku-button"
import { PennyThumbnail } from "@/components/penny-thumbnail"
import { formatSkuForDisplay } from "@/lib/sku"
import { trackEvent } from "@/lib/analytics"
import {
  updateItemPriority,
  updateItemFoundStatus,
  removeItemFromList,
  type ListItem,
} from "@/lib/supabase/lists"
import type { PennyItem } from "@/lib/fetch-penny-data"
import type { KeyboardEvent, MouseEvent } from "react"

interface ListItemCardProps {
  item: ListItem
  pennyData?: PennyItem | null
  onRemove?: (itemId: string) => void
  onUpdate?: () => void
  inStoreMode?: boolean
}

const PRIORITY_CYCLE: Array<ListItem["priority"]> = ["maybe", "must", "ignore"]
const FOUND_CYCLE: Array<ListItem["found_status"]> = ["unknown", "found", "not_found"]

const PRIORITY_CONFIG = {
  maybe: {
    label: "Maybe",
    icon: CircleDashed,
    className: "text-[var(--text-muted)] bg-[var(--bg-muted)]",
  },
  must: {
    label: "Must-hit",
    icon: Star,
    className:
      "text-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_18%,var(--bg-card))]",
  },
  ignore: {
    label: "Ignore",
    icon: EyeOff,
    className: "text-[var(--text-muted)] bg-[var(--bg-muted)] opacity-60",
  },
}

const FOUND_CONFIG = {
  unknown: {
    label: "Unknown",
    icon: CircleDashed,
    className: "text-[var(--text-muted)] border-[var(--border-default)]",
  },
  found: {
    label: "Found",
    icon: CheckCircle2,
    className: "text-[var(--status-success)] border-[var(--status-success)]",
  },
  not_found: {
    label: "Not found",
    icon: XCircle,
    className: "text-[var(--status-error)] border-[var(--status-error)]",
  },
}

export function ListItemCard({
  item,
  pennyData,
  onRemove,
  onUpdate,
  inStoreMode = false,
}: ListItemCardProps) {
  const [copied, setCopied] = useState(false)
  const [priority, setPriority] = useState(item.priority)
  const [foundStatus, setFoundStatus] = useState(item.found_status)
  const [removing, setRemoving] = useState(false)
  const [updating, setUpdating] = useState(false)

  const skuPageUrl = `/sku/${item.sku}`
  const itemName = pennyData?.name || `SKU ${formatSkuForDisplay(item.sku)}`

  const handleSkuCopy = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const success = await copyToClipboard(item.sku)
      if (success) {
        const skuMasked = item.sku.slice(-4)
        trackEvent("sku_copy", { skuMasked, ui_source: "list-item" })
        setCopied(true)
        toast.success(`Copied SKU ${formatSkuForDisplay(item.sku)}`, { duration: 2000 })
        setTimeout(() => setCopied(false), 1500)
      } else {
        toast.error("Failed to copy SKU", { duration: 2000 })
      }
    },
    [item.sku]
  )

  const handlePriorityCycle = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (updating) return

    const currentIndex = PRIORITY_CYCLE.indexOf(priority)
    const nextPriority = PRIORITY_CYCLE[(currentIndex + 1) % PRIORITY_CYCLE.length]

    setUpdating(true)
    setPriority(nextPriority)

    try {
      await updateItemPriority(item.id, nextPriority)
      trackEvent("priority_changed", { sku: item.sku, priority: nextPriority })
      onUpdate?.()
    } catch (error) {
      console.error("Failed to update priority:", error)
      setPriority(priority) // Revert
      toast.error("Failed to update priority")
    } finally {
      setUpdating(false)
    }
  }

  const handleFoundCycle = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (updating) return

    const currentIndex = FOUND_CYCLE.indexOf(foundStatus)
    const nextStatus = FOUND_CYCLE[(currentIndex + 1) % FOUND_CYCLE.length]

    setUpdating(true)
    setFoundStatus(nextStatus)

    try {
      await updateItemFoundStatus(item.id, nextStatus)
      trackEvent("found_status_changed", { sku: item.sku, status: nextStatus })
      onUpdate?.()
    } catch (error) {
      console.error("Failed to update found status:", error)
      setFoundStatus(foundStatus) // Revert
      toast.error("Failed to update status")
    } finally {
      setUpdating(false)
    }
  }

  const handleRemove = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (removing) return

    setRemoving(true)
    try {
      await removeItemFromList(item.id)
      trackEvent("list_item_removed", { sku: item.sku })
      toast.success("Item removed from list")
      onRemove?.(item.id)
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast.error("Failed to remove item")
    } finally {
      setRemoving(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      window.location.href = skuPageUrl
    }
  }

  const priorityConfig = PRIORITY_CONFIG[priority]
  const foundConfig = FOUND_CONFIG[foundStatus]
  const PriorityIcon = priorityConfig.icon
  const FoundIcon = foundConfig.icon

  // Dim the card if ignored
  const isIgnored = priority === "ignore"

  // In-Store Mode: Simplified, large-touch layout
  if (inStoreMode) {
    return (
      <div
        className={`rounded-xl border-2 ${
          foundStatus === "found"
            ? "border-[var(--status-success)] bg-[color-mix(in_srgb,var(--status-success)_18%,var(--bg-card))]"
            : priority === "must"
              ? "border-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_18%,var(--bg-card))]"
              : "border-[var(--border-strong)] bg-[var(--bg-card)]"
        } ${isIgnored ? "opacity-40" : ""} overflow-hidden transition-all`}
      >
        {/* Large SKU copy button - full width tap target */}
        <button
          type="button"
          onClick={handleSkuCopy}
          className="w-full p-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-hover)] transition-colors min-h-[60px]"
          aria-label={`Copy SKU ${item.sku} to clipboard`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">
              {formatSkuForDisplay(item.sku)}
            </span>
            {priority === "must" && (
              <Star
                className="w-5 h-5 text-[var(--status-warning)] flex-shrink-0"
                aria-label="Must-hit"
              />
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {copied ? (
              <Check className="w-6 h-6 text-[var(--status-success)]" />
            ) : (
              <Copy className="w-6 h-6 text-[var(--text-muted)]" />
            )}
          </div>
        </button>

        {/* Item name (truncated) */}
        <div className="px-4 pb-2 text-sm text-[var(--text-muted)] truncate">{itemName}</div>

        {/* Large action buttons */}
        <div className="flex border-t border-[var(--border-default)]">
          {/* Found toggle */}
          <button
            type="button"
            onClick={handleFoundCycle}
            disabled={updating}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-base font-medium transition-colors min-h-[52px] ${
              foundStatus === "found"
                ? "bg-[var(--status-success)] text-[var(--cta-text)]"
                : foundStatus === "not_found"
                  ? "bg-[color-mix(in_srgb,var(--status-error)_18%,var(--bg-card))] text-[var(--status-error)]"
                  : "bg-[var(--bg-muted)] text-[var(--text-primary)]"
            }`}
            aria-label={`Status: ${foundConfig.label}. Tap to change.`}
          >
            <FoundIcon className="w-5 h-5" />
            {foundConfig.label}
          </button>

          {/* Priority toggle */}
          <button
            type="button"
            onClick={handlePriorityCycle}
            disabled={updating}
            className={`px-4 py-4 flex items-center justify-center border-l border-[var(--border-default)] transition-colors min-h-[52px] ${
              priority === "must"
                ? "bg-[var(--status-warning)] text-[var(--cta-text)]"
                : priority === "ignore"
                  ? "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                  : "bg-[var(--bg-card)] text-[var(--text-primary)]"
            }`}
            aria-label={`Priority: ${priorityConfig.label}. Tap to change.`}
          >
            <PriorityIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // Default layout
  return (
    <div
      role="link"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`rounded-xl border border-[var(--border-strong)] elevation-card overflow-hidden transition-all ${
        isIgnored ? "opacity-60" : ""
      }`}
      aria-label={`${itemName} - ${priorityConfig.label}, ${foundConfig.label}`}
    >
      <div className="p-4">
        <div className="flex gap-3 items-start">
          {/* Thumbnail */}
          <Link
            href={skuPageUrl}
            prefetch={false}
            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] rounded flex-shrink-0"
          >
            <PennyThumbnail src={pennyData?.imageUrl} alt={itemName} size={48} />
          </Link>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <Link href={skuPageUrl} prefetch={false}>
              <h3
                className="font-semibold text-[var(--text-primary)] leading-tight truncate hover:text-[var(--cta-primary)] transition-colors"
                title={itemName}
              >
                {itemName}
              </h3>
            </Link>

            {/* SKU copy button */}
            <button
              type="button"
              onClick={handleSkuCopy}
              className="mt-2 flex items-center gap-2 text-xs text-[var(--text-primary)] font-mono elevation-2 border border-[var(--border-strong)] px-2.5 py-1.5 rounded w-fit font-medium cursor-pointer hover:border-[var(--cta-primary)] hover:bg-[var(--bg-hover)] transition-colors min-h-[36px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              aria-label={`Copy SKU ${item.sku} to clipboard`}
              title="Tap to copy SKU"
            >
              <span>SKU:</span>
              <span className="font-semibold">{formatSkuForDisplay(item.sku)}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--status-success)]" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[color-mix(in_srgb,var(--status-error)_10%,var(--bg-muted))] transition-colors disabled:opacity-50 flex-shrink-0"
            aria-label="Remove from list"
          >
            {removing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Controls row */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {/* Priority toggle */}
          <button
            type="button"
            onClick={handlePriorityCycle}
            disabled={updating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${priorityConfig.className}`}
            aria-label={`Priority: ${priorityConfig.label}. Click to change.`}
            title={`Priority: ${priorityConfig.label}`}
          >
            <PriorityIcon className="w-3.5 h-3.5" aria-hidden="true" />
            {priorityConfig.label}
          </button>

          {/* Found status toggle */}
          <button
            type="button"
            onClick={handleFoundCycle}
            disabled={updating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${foundConfig.className}`}
            aria-label={`Status: ${foundConfig.label}. Click to change.`}
            title={`Status: ${foundConfig.label}`}
          >
            <FoundIcon className="w-3.5 h-3.5" aria-hidden="true" />
            {foundConfig.label}
          </button>
        </div>

        {/* Notes (if any) */}
        {item.notes && <p className="mt-3 text-sm text-[var(--text-muted)] italic">{item.notes}</p>}
      </div>
    </div>
  )
}
