"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined
)

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const root = window.document.documentElement
    const savedTheme = localStorage.getItem("theme") as Theme | null

    if (savedTheme) {
      setThemeState(savedTheme)
    }

    const applyTheme = (newTheme: Theme) => {
      root.classList.remove("light", "dark")

      if (disableTransitionOnChange) {
        const css = document.createElement("style")
        css.appendChild(
          document.createTextNode(
            `* {
              -webkit-transition: none !important;
              -moz-transition: none !important;
              -o-transition: none !important;
              -ms-transition: none !important;
              transition: none !important;
            }`
          )
        )
        document.head.appendChild(css)

        const _ = window.getComputedStyle(document.body)

        setTimeout(() => {
          document.head.removeChild(css)
        }, 1)
      }

      if (newTheme === "system" && enableSystem) {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"
        root.classList.add(systemTheme)
      } else {
        root.classList.add(newTheme)
      }
    }

    applyTheme(savedTheme || defaultTheme)
  }, [defaultTheme, enableSystem, disableTransitionOnChange])

  const setTheme = (newTheme: Theme) => {
    if (typeof window === "undefined") return

    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (newTheme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
