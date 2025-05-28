import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-cocktail text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cocktail-amber focus-visible:ring-opacity-20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "btn-cocktail",
        destructive: "bg-cocktail-terracotta-500 text-white hover:bg-cocktail-terracotta-600 shadow-warm",
        outline: "btn-cocktail-outline",
        secondary: "bg-warm-100 text-warm-900 hover:bg-warm-200 shadow-elegant",
        ghost: "hover:bg-cocktail-amber-50 hover:text-cocktail-amber-600",
        link: "text-cocktail-amber-600 underline-offset-4 hover:underline",
        elegant: "bg-cocktail-elegant text-warm-800 hover:shadow-cocktail border border-cocktail-amber-200",
        sage: "bg-cocktail-sage-500 text-white hover:bg-cocktail-sage-600 shadow-warm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-cocktail-lg px-8",
        xl: "h-12 rounded-cocktail-lg px-10 text-base",
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
