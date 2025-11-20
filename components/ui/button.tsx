import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, type, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border shadow-sm",
      {
        primary: "bg-primary text-primary-foreground border-transparent hover:bg-[hsl(186_70%_28%)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        outline: "border-border text-foreground hover:border-primary hover:text-primary hover:bg-secondary",
        ghost: "border-transparent text-foreground hover:bg-muted",
      }[variant],
      {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      }[size],
      className
    )

    if (href) {
      const { onClick, ...anchorProps } = props
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
