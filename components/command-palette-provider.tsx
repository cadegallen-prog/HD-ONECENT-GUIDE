"use client"

import * as React from "react"
// import dynamic from "next/dynamic"

// const CommandPalette = dynamic(
//   () => import("./command-palette").then((mod) => mod.CommandPalette),
//   {
//     loading: () => null,
//     ssr: false,
//   }
// )

interface CommandPaletteContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommandPaletteContext = React.createContext<CommandPaletteContextType | null>(null)

export function useCommandPalette() {
  const context = React.useContext(CommandPaletteContext)
  if (!context) {
    throw new Error("useCommandPalette must be used within a CommandPaletteProvider")
  }
  return context
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      {/* {mounted && <CommandPalette open={open} onOpenChange={setOpen} />} */}
    </CommandPaletteContext.Provider>
  )
}
