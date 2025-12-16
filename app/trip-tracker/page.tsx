"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  TrendingUp,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

interface Trip {
  id: string
  title: string
  date: string
  time: string
  stores: string[]
  notes: string
  checklist: string[]
  completed: boolean
  completedAt?: string
  findings?: string
  estimatedValue?: number
}

interface TripTemplate {
  name: string
  icon: React.ElementType
  description: string
  stores: number
  checklist: string[]
}

const templates: TripTemplate[] = [
  {
    name: "Weekend Hunt",
    icon: Calendar,
    description: "Multi-store weekend penny hunting trip",
    stores: 3,
    checklist: [
      "Check clearance endcaps",
      "Scan seasonal sections",
      "Look for damaged packaging",
      "Check garden/outdoor clearance",
    ],
  },
  {
    name: "Quick Check",
    icon: Clock,
    description: "Fast single-store visit",
    stores: 1,
    checklist: ["Check clearance endcaps", "Scan penny hotspots"],
  },
  {
    name: "Seasonal Clearance",
    icon: TrendingUp,
    description: "End-of-season clearance hunting",
    stores: 2,
    checklist: [
      "Check seasonal department",
      "Look for holiday clearance",
      "Scan outdoor/garden section",
      "Check tools clearance",
    ],
  },
]

