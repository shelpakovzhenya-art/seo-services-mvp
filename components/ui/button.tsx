import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[1.1rem] text-center text-sm font-semibold leading-tight break-words whitespace-normal ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-white/35 bg-[linear-gradient(135deg,#6d49ff_0%,#8f57ff_44%,#ff4ea8_100%)] text-white shadow-[0_22px_48px_rgba(18,8,45,0.52)] hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(18,8,45,0.62)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/22 bg-[#12152a] text-slate-100 shadow-[0_16px_34px_rgba(8,7,20,0.4)] hover:border-[#9d7eff]/70 hover:bg-[#171a33]",
        secondary:
          "border border-[#7a61ff]/35 bg-[#19143a] text-slate-100 hover:bg-[#1f1945]",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-10 px-4 py-2",
        sm: "min-h-9 rounded-md px-3 py-2",
        lg: "min-h-11 rounded-md px-8 py-3",
        icon: "h-10 w-10 shrink-0 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }


