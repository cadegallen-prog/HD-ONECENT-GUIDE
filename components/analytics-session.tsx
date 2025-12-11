"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

const SESSIONS_KEY = "pc_sessions"
const RETURN_VISIT_KEY = "pc_return_visit_week"

function getWeekKey(date: Date): string {
  const copy = new Date(date)
  const day = copy.getUTCDay()
  const diff = copy.getUTCDate() - day
  copy.setUTCDate(diff)
  copy.setUTCHours(0, 0, 0, 0)
  return copy.toISOString()
}

export function AnalyticsSessionTracker() {
  useEffect(() => {
    try {
      const now = new Date()
      const weekKey = getWeekKey(now)
      const stored = localStorage.getItem(SESSIONS_KEY)
      const sessions = stored ? (JSON.parse(stored) as string[]) : []

      // Prune sessions older than 7 days
      const cutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000
      const recentSessions = sessions
        .map((ts) => new Date(ts))
        .filter((d) => !Number.isNaN(d.getTime()) && d.getTime() >= cutoff)
        .map((d) => d.toISOString())

      recentSessions.push(now.toISOString())
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(recentSessions))

      const emittedWeek = localStorage.getItem(RETURN_VISIT_KEY)
      const qualifies = recentSessions.length >= 2

      if (qualifies && emittedWeek !== weekKey) {
        trackEvent("return_visit", { weeklySessions: recentSessions.length })
        localStorage.setItem(RETURN_VISIT_KEY, weekKey)
      }
    } catch (error) {
      console.warn("Analytics session tracking failed", error)
    }
  }, [])

  return null
}
