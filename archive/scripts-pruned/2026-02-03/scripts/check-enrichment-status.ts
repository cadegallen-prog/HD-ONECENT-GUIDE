import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env vars")
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function main() {
  // Check enrichment_staging table
  console.log("=== ENRICHMENT STAGING TABLE ===")

  const stagingRes = await supabase
    .from("enrichment_staging")
    .select("*", { count: "exact", head: true })

  if (stagingRes.error) {
    console.error("Error querying enrichment_staging:", stagingRes.error.message)
    process.exit(1)
  }

  console.log(`Total items in enrichment_staging: ${stagingRes.count}`)

  // Check how many Penny List items have enrichment_provenance from staging
  console.log("\n=== PENNY LIST ENRICHMENT STATUS ===")

  const pennyRes = await supabase.from("Penny List").select("*", { count: "exact", head: true })

  if (pennyRes.error) {
    console.error("Error querying Penny List:", pennyRes.error.message)
    process.exit(1)
  }

  console.log(`Total items in Penny List: ${pennyRes.count}`)

  // Check provenance
  const provenanceRes = await supabase
    .from("Penny List")
    .select("*", { count: "exact", head: true })
    .not("enrichment_provenance", "is", null)

  const enrichedCount = provenanceRes.count || 0
  console.log(`Items with enrichment_provenance: ${enrichedCount}`)

  if (enrichedCount > 0) {
    console.log(`✓ ${enrichedCount} items have been enriched`)
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
