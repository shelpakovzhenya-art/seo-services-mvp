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
          "border border-[#c4976c]/30 bg-[linear-gradient(135deg,rgba(12,19,33,0.98),rgba(18,28,46,0.98)_56%,rgba(29,43,66,0.96))] text-white shadow-[0_18px_40px_rgba(2,8,23,0.24)] hover:-translate-y-0.5 hover:border-[#c4976c]/48 hover:shadow-[0_24px_54px_rgba(2,8,23,0.3)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-slate-300/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,244,239,0.94))] text-slate-900 shadow-[0_12px_28px_rgba(2,8,23,0.1)] hover:border-[#c4976c]/40 hover:bg-white",
        secondary:
          "border border-[#eadbc8] bg-[#f5efe7] text-slate-900 hover:bg-[#efe6db]",
        ghost: "hover:bg-white/10 hover:text-slate-50",
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


