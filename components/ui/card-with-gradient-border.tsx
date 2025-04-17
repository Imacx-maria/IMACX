import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card" // Import the standard Card

interface CardWithGradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  // You can add specific props here if needed, e.g., gradient colors
  borderWidth?: string // e.g., "p-[1px]", "p-[1.5px]", "p-[2px]"
  innerClassName?: string // ClassName for the inner Card component
}

const CardWithGradientBorder = React.forwardRef<
  HTMLDivElement,
  CardWithGradientBorderProps
>(({ className, children, borderWidth = "p-[1.5px]", innerClassName, ...props }, ref) => {
  return (
    // Outer container for the gradient border effect
    // 'group' enables targeting based on hover/focus-within state
    // padding creates the space for the border
    // 'rounded-lg' or similar for outer rounding
    // Gradient applied on hover and focus-within
    // Standard/fast transition duration
    <div
      ref={ref}
      className={cn(
        "group relative", // Removed rounded-xl
        borderWidth, // e.g., p-[1.5px]
        "bg-transparent",
        "transition-all duration-200 ease-in-out", // Faster transition
        // Apply gradient on hover and focus-within
        "hover:bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600",
        "focus-within:bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600",
        className // Allow overriding classes
      )}
      {...props}
    >
      {/* 
        The actual Card component sits inside. 
        It needs its own background to cover the parent's background initially.
        Slightly smaller rounding prevents gradient bleed.
      */}
      <Card className={cn(
        "w-full h-full", // Ensure it fills the parent
        innerClassName // Allow passing classes to the inner card
      )}>
        {children} 
      </Card>
    </div>
  )
})
CardWithGradientBorder.displayName = "CardWithGradientBorder"

export { CardWithGradientBorder }

// You might want to export the standard card parts too if this component 
// is intended to completely replace `<Card>` usage where the effect is desired.
// export { CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card" 