import { permanentRedirect } from "next/navigation"

export default function LegacySupportPage() {
  permanentRedirect("/transparency")
}
