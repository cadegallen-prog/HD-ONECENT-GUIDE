import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"

// Load .env.local if it exists
config({ path: resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials. Make sure environment variables are set.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkRecent() {
  // Get recent submissions from the last 24 hours
  const twentyFourHoursAgo = new Date()
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

  const { data, error } = await supabase
    .from("Penny List")
    .select("*")
    .gte("timestamp", twentyFourHoursAgo.toISOString())
    .order("timestamp", { ascending: false })

  if (error) {
    console.error("Error:", error)
    return
  }

  console.log("\n=== Recent Submissions (Last 24 Hours) ===\n")
  data?.forEach((item, index) => {
    const timestamp = new Date(item.timestamp)
    console.log(`${index + 1}. ${item.item_name}`)
    console.log(`   SKU: ${item.home_depot_sku_6_or_10_digits}`)
    console.log(`   Location: ${item.store_city_state}`)
    console.log(`   Date Found: ${item.purchase_date || "Not specified"}`)
    console.log(`   Quantity: ${item.exact_quantity_found || "Not specified"}`)
    console.log(`   Notes: ${item.notes_optional || "None"}`)
    console.log(
      `   Submitted: ${timestamp.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })} EST`
    )
    console.log(`   Row ID: ${item.id}`)
    console.log()
  })

  console.log(`Total: ${data?.length || 0} submissions`)
}

checkRecent()
