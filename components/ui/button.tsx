import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-run-blue text-white shadow-md border-b-4 border-blue-600 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-none",
        destructive:
          "bg-run-red text-white shadow-md border-b-4 border-red-600 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-none",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-run-purple text-white shadow-md border-b-4 border-purple-700 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-none",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        green:
          "bg-run-green text-white shadow-md border-b-4 border-green-700 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-none",
        orange:
          "bg-run-orange text-white shadow-md border-b-4 border-orange-700 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-none",
        yellow:
          "bg-run-yellow text-run-dark shadow-md border-b-4 border-yellow-600 hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:shadow-none",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
