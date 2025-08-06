"use client"

import { useState, useEffect } from "react"
import { Monitor, MonitorOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WidescreenToggleProps {
  className?: string
}

export function WidescreenToggle({ className }: WidescreenToggleProps) {
  const [isWidescreen, setIsWidescreen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load saved preference from localStorage
    const saved = localStorage.getItem("widescreen-mode")
    if (saved === "true") {
      setIsWidescreen(true)
      document.documentElement.classList.add("widescreen")
    }
  }, [])

  const toggleWidescreen = () => {
    const newValue = !isWidescreen
    setIsWidescreen(newValue)
    
    // Save preference to localStorage
    localStorage.setItem("widescreen-mode", newValue.toString())
    
    // Toggle CSS class on document
    if (newValue) {
      document.documentElement.classList.add("widescreen")
    } else {
      document.documentElement.classList.remove("widescreen")
    }
  }

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <Button 
        variant="ghost" 
        className="text-vision-charcoal hover:text-vision-ochre hover:bg-vision-ochre/10"
      >
        <MonitorOff className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button 
      variant="ghost" 
      className="text-vision-charcoal hover:text-vision-ochre hover:bg-vision-ochre/10"
      onClick={toggleWidescreen}
      title={isWidescreen ? "Exit widescreen mode" : "Enter widescreen mode"}
    >
      {isWidescreen ? (
        <Monitor className="h-4 w-4" />
      ) : (
        <MonitorOff className="h-4 w-4" />
      )}
    </Button>
  )
} 