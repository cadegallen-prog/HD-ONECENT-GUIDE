import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseClient } from "@/lib/supabase/client"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5 // Max 5 signup attempts per hour per IP

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

function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const bucket = rateLimitMap.get(identifier) ?? []

  // Remove timestamps outside the window
  const validTimestamps = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  if (validTimestamps.length >= RATE_LIMIT_MAX) {
    const oldestTimestamp = validTimestamps[0]
    const retryAfter = Math.ceil((oldestTimestamp + RATE_LIMIT_WINDOW_MS - now) / 1000)
    return { allowed: false, retryAfter }
  }

  // Add current timestamp
  validTimestamps.push(now)
  rateLimitMap.set(identifier, validTimestamps)

  return { allowed: true }
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

    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimitKey = `email-signup:${clientIp}`
    const rateLimitResult = checkRateLimit(rateLimitKey)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many signup attempts. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      )
    }

    // Check if email already exists
    const supabase = getSupabaseClient()
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
