"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

export function CTA() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ email, message })
    alert("Thanks for your interest! We'll be in touch soon.")
    setEmail("")
    setMessage("")
  }

  return (
    <section id="cta" className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Never miss a penny find in your area
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join 32,000+ hunters getting weekly alerts, exclusive tips, and recent finds delivered to your inbox.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Benefits */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Weekly penny alerts</h3>
                  <p className="text-muted-foreground">Get notified when items hit penny in your region</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Exclusive hunting tips</h3>
                  <p className="text-muted-foreground">Advanced strategies not in the public guide</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Community finds digest</h3>
                  <p className="text-muted-foreground">See what 32k+ hunters found this week</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">100% free, no spam</h3>
                  <p className="text-muted-foreground">Unsubscribe anytime. We respect your inbox</p>
                </div>
              </div>
            </div>

            {/* Right side - Email signup form */}
            <div className="bg-card p-8 rounded-2xl border-2 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your state (optional)
                  </label>
                  <Input
                    id="message"
                    placeholder="e.g., Texas"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Helps us send you relevant regional finds
                  </p>
                </div>
                <Button type="submit" size="lg" className="w-full group">
                  Get Penny Alerts
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Free forever. We never share your email. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
