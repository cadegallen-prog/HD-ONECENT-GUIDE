import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Missing unsubscribe token" }, { status: 400 })
    }

    // Find subscriber by token
    const supabase = getSupabaseClient()
    const { data: subscriber, error: fetchError } = await supabase
      .from("email_subscribers")
      .select("id, email, is_active")
      .eq("unsubscribe_token", token)
      .maybeSingle()

    if (fetchError) {
      console.error("Unsubscribe fetch error:", fetchError)
      return NextResponse.json({ error: "Failed to process unsubscribe" }, { status: 500 })
    }

    if (!subscriber) {
      return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 404 })
    }

    if (!subscriber.is_active) {
      // Already unsubscribed
      return NextResponse.redirect(new URL("/unsubscribed?already=true", request.url))
    }

    // Mark as unsubscribed
    const { error: updateError } = await supabase
      .from("email_subscribers")
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("unsubscribe_token", token)

    if (updateError) {
      console.error("Unsubscribe update error:", updateError)
      return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
    }

    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(new URL("/unsubscribed", request.url))
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
