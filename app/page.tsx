import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "./sections/Hero"
import { Features } from "./sections/Features"
import { Testimonials } from "./sections/Testimonials"
import { CTA } from "./sections/CTA"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
