/* eslint-disable react/prop-types */
import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[120px] w-full px-3 py-2 text-sm border border-border rounded-md bg-page text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent-muted disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
