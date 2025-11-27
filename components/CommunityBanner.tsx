"use client"

import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CommunityBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-y border-amber-200 dark:border-amber-900/50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center md:text-left">
          <p className="text-base md:text-lg text-foreground font-medium">
            Join 32,000+ penny hunters in the Home Depot One Cent Items Facebook community
          </p>
          <Button
            href="https://www.facebook.com/groups/homedepotpenny"
            className="gap-2 shrink-0"
          >
            <Users className="w-4 h-4" />
            Join the Community
          </Button>
        </div>
      </div>
    </div>
  )
}
