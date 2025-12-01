import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "default" | "lg"
  href?: string
  download?: string
  target?: string
  rel?: string
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "secondary", size = "default", href, type, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        primary: "bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5",
        secondary: "bg-transparent border border-border hover:bg-accent-muted hover:border-accent text-text-primary",
        ghost: "bg-transparent text-text-secondary hover:bg-elevated hover:text-text-primary",
      }[variant],
      {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
      }[size],
      className
    )

    if (href) {
      const anchorProps = props
      return (
        <a
          href={href}
          className={classes}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...(anchorProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      )
    }

    return (
      <button
        type={(type as "button" | "submit" | "reset") || "button"}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
