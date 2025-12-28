"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signInWithOtp, verifyOtp, user } = useAuth()

  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [step, setStep] = useState<"email" | "otp" | "success">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get("redirect") || "/lists"

  // If already logged in, redirect
  if (user) {
    router.replace(redirectTo)
    return null
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signInWithOtp(email)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setStep("otp")
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await verifyOtp(email, otpCode)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setStep("success")
      // Give the auth state a moment to update, then redirect
      setTimeout(() => {
        router.replace(redirectTo)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg-page)]">
      <div className="w-full max-w-md">
        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-8 border border-[var(--border-default)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-muted)] mb-4">
              {step === "success" ? (
                <CheckCircle className="w-8 h-8 text-[var(--status-success)]" />
              ) : (
                <Mail className="w-8 h-8 text-[var(--text-primary)]" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {step === "email" && "Sign in to Penny Central"}
              {step === "otp" && "Check your email"}
              {step === "success" && "Welcome back!"}
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              {step === "email" && "We'll send you a one-time code to sign in."}
              {step === "otp" && `Enter the 6-digit code sent to ${email}`}
              {step === "success" && "Redirecting you..."}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-[color-mix(in_srgb,var(--status-error)_14%,var(--bg-card))] border border-[color-mix(in_srgb,var(--status-error)_35%,transparent)] rounded-lg text-[var(--status-error)] text-sm">
              {error}
            </div>
          )}

          {/* Email step */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 px-4 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Continue with email"
                )}
              </button>
            </form>
          )}

          {/* OTP step */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                >
                  Verification code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent text-center text-2xl tracking-widest font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3 px-4 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify code"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email")
                  setOtpCode("")
                  setError(null)
                }}
                className="w-full mt-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}

          {/* Success step */}
          {step === "success" && (
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--text-muted)]" />
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          No password needed. We&apos;ll email you a secure code.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--text-muted)]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