export default function TripTrackerPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [showNewTrip, setShowNewTrip] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TripTemplate | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "09:00",
    stores: [""],
    notes: "",
    checklist: [] as string[],
  })

  // Load trips from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hd-penny-trips")
    if (saved) {
      try {
        setTrips(JSON.parse(saved))
      } catch (e) {
        console.error("Error loading trips:", e)
      }
    }
  }, [])

  // Save trips to localStorage
  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem("hd-penny-trips", JSON.stringify(trips))
    }
  }, [trips])

  const createTrip = () => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      title: formData.title || "Penny Hunt",
      date: formData.date || new Date().toISOString().split("T")[0],
      time: formData.time,
      stores: formData.stores.filter((s) => s.trim()),
      notes: formData.notes,
      checklist: formData.checklist,
      completed: false,
    }

    // Track trip creation
    trackEvent("trip_create", {
      event_label: newTrip.stores.length > 0 ? "with_stores" : "no_stores",
      value: newTrip.stores.length,
    })

    setTrips([...trips, newTrip])
    setShowNewTrip(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "09:00",
      stores: [""],
      notes: "",
      checklist: [],
    })
    setSelectedTemplate(null)
  }

  const deleteTrip = (id: string) => {
    setTrips(trips.filter((t) => t.id !== id))
  }

  const toggleComplete = (id: string) => {
    setTrips(
      trips.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    )
  }

  const applyTemplate = (template: TripTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      ...formData,
      title: template.name,
      stores: Array(template.stores).fill(""),
      checklist: [...template.checklist],
    })
  }

  const addStore = () => {
    setFormData({ ...formData, stores: [...formData.stores, ""] })
  }

  const updateStore = (index: number, value: string) => {
    const newStores = [...formData.stores]
    newStores[index] = value
    setFormData({ ...formData, stores: newStores })
  }

  const removeStore = (index: number) => {
    setFormData({ ...formData, stores: formData.stores.filter((_, i) => i !== index) })
  }

  const addChecklistItem = () => {
    const item = prompt("Add checklist item:")
    if (item) {
      setFormData({ ...formData, checklist: [...formData.checklist, item] })
    }
  }

  const removeChecklistItem = (index: number) => {
    setFormData({ ...formData, checklist: formData.checklist.filter((_, i) => i !== index) })
  }

  const quickStartToday = () => {
    const today = new Date()
    setFormData({
      title: "Quick Hunt - " + today.toLocaleDateString(),
      date: today.toISOString().split("T")[0],
      time: "09:00",
      stores: [""],
      notes: "",
      checklist: ["Check clearance endcaps", "Scan penny hotspots"],
    })
    setShowNewTrip(true)
  }

  const upcomingTrips = trips.filter(
    (t) => !t.completed && new Date(t.date) >= new Date(new Date().toISOString().split("T")[0])
  )
  const pastTrips = trips.filter(
    (t) => t.completed || new Date(t.date) < new Date(new Date().toISOString().split("T")[0])
  )

  // Stats
  const totalTrips = trips.length
  const completedTrips = trips.filter((t) => t.completed).length
  const successRate = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0

  return (
    <div className="p-6 max-w-[1200px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-foreground">
              Trip Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Plan your penny hunting trips and track your success
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              onClick={quickStartToday}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Quick Start Today
            </Button>
            <Button onClick={() => setShowNewTrip(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Trip
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalTrips}</div>
                <div className="text-sm text-muted-foreground">Total Trips</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--chip-success-surface)] border border-[var(--chip-success-border)] rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[var(--status-success)]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{completedTrips}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--bg-elevated)] rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[var(--text-muted)]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* New Trip Modal */}
        {showNewTrip && (
          <div className="fixed inset-0 bg-[var(--bg-hover)]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-heading font-bold text-foreground">Plan New Trip</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Templates */}
                {!selectedTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-3 text-foreground">
                      Start with a template
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {templates.map((template, i) => (
                        <button
                          key={i}
                          onClick={() => applyTemplate(template)}
                          className="p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all text-left"
                        >
                          <template.icon className="h-6 w-6 text-primary mb-2" />
                          <div className="font-semibold text-foreground">{template.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="text-center my-4 text-sm text-muted-foreground">
                      or start from scratch
                    </div>
                  </div>
                )}

                {/* Form */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Trip Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow"
                    placeholder="Weekend Penny Hunt"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="trip-date"
                      className="block text-sm font-medium mb-2 text-foreground"
                    >
                      Date
                    </label>
                    <input
                      id="trip-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="trip-time"
                      className="block text-sm font-medium mb-2 text-foreground"
                    >
                      Time
                    </label>
                    <input
                      id="trip-time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Stores to Visit
                  </label>
                  {formData.stores.map((store, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={store}
                        onChange={(e) => updateStore(i, e.target.value)}
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent transition-shadow"
                        placeholder="Store address or name"
                      />
                      {formData.stores.length > 1 && (
                        <Button variant="secondary" size="sm" onClick={() => removeStore(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="secondary" onClick={addStore} className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Store
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Checklist
                  </label>
                  <div className="space-y-2 mb-2">
                    {formData.checklist.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-accent/50 px-3 py-2 rounded-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="flex-1 text-sm text-foreground">{item}</span>
                        <button
                          onClick={() => removeChecklistItem(i)}
                          aria-label={`Remove ${item}`}
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" onClick={addChecklistItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Checklist Item
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground h-24"
                    placeholder="Any special notes for this trip..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowNewTrip(false)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={createTrip} className="flex-1">
                  Create Trip
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Trips */}
        {upcomingTrips.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">Upcoming Trips</h2>
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onToggle={toggleComplete}
                  onDelete={deleteTrip}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">Trip History</h2>
            <div className="space-y-4">
              {pastTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onToggle={toggleComplete}
                  onDelete={deleteTrip}
                />
              ))}
            </div>
          </div>
        )}

        {trips.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
              No trips planned yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start planning your first penny hunting trip!
            </p>
            <Button onClick={() => setShowNewTrip(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Trip
            </Button>
          </div>
        )}

        {/* Pro Tips */}
        <div className="mt-12 callout-box info">
          <h3 className="font-heading font-semibold mb-3 text-foreground">Trip Planning Tips</h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li>• Plan trips for weekday mornings (7-9 AM) for less competition</li>
            <li>• Group nearby stores together to save time and gas</li>
            <li>• Check multiple stores - inventory varies widely by location</li>
            <li>• Bring reusable bags and be ready for unexpected finds</li>
            <li>• Track which stores have the best clearance sections for future trips</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function TripCard({
  trip,
  onToggle,
  onDelete,
}: {
  trip: Trip
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div
      className={`bg-card border-2 rounded-xl p-6 transition-all ${trip.completed ? "border-[var(--status-success)] bg-[var(--chip-success-surface)]" : "border-border"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-heading font-bold text-foreground">{trip.title}</h3>
            {trip.completed && (
              <span className="px-2 py-1 bg-[var(--chip-success-surface)] text-[var(--status-success)] border border-[var(--chip-success-border)] rounded-md text-xs font-medium">
                Completed
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(trip.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {trip.time}
            </div>
            <div className="flex items-center gap-1">
              <Store className="h-4 w-4" />
              {trip.stores.filter((s) => s).length} store
              {trip.stores.filter((s) => s).length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToggle(trip.id)}
            className={
              trip.completed
                ? "bg-[var(--chip-success-surface)] border border-[var(--chip-success-border)]"
                : ""
            }
          >
            {trip.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onDelete(trip.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {trip.stores.filter((s) => s).length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-2 text-foreground">Stores:</div>
          <div className="flex flex-wrap gap-2">
            {trip.stores
              .filter((s) => s)
              .map((store, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-accent/10 text-xs text-foreground"
                >
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {store}
                </span>
              ))}
          </div>
        </div>
      )}

      {trip.checklist.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-2 text-foreground">Checklist:</div>
          <div className="grid md:grid-cols-2 gap-2">
            {trip.checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {trip.notes && (
        <div className="mt-3 p-3 bg-accent/50 rounded-lg">
          <div className="text-sm font-medium mb-1 text-foreground">Notes:</div>
          <div className="text-sm text-muted-foreground">{trip.notes}</div>
        </div>
      )}
    </div>
  )
}
