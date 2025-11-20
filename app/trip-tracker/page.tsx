export default function TripTrackerPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Trip Expense Tracker
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Log your penny hunting trips and track your profits. See which stores are most productive!
          </p>
          {/* Component will be added from Browser Claude Tab 10 */}
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Trip tracker component loading...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
