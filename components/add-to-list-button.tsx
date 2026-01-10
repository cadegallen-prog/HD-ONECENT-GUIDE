"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bookmark, BookmarkCheck, Plus, Loader2, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  getUserLists,
  addItemToList,
  createList,
  addSkuToListSmart,
  isItemInAnyList,
  removeItemFromListBySku,
  type List,
} from "@/lib/supabase/lists"
import { trackEvent } from "@/lib/analytics"
import { SaveToast } from "@/components/ui/save-toast"

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
  const [itemInfo, setItemInfo] = useState<{ inList: boolean; listId?: string; itemId?: string }>({
    inList: false,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"added" | "removed">("added")
  const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 })
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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

  // Check if item is already saved when component mounts or SKU changes
  useEffect(() => {
    const checkItemStatus = async () => {
      if (user && sku) {
        try {
          const info = await isItemInAnyList(sku)
          setItemInfo(info)
          setSaved(info.inList)
        } catch (error) {
          console.error("Failed to check item status:", error)
        }
      }
    }

    checkItemStatus()
  }, [user, sku])

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

    // Calculate toast position near the button
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setToastPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10, // Position above the button
      })
    }

    setLoading(true)

    try {
      if (saved && itemInfo.inList) {
        // Item is already saved - remove it
        await removeItemFromListBySku(sku)
        setSaved(false)
        setItemInfo({ inList: false })
        trackEvent("list_item_removed", { sku })
        setToastMessage("Item removed from your list")
        setToastType("removed")
        setShowToast(true)
      } else {
        // Item is not saved - add it
        // Try smart add (auto-handles 0 or 1 list cases)
        const result = await addSkuToListSmart(sku)

        if (result) {
          // Added successfully
          setSaved(true)
          setItemInfo({ inList: true, listId: result.list.id, itemId: result.item.id })
          trackEvent("add_to_list_completed", { sku, listId: result.list.id })
          setToastMessage("Item added to your list")
          setToastType("added")
          setShowToast(true)
        } else {
          // Multiple lists - show picker
          const userLists = await getUserLists()
          setLists(userLists)
          setShowPicker(true)
        }
      }
    } catch (error) {
      console.error("Failed to toggle item in list:", error)
      if (error instanceof Error && error.message.includes("already in your list")) {
        // Silently handle "already in list" errors - no error message shown to user
        setSaved(true)
        setItemInfo({ inList: true })
        setToastMessage("Item added to your list")
        setToastType("added")
        setShowToast(true)
      } else {
        // Only show error for actual failures
        setToastMessage("Failed to update list")
        setToastType("removed") // Use removed styling for errors
        setShowToast(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToList = async (listId: string) => {
    setLoading(true)
    try {
      await addItemToList(listId, sku)
      setSaved(true)
      setItemInfo({ inList: true, listId, itemId: undefined }) // itemId would be set by server response
      trackEvent("add_to_list_completed", { sku, listId })
      setToastMessage("Item added to your list")
      setToastType("added")
      setShowToast(true)
      setShowPicker(false)
    } catch (error) {
      console.error("Failed to add to list:", error)
      if (error instanceof Error && error.message.includes("already in your list")) {
        setSaved(true)
        setItemInfo({ inList: true, listId })
        setToastMessage("Item added to your list")
        setToastType("added")
        setShowToast(true)
      } else {
        setToastMessage("Failed to add to list")
        setToastType("removed") // Use removed styling for errors
        setShowToast(true)
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
      setItemInfo({ inList: true, listId: newList.id, itemId: undefined })
      trackEvent("add_to_list_completed", { sku, listId: newList.id, newList: true })
      setToastMessage("Item added to your list")
      setToastType("added")
      setShowToast(true)
      setShowPicker(false)
      setNewListName("")
    } catch (error) {
      console.error("Failed to create list:", error)
      setToastMessage("Failed to create list")
      setToastType("removed") // Use removed styling for errors
      setShowToast(true)
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
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
            saved
              ? "text-[var(--cta-primary)] bg-[var(--cta-primary)]/10"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
          } ${className}`}
          aria-label={saved ? "Remove from list" : `Save ${itemName} to list`}
          title={saved ? "Remove from list" : "Save to list"}
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
                  title="Close"
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
                  title="Create list"
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

        {/* Custom toast notification */}
        <SaveToast
          show={showToast}
          message={toastMessage}
          type={toastType}
          position={toastPosition}
          onClose={() => setShowToast(false)}
        />
      </div>
    )
  }

  // Button variant
  return (
    <div className="relative" ref={pickerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
          saved
            ? "bg-[var(--cta-primary)]/10 text-[var(--cta-primary)]"
            : "bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
        } ${className}`}
        aria-label={saved ? "Remove from list" : `Save ${itemName} to list`}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
        {saved ? "Remove" : "Save"}
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
                title="Close"
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
                title="Create list"
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

      {/* Custom toast notification */}
      <SaveToast
        show={showToast}
        message={toastMessage}
        type={toastType}
        position={toastPosition}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
