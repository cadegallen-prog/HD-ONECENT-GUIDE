"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah M.",
    role: "DIY Enthusiast, Texas",
    content: "Found 12 gallons of Behr paint marked to a penny last month. Saved over $400 and finally painted my whole house. This guide taught me exactly when to check the paint aisle.",
    rating: 5,
  },
  {
    name: "Mike R.",
    role: "Reseller, Florida",
    content: "I've been penny shopping for 2 years, but this guide showed me timing patterns I never knew existed. My monthly finds tripled after learning the clearance cycles.",
    rating: 5,
  },
  {
    name: "Jennifer L.",
    role: "Budget Shopper, Ohio",
    content: "As a single mom, every dollar counts. Last week I got 25 items for under $1 total. The checkout strategies helped me handle it professionally and the cashiers were super nice about it.",
    rating: 5,
  },
  {
    name: "Carlos G.",
    role: "Tool Collector, California",
    content: "Scored 8 DeWalt batteries at $0.01 each using the digital scouting techniques. That's $400+ in savings. The route optimizer saves me so much gas money too.",
    rating: 5,
  },
  {
    name: "Amanda K.",
    role: "Home Renovator, Georgia",
    content: "Found enough clearance flooring to redo my entire kitchen for $3.50. The in-store tactics section is gold - I know exactly where to look now.",
    rating: 5,
  },
  {
    name: "Tom B.",
    role: "Penny Hunter, Michigan",
    content: "The legal and ethical section helped me understand the line between smart shopping and policy violations. I hunt responsibly now and have great relationships with my local stores.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Real finds from real hunters
          </h2>
          <p className="text-xl text-muted-foreground">
            Join 32,000+ penny hunters saving hundreds every month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-base leading-relaxed mb-6 text-foreground">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
