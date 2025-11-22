import { Breadcrumb } from "@/components/breadcrumb"
import { RecentFindsFeed } from "@/components/recent-finds-feed"

export default function RecentFindsPage() {
  return (
    <>
      <Breadcrumb />
      <main className="min-h-screen pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Recent Penny Finds
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Examples of penny items found by our 32,000+ member community. Join our Facebook group to share your finds!
            </p>

            <RecentFindsFeed />
          </div>
        </div>
      </main>
    </>
  )
}
