import { permanentRedirect } from "next/navigation"

export default function RedirectPage() {
  permanentRedirect("/facts-vs-myths")
}
