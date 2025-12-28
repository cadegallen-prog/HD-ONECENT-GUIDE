"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bookmark, BookmarkCheck, Plus, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import {
  getUserLists,
  addItemToList,
  createList,
  addSkuToListSmart,
  type List,
} from "@/lib/supabase/lists"
import { trackEvent } from "@/lib/analytics"
import { formatSkuForDisplay } from "@/lib/sku"

interface AddToListButtonProps {
  sku: string
  itemName: string
  variant?: "icon" | "button"
  className?: string
}

export function AddToListButton({
  sku,
  itemName,
  variant = "icon",
  className = "",
}: AddToListButtonProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [lists, setLists] = useState<List[]>([])
  const [newListName, setNewListName] = useState("")
  const [creatingList, setCreatingList] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPicker])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If not logged in, redirect to login
    if (!user) {
      trackEvent("add_to_list_clicked", { sku, authenticated: false })
      const currentPath = window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    trackEvent("add_to_list_clicked", { sku, authenticated: true })

    setLoading(true)

    try {
      // Try smart add (auto-handles 0 or 1 list cases)
      const result = await addSkuToListSmart(sku)

      if (result) {
        // Added successfully
        setSaved(true)
        trackEvent("add_to_list_completed", { sku, listId: result.list.id })
        toast.success(`Added to "${result.list.title}"`, {
          description: `SKU ${formatSkuForDisplay(sku)}`,
          duration: 3000,
          action: {
            label: "View list",
            onClick: () => router.push(`/lists/${result.list.id}`),
          },
        })
        // Reset saved state after a bit
        setTimeout(() => setSaved(false), 3000)
      } else {
        // Multiple lists - show picker
        const userLists = await getUserLists()
        setLists(userLists)
        setShowPicker(true)
      }
    } catch (error) {
      console.error("Failed to add to list:", error)
      if (error instanceof Error && error.message.includes("already in your list")) {
        toast.info("This item is already in your list")
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to add to list")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToList = async (listId: string) => {
    setLoading(true)
    try {
      await addItemToList(listId, sku)
      const list = lists.find((l) => l.id === listId)
      setSaved(true)
      trackEvent("add_to_list_completed", { sku, listId })
      toast.success(`Added to "${list?.title || "list"}"`, {
        description: `SKU ${formatSkuForDisplay(sku)}`,
        duration: 3000,
        action: {
          label: "View list",
          onClick: () => router.push(`/lists/${listId}`),
        },
      })
      setShowPicker(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Failed to add to list:", error)
      if (error instanceof Error && error.message.includes("already in your list")) {
        toast.info("This item is already in that list")
        setSaved(true)
        setShowPicker(false)
        setTimeout(() => setSaved(false), 3000)
      } else {
        toast.error("Failed to add to list")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAndAdd = async () => {
    if (!newListName.trim()) return

    setCreatingList(true)
    try {
      const newList = await createList(newListName.trim())
      await addItemToList(newList.id, sku)
      setSaved(true)
      trackEvent("add_to_list_completed", { sku, listId: newList.id, newList: true })
      toast.success(`Added to "${newList.title}"`, {
        description: `SKU ${formatSkuForDisplay(sku)}`,
        duration: 3000,
        action: {
          label: "View list",
          onClick: () => router.push(`/lists/${newList.id}`),
        },
      })
      setShowPicker(false)
      setNewListName("")
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Failed to create list:", error)
      toast.error("Failed to create list")
    } finally {
      setCreatingList(false)
    }
  }

  if (authLoading) {
    return null
  }

  const Icon = saved ? BookmarkCheck : Bookmark
  const isLoading = loading || creatingList

  if (variant === "icon") {
    return (
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
            saved
              ? "text-[var(--cta-primary)] bg-[var(--cta-primary)]/10"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
          } ${className}`}
          aria-label={saved ? "Saved to list" : `Save ${itemName} to list`}
          title={saved ? "Saved to list" : "Save to list"}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
        </button>

        {/* List picker dropdown */}
        {showPicker && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b border-[var(--border-default)]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-[var(--text-primary)]">Save to list</span>
                <button
                  onClick={() => setShowPicker(false)}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleAddToList(list.id)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{list.title}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-2">
                    {list.item_count || 0} items
                  </span>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-[var(--border-default)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list name..."
                  maxLength={100}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateAndAdd()
                  }}
                />
                <button
                  onClick={handleCreateAndAdd}
                  disabled={!newListName.trim() || creatingList}
                  className="px-3 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] disabled:opacity-50"
                >
                  {creatingList ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Button variant
  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
          saved
            ? "bg-[var(--cta-primary)]/10 text-[var(--cta-primary)]"
            : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
        } ${className}`}
        aria-label={saved ? "Saved to list" : `Save ${itemName} to list`}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
        {saved ? "Saved" : "Save"}
      </button>

      {/* List picker dropdown - same as icon variant */}
      {showPicker && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-[var(--border-default)]">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-[var(--text-primary)]">Save to list</span>
              <button
                onClick={() => setShowPicker(false)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => handleAddToList(list.id)}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors flex items-center justify-between"
              >
                <span className="truncate">{list.title}</span>
                <span className="text-xs text-[var(--text-muted)] ml-2">
                  {list.item_count || 0} items
                </span>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-[var(--border-default)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New list name..."
                maxLength={100}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateAndAdd()
                }}
              />
              <button
                onClick={handleCreateAndAdd}
                disabled={!newListName.trim() || creatingList}
                className="px-3 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] disabled:opacity-50"
              >
                {creatingList ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
