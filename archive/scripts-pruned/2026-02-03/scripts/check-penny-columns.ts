import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function main() {
  const { data, error } = await supabase.from("Penny List").select("*").limit(1)

  if (error) throw error

  if (data && data[0]) {
    console.log("Penny List columns:")
    console.log(Object.keys(data[0]).join(", "))
  }
}

main().catch(console.error)
