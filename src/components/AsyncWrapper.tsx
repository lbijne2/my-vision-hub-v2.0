'use client'

import { useState, useEffect, ReactNode } from 'react'
import { getPreloadedData } from './BackgroundPreloader'

interface AsyncWrapperProps {
  children: ReactNode
  skeleton: ReactNode
  delay?: number
  condition?: boolean
  preloadKey?: string // Key to check for preloaded data
  onPreloadedData?: (data: any) => void // Callback when preloaded data is found
}

/**
 * A wrapper component that shows a skeleton while content is loading
 * Enhanced to work with background preloading system
 */
export default function AsyncWrapper({ 
  children, 
  skeleton, 
  delay = 200,
  condition = true,
  preloadKey,
  onPreloadedData
}: AsyncWrapperProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [hasPreloadedData, setHasPreloadedData] = useState(false)

  useEffect(() => {
    if (!condition) {
      setShowSkeleton(false)
      return
    }

    // Check for preloaded data first
    if (preloadKey) {
      const preloadedData = getPreloadedData(preloadKey)
      if (preloadedData) {
        setHasPreloadedData(true)
        if (onPreloadedData) {
          onPreloadedData(preloadedData.data)
        }
        // Show content immediately if we have preloaded data
        setShowSkeleton(false)
        return
      }
    }

    // Fall back to normal delay behavior
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, condition, preloadKey, onPreloadedData])

  if (showSkeleton) {
    return <>{skeleton}</>
  }

  return <>{children}</>
}
