import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Hero } from "./sections/Hero"
import { ContentSections } from "./sections/ContentSections"
import { TableOfContents } from "@/components/table-of-contents"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />

        {/* Main content with TOC sidebar */}
        <div className="container mx-auto px-4 max-w-7xl" id="sections">
          <div className="grid lg:grid-cols-[250px_1fr] gap-8 lg:gap-12 py-8">
            {/* Sticky TOC - Left sidebar on desktop */}
            <aside className="hidden lg:block">
              <TableOfContents />
            </aside>

            {/* Main content */}
            <div className="min-w-0 max-w-4xl">
              <ContentSections />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
