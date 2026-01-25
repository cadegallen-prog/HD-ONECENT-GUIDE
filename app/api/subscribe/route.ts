import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/client"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX_PER_IP = 5 // Max 5 signup attempts per hour per IP
const RATE_LIMIT_MAX_PER_EMAIL = 3 // Max 3 attempts per hour per email (prevents hammering same email)

type RateBucket = number[]
const rateLimitMap: Map<string, RateBucket> =
  (globalThis as { __emailSignupRateLimit?: Map<string, RateBucket> }).__emailSignupRateLimit ??
  new Map()
;(globalThis as { __emailSignupRateLimit?: Map<string, RateBucket> }).__emailSignupRateLimit =
  rateLimitMap

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address").max(255),
    honeypot: z.string().optional(), // Bot trap
  })
  .strip()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "unknown"
}

function generateUnsubscribeToken(): string {
  // Generate a cryptographically secure random token
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function checkRateLimit(
  identifier: string,
  maxAttempts: number
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const bucket = rateLimitMap.get(identifier) ?? []

  // Remove timestamps outside the window
  const validTimestamps = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  if (validTimestamps.length >= maxAttempts) {
    const oldestTimestamp = validTimestamps[0]
    const retryAfter = Math.ceil((oldestTimestamp + RATE_LIMIT_WINDOW_MS - now) / 1000)
    return { allowed: false, retryAfter }
  }

  // Add current timestamp
  validTimestamps.push(now)
  rateLimitMap.set(identifier, validTimestamps)

  return { allowed: true }
}

function normalizeEmail(email: string): string {
  // Normalize email for rate limiting: lowercase and strip +aliases
  const [localPart, domain] = email.toLowerCase().split("@")
  // Remove everything after + in local part (common alias trick)
  const cleanLocal = localPart.split("+")[0]
  return `${cleanLocal}@${domain}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check (bots will fill this field)
    if (body.honeypot) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    // Validate input
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    // Rate limiting - check both IP and email
    const clientIp = getClientIp(request)
    const normalizedEmail = normalizeEmail(email)

    // Check IP rate limit first
    const ipRateLimitKey = `email-signup:ip:${clientIp}`
    const ipRateLimitResult = checkRateLimit(ipRateLimitKey, RATE_LIMIT_MAX_PER_IP)

    if (!ipRateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many signup attempts. Please try again later.",
          retryAfter: ipRateLimitResult.retryAfter,
        },
        { status: 429 }
      )
    }

    // Check per-email rate limit (prevents hammering the same email)
    const emailRateLimitKey = `email-signup:email:${normalizedEmail}`
    const emailRateLimitResult = checkRateLimit(emailRateLimitKey, RATE_LIMIT_MAX_PER_EMAIL)

    if (!emailRateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "This email has been submitted too many times. Please try again later.",
          retryAfter: emailRateLimitResult.retryAfter,
        },
        { status: 429 }
      )
    }

    // Check if email already exists
    // Using service_role to bypass RLS (anon write policies removed for security)
    const supabase = getSupabaseServiceRoleClient()
    const { data: existingSubscriber } = await supabase
      .from("email_subscribers")
      .select("email, is_active, unsubscribed_at")
      .eq("email", email)
      .maybeSingle()

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        // Already subscribed and active
        return NextResponse.json({
          success: true,
          message: "You're already subscribed!",
          alreadySubscribed: true,
        })
      } else {
        // Previously unsubscribed - reactivate
        const { error: updateError } = await supabase
          .from("email_subscribers")
          .update({
            is_active: true,
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString(),
          })
          .eq("email", email)

        if (updateError) {
          console.error("Email reactivation error:", updateError)
          return NextResponse.json({ error: "Failed to reactivate subscription" }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          reactivated: true,
        })
      }
    }

    // New subscriber - insert into database
    const unsubscribeToken = generateUnsubscribeToken()

    const { error: insertError } = await supabase.from("email_subscribers").insert({
      email,
      unsubscribe_token: unsubscribeToken,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Email subscription insert error:", insertError)

      // Check for unique constraint violation
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "This email is already subscribed" }, { status: 409 })
      }

      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! You'll receive weekly penny list updates.",
    })
  } catch (error) {
    console.error("Email subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
