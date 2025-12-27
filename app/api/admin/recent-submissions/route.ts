import { NextResponse } from "next/server"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/client"

export async function GET() {
  try {
    const supabase = getSupabaseServiceRoleClient()

    // Get recent submissions from the last 48 hours
    const fortyEightHoursAgo = new Date()
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48)

    const { data, error } = await supabase
      .from("Penny List")
      .select("*")
      .gte("timestamp", fortyEightHoursAgo.toISOString())
      .order("timestamp", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions: data, count: data?.length || 0 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}
