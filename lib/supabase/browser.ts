"use client"

import { createBrowserClient } from "@supabase/ssr"

/**
 * Browser-side Supabase client for auth.
 * Uses persistent sessions and auto-refresh for authenticated users.
 */
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
