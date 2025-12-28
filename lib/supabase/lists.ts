"use client"

import { createSupabaseBrowserClient } from "./browser"

// Types
export interface List {
  id: string
  owner_id: string
  title: string
  created_at: string
  updated_at: string
  item_count?: number
}

export interface ListItem {
  id: string
  list_id: string
  sku: string
  priority: "maybe" | "must" | "ignore"
  found_status: "unknown" | "found" | "not_found"
  notes: string | null
  added_at: string
}

export interface ListWithItems extends List {
  items: ListItem[]
}

// ============================================================================
// LIST OPERATIONS
// ============================================================================

/**
 * Get all lists for the current user
 */
export async function getUserLists(): Promise<List[]> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      item_count:list_items(count)
    `
    )
    .order("updated_at", { ascending: false })

  if (error) throw error

  // Transform the count from array to number
  return (data || []).map((list) => ({
    ...list,
    item_count: Array.isArray(list.item_count) ? list.item_count[0]?.count || 0 : 0,
  }))
}

/**
 * Get a single list with all its items
 */
export async function getListWithItems(listId: string): Promise<ListWithItems | null> {
  const supabase = createSupabaseBrowserClient()

  const { data: list, error: listError } = await supabase
    .from("lists")
    .select("*")
    .eq("id", listId)
    .single()

  if (listError) {
    if (listError.code === "PGRST116") return null // Not found
    throw listError
  }

  const { data: items, error: itemsError } = await supabase
    .from("list_items")
    .select("*")
    .eq("list_id", listId)
    .order("added_at", { ascending: false })

  if (itemsError) throw itemsError

  return {
    ...list,
    items: items || [],
  }
}

/**
 * Create a new list
 */
export async function createList(title: string): Promise<List> {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("lists")
    .insert({ title, owner_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a list title
 */
export async function updateListTitle(listId: string, title: string): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.from("lists").update({ title }).eq("id", listId)

  if (error) throw error
}

/**
 * Delete a list (and all its items via CASCADE)
 */
export async function deleteList(listId: string): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.from("lists").delete().eq("id", listId)

  if (error) throw error
}

// ============================================================================
// LIST ITEM OPERATIONS
// ============================================================================

/**
 * Add a SKU to a list
 */
export async function addItemToList(
  listId: string,
  sku: string,
  notes?: string
): Promise<ListItem> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("list_items")
    .insert({
      list_id: listId,
      sku,
      notes: notes || null,
    })
    .select()
    .single()

  if (error) {
    // Handle unique constraint violation (item already in list)
    if (error.code === "23505") {
      throw new Error("This item is already in your list")
    }
    throw error
  }

  return data
}

/**
 * Remove an item from a list
 */
export async function removeItemFromList(itemId: string): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.from("list_items").delete().eq("id", itemId)

  if (error) throw error
}

/**
 * Update item priority (cycle: maybe -> must -> ignore -> maybe)
 */
export async function updateItemPriority(
  itemId: string,
  priority: "maybe" | "must" | "ignore"
): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.from("list_items").update({ priority }).eq("id", itemId)

  if (error) throw error
}

/**
 * Update item found status (cycle: unknown -> found -> not_found -> unknown)
 */
export async function updateItemFoundStatus(
  itemId: string,
  found_status: "unknown" | "found" | "not_found"
): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.from("list_items").update({ found_status }).eq("id", itemId)

  if (error) throw error
}

/**
 * Update item notes
 */
export async function updateItemNotes(itemId: string, notes: string | null): Promise<void> {
  const supabase = createSupabaseBrowserClient()

  const { error } = await supabase.from("list_items").update({ notes }).eq("id", itemId)

  if (error) throw error
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get or create the user's default list ("My Hit List")
 * Returns the list, and a boolean indicating if it was just created
 */
export async function getOrCreateDefaultList(): Promise<{ list: List; created: boolean }> {
  const lists = await getUserLists()

  if (lists.length > 0) {
    return { list: lists[0], created: false }
  }

  // No lists exist, create the default one
  const newList = await createList("My Hit List")
  return { list: newList, created: true }
}

/**
 * Add SKU to user's list with smart defaults:
 * - If 0 lists: create "My Hit List" and add
 * - If 1 list: add directly
 * - If multiple: returns null (caller should show list picker)
 */
export async function addSkuToListSmart(
  sku: string
): Promise<{ list: List; item: ListItem } | null> {
  const lists = await getUserLists()

  if (lists.length === 0) {
    // Create default list and add
    const newList = await createList("My Hit List")
    const item = await addItemToList(newList.id, sku)
    return { list: newList, item }
  }

  if (lists.length === 1) {
    // Add to the only list
    const item = await addItemToList(lists[0].id, sku)
    return { list: lists[0], item }
  }

  // Multiple lists - caller should show picker
  return null
}

// ============================================================================
// SHARING OPERATIONS
// ============================================================================

export interface SharedListData {
  title: string
  items: Array<{
    id: string
    sku: string
    priority: string
    notes: string | null
    added_at: string
  }>
  item_count: number
}

/**
 * Create or get a share token for a list
 */
export async function createShareToken(listId: string): Promise<string> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase.rpc("create_share_token", {
    p_list_id: listId,
  })

  if (error) throw error
  return data as string
}

/**
 * Get a shared list by token (public, no auth required)
 */
export async function getSharedList(token: string): Promise<SharedListData | null> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase.rpc("get_shared_list", {
    p_token: token,
  })

  if (error) throw error
  return data as SharedListData | null
}

/**
 * Fork a shared list to create a copy for the current user
 */
export async function forkSharedList(token: string): Promise<string> {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase.rpc("fork_shared_list", {
    p_token: token,
  })

  if (error) throw error
  return data as string
}
