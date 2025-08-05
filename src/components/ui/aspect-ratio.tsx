import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

import { cn } from "@/lib/utils"

const AspectRatio = AspectRatioPrimitive.Root

const AspectRatioContent = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-full w-full object-cover", className)}
    {...props}
  />
))
AspectRatioContent.displayName = "AspectRatioContent"

export { AspectRatio, AspectRatioContent } 