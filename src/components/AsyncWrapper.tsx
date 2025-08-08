'use client'

import { useState, useEffect, ReactNode } from 'react'

interface AsyncWrapperProps {
  children: ReactNode
  skeleton: ReactNode
  delay?: number
  condition?: boolean
}

/**
 * A wrapper component that shows a skeleton while content is loading
 * Useful for creating smooth loading transitions with minimal delay
 */
export default function AsyncWrapper({ 
  children, 
  skeleton, 
  delay = 200,
  condition = true 
}: AsyncWrapperProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    if (!condition) {
      setShowSkeleton(false)
      return
    }

    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, condition])

  if (showSkeleton) {
    return <>{skeleton}</>
  }

  return <>{children}</>
}
