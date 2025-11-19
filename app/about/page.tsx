import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, Users, BookOpen, Shield, Heart, FileText } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                About HD Penny Guide
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                A community-driven educational resource for clearance hunters
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* What We Are */}
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6">What We Are</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  The HD Penny Guide is a comprehensive educational platform dedicated to teaching savvy shoppers
                  how to find "penny items" - clearance merchandise marked down to $0.01 at Home Depot stores.
                  We provide practical, honest information based on real-world experience and community knowledge.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This resource exists to help everyday shoppers understand retail clearance systems, save money
                  on home improvement products, and participate responsibly in the penny shopping community.
                </p>
              </div>

              {/* Community Stats */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-primary" />
                    <CardTitle className="text-2xl">Built by the Community</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Our knowledge comes from 32,000+ active penny hunters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Everything in this guide is based on consistent community reports, verified patterns,
                    and practical retail logic. We don't guess or exaggerate - we share what actually works
                    based on thousands of successful finds across hundreds of stores nationwide.
                  </p>
                </CardContent>
              </Card>

              {/* Key Principles */}
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6">Our Principles</h2>
                <div className="grid md:grid-cols-2 gap-6">

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl">Education First</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        We teach how retail clearance systems work, not just tactics. Understanding the "why"
                        makes you a better, more successful hunter.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl">Respect & Ethics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        We emphasize courtesy toward store employees, responsible purchasing limits,
                        and ethical behavior that protects the hobby for everyone.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl">Honest Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        No hype, no get-rich-quick promises. We tell you what really works and what doesn't,
                        based on real community experience.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl">Community Driven</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Our content comes from shared knowledge, not corporate marketing.
                        We're shoppers helping shoppers.
                      </p>
                    </CardContent>
                  </Card>

                </div>
              </div>

              {/* Disclaimer */}
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Important Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Not Affiliated with Home Depot:</strong> This is an
                    independent educational resource created by and for shoppers. We are not affiliated with,
                    endorsed by, or sponsored by The Home Depot, Inc.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Educational Purposes Only:</strong> All information
                    provided is for educational purposes. Store policies vary by location, and practices may
                    change at any time. Always follow store policies and treat staff with respect.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">No Guarantees:</strong> Finding penny items requires
                    time, patience, and sometimes luck. Results vary by location and timing. We cannot guarantee
                    you will find specific items or any items at all.
                  </p>
                </CardContent>
              </Card>

              {/* Resources */}
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6">Resources</h2>
                <div className="space-y-4">

                  <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-primary" />
                          <div>
                            <CardTitle className="text-xl">Complete PDF Guide</CardTitle>
                            <CardDescription>
                              Download our comprehensive guide for offline reading
                            </CardDescription>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="w-6 h-6 text-primary" />
                          <div>
                            <CardTitle className="text-xl">Join Our Community</CardTitle>
                            <CardDescription>
                              Connect with 32,000+ penny hunters in our Facebook group
                            </CardDescription>
                          </div>
                        </div>
                        <Button size="sm">
                          Join Group
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                </div>
              </div>

              {/* Contact/Feedback */}
              <div className="text-center py-8">
                <h3 className="text-2xl font-heading font-bold mb-4">Questions or Feedback?</h3>
                <p className="text-muted-foreground mb-6">
                  We're constantly improving this resource based on community feedback.
                  If you have suggestions, corrections, or questions, we'd love to hear from you.
                </p>
                <p className="text-sm text-muted-foreground">
                  This is a community project maintained by volunteers who are passionate about helping
                  others save money and shop smart.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
