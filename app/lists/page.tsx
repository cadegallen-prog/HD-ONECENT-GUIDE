"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Plus, List, Trash2, Loader2, Edit2, Check, X, Lock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  getUserLists,
  createList,
  deleteList,
  updateListTitle,
  addSkuToListSmart,
  type List as ListType,
} from "@/lib/supabase/lists"
import { toast } from "sonner"
import type { PennyItem } from "@/lib/fetch-penny-data"

export default function ListsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
        </div>
      }
    >
      <ListsPageInner />
    </Suspense>
  )
}

function ListsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [lists, setLists] = useState<ListType[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newListTitle, setNewListTitle] = useState("")
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [sampleItems, setSampleItems] = useState<PennyItem[]>([])
  const [loadingSamples, setLoadingSamples] = useState(false)

  // Load lists
  useEffect(() => {
    if (user) {
      loadLists()
    }
  }, [user])

  // Intent resume: handle pc_intent after login
  useEffect(() => {
    if (!user || !searchParams) return

    const intent = searchParams.get("pc_intent")
    const sku = searchParams.get("pc_sku")
    const intentId = searchParams.get("pc_intent_id")

    if (intent === "save_to_my_list" && sku && intentId) {
      // Check idempotency guard
      const storageKey = `pennycentral_intent_consumed_v1_${intentId}`
      const alreadyConsumed = sessionStorage.getItem(storageKey) === "1"

      if (alreadyConsumed) {
        // Already processed, just clean URL
        router.replace("/lists")
        return
      }

      // Attempt to save the item
      ;(async () => {
        try {
          await addSkuToListSmart(sku)
          toast.success("Item saved to My List")
        } catch (error) {
          console.error("Failed to resume save intent:", error)
          // Silent failure - user can manually save
        } finally {
          // Mark as consumed and clean URL
          sessionStorage.setItem(storageKey, "1")
          router.replace("/lists")
        }
      })()
    }
  }, [user, searchParams, router])

  // Load sample items for preview (when logged out)
  useEffect(() => {
    if (!user && !authLoading) {
      setLoadingSamples(true)
      fetch("/api/penny-list?perPage=25&sort=newest")
        .then((res) => res.json())
        .then((data) => {
          // Take first 6 items as samples
          setSampleItems(data.items?.slice(0, 6) || [])
        })
        .catch((error) => {
          console.error("Failed to load sample items:", error)
        })
        .finally(() => {
          setLoadingSamples(false)
        })
    }
  }, [user, authLoading])

  async function loadLists() {
    try {
      const data = await getUserLists()
      setLists(data)
    } catch (error) {
      console.error("Failed to load lists:", error)
      toast.error("Failed to load your lists")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateList() {
    if (!newListTitle.trim()) return

    setCreating(true)
    try {
      const newList = await createList(newListTitle.trim())
      setLists((prev) => [newList, ...prev])
      setNewListTitle("")
      setShowNewListInput(false)
      toast.success("List created!")
    } catch (error) {
      console.error("Failed to create list:", error)
      toast.error("Failed to create list")
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteList(listId: string) {
    setDeletingId(listId)
    try {
      await deleteList(listId)
      setLists((prev) => prev.filter((l) => l.id !== listId))
      toast.success("List deleted")
    } catch (error) {
      console.error("Failed to delete list:", error)
      toast.error("Failed to delete list")
    } finally {
      setDeletingId(null)
    }
  }

  async function handleUpdateTitle(listId: string) {
    if (!editingTitle.trim()) {
      setEditingId(null)
      return
    }

    try {
      await updateListTitle(listId, editingTitle.trim())
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, title: editingTitle.trim() } : l))
      )
      setEditingId(null)
      toast.success("List renamed")
    } catch (error) {
      console.error("Failed to update list:", error)
      toast.error("Failed to rename list")
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
      </div>
    )
  }

  // Guest preview mode
  if (!user) {
    const currentUrl = `/lists${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`
    const loginUrl = `/login?redirect=${encodeURIComponent(currentUrl)}`

    return (
      <div className="min-h-screen bg-[var(--bg-page)] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Locked Hero */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--cta-primary)]/10 mb-4">
              <Lock className="w-8 h-8 text-[var(--cta-primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">My List</h1>
            <p className="text-lg text-[var(--text-primary)] mb-6">Your in-store hunt companion</p>

            {/* Benefit bullets */}
            <div className="max-w-md mx-auto text-left space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary)] flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[var(--text-primary)]">
                  <strong>One-handed checklist mode</strong> for scanning penny items in-store
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary)] flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[var(--text-primary)]">
                  <strong>Copy SKU with one tap</strong> for quick price checks
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--cta-primary)] flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[var(--text-primary)]">
                  <strong>Track your finds</strong> as you hunt through the store
                </p>
              </div>
            </div>

            {/* Primary CTA */}
            <Link
              href={loginUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 transition-opacity mb-4"
            >
              Sign in to use My List
            </Link>

            {/* OTP reassurance */}
            <p className="text-sm text-[var(--text-muted)] mb-4">
              No password. We&apos;ll email you a one-time code.
            </p>

            {/* Secondary CTA */}
            <Link
              href="/penny-list"
              className="inline-block text-sm text-[var(--link-default)] hover:underline"
            >
              Browse Penny List
            </Link>
          </div>

          {/* Sample items */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">
                Sample from today&apos;s Penny List
              </h2>
            </div>

            {loadingSamples ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
              </div>
            ) : sampleItems.length > 0 ? (
              <div className="space-y-3">
                {sampleItems.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center gap-4 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)]"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name || "Product image"}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--text-primary)] truncate">
                        {item.name || "Unnamed item"}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">SKU: {item.sku}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[var(--text-muted)] py-8">No sample items available</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Authenticated user - show loading while fetching lists
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
      </div>
    )
  }

  // Authenticated user - show lists
  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Lists</h1>
            <p className="text-[var(--text-muted)] mt-1">
              Save penny items for your next shopping trip
            </p>
          </div>
          {!showNewListInput && (
            <button
              onClick={() => setShowNewListInput(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New List</span>
            </button>
          )}
        </div>

        {/* New list input */}
        {showNewListInput && (
          <div className="mb-6 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)]">
            <div className="flex gap-3">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="List name (e.g., Sunday Trip)"
                autoFocus
                maxLength={100}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateList()
                  if (e.key === "Escape") setShowNewListInput(false)
                }}
              />
              <button
                onClick={handleCreateList}
                disabled={creating || !newListTitle.trim()}
                className="px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Create</span>
              </button>
              <button
                onClick={() => {
                  setShowNewListInput(false)
                  setNewListTitle("")
                }}
                className="px-3 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Lists */}
        {lists.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-muted)] mb-4">
              <List className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No lists yet</h2>
            <p className="text-[var(--text-muted)] mb-6">
              Create your first list to start saving penny items
            </p>
            <button
              onClick={() => setShowNewListInput(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Create your first list
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] p-4 hover:border-[var(--border-hover)] transition-colors"
              >
                {editingId === list.id ? (
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      autoFocus
                      maxLength={100}
                      className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateTitle(list.id)
                        if (e.key === "Escape") setEditingId(null)
                      }}
                    />
                    <button
                      onClick={() => handleUpdateTitle(list.id)}
                      className="p-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)]"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 rounded-lg border border-[var(--border-default)] text-[var(--text-muted)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Link href={`/lists/${list.id}`} className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--text-primary)] truncate">
                        {list.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {list.item_count || 0} item{list.item_count !== 1 ? "s" : ""}
                      </p>
                    </Link>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingId(list.id)
                          setEditingTitle(list.title)
                        }}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
                        aria-label="Edit list name"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${list.title}"? This cannot be undone.`)) {
                            handleDeleteList(list.id)
                          }
                        }}
                        disabled={deletingId === list.id}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[color-mix(in_srgb,var(--status-error)_10%,var(--bg-muted))] transition-colors disabled:opacity-50"
                        aria-label="Delete list"
                      >
                        {deletingId === list.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help text */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-8">
          Save items from the{" "}
          <Link href="/penny-list" className="text-[var(--link-default)] hover:underline">
            Penny List
          </Link>{" "}
          to track your hunts
        </p>
      </div>
    </div>
  )
}
