import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/client"
import { authorizeAdminRequest } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  const authError = authorizeAdminRequest(request)
  if (authError) return authError

  try {
    const supabase = getSupabaseServiceRoleClient()

    // Get recent submissions from the last 48 hours
    const fortyEightHoursAgo = new Date()
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48)

    const { data, error } = await supabase
      .from("Penny List")
      .select(
        "id,item_name,home_depot_sku_6_or_10_digits,timestamp,store_city_state,image_url,brand"
      )
      .gte("timestamp", fortyEightHoursAgo.toISOString())
      .order("timestamp", { ascending: false })
      .limit(500)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions: data, count: data?.length || 0 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}
