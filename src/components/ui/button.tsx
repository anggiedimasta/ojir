import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-disabled",
  {
    variants: {
      color: {
        blue: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white data-[active=true]:bg-blue-800 data-[active=true]:text-white",
        red: "bg-red-600 text-white hover:bg-red-700 hover:text-white data-[active=true]:bg-red-800 data-[active=true]:text-white",
        gray: "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 data-[active=true]:bg-gray-300 data-[active=true]:text-gray-900 border-none",
        green: "bg-green-600 text-white hover:bg-green-700 hover:text-white data-[active=true]:bg-green-800 data-[active=true]:text-white",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 data-[active=true]:bg-gray-200 data-[active=true]:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 data-[active=true]:text-blue-800",
      },
      size: {
        md: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      rounded: {
        md: "rounded-md",
        full: "rounded-full",
      },
      align: {
        center: "justify-center",
        left: "justify-start",
      },
    },
    defaultVariants: {
      color: "gray",
      size: "md",
      rounded: "md",
      align: "center",
    },
  }
)

type ButtonColor = "blue" | "red" | "gray" | "green" | "ghost" | "link"

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  color?: ButtonColor
  active?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, color, size, rounded, align, active, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ color, size, rounded, align, className }))}
        ref={ref}
        data-active={active}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }