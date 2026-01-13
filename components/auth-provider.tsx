"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Auth is optional for most of the site. If Supabase isn't configured (common in CI/e2e),
    // keep the app usable instead of crashing on hydration.
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }

    const supabase = createSupabaseBrowserClient()

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithOtp = async (email: string) => {
    const supabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    if (!supabaseConfigured) {
      return { error: new Error("Auth is not configured") }
    }
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Redirect back to the site after clicking the email link
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const verifyOtp = async (email: string, token: string) => {
    const supabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    if (!supabaseConfigured) {
      return { error: new Error("Auth is not configured") }
    }
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    })
    return { error }
  }

  const signOut = async () => {
    const supabaseConfigured =
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    if (!supabaseConfigured) {
      return
    }
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithOtp,
        verifyOtp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
