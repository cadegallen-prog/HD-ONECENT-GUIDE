import { redirect } from "next/navigation"
import { RAKUTEN_REFERRAL_URL } from "@/lib/constants"

export function GET() {
  redirect(RAKUTEN_REFERRAL_URL)
}
