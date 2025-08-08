'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, Zap, Info } from "lucide-react"
import { getPreloadCacheSize, clearPreloadCache } from './BackgroundPreloader'

interface PreloadStatusProps {
  showDetails?: boolean
  className?: string
}

/**
 * Component to display the status of the background preloading system
 * Useful for debugging and monitoring preloading performance
 */
export function PreloadStatus({ showDetails = false, className = "" }: PreloadStatusProps) {
  const [cacheSize, setCacheSize] = useState(0)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isVisible, setIsVisible] = useState(false)

  // Update cache size periodically
  useEffect(() => {
    const updateCacheInfo = () => {
      setCacheSize(getPreloadCacheSize())
      setLastUpdate(new Date())
    }

    updateCacheInfo()
    const interval = setInterval(updateCacheInfo, 2000)

    return () => clearInterval(interval)
  }, [])

  // Show component only in development or when explicitly enabled
  useEffect(() => {
    setIsVisible(process.env.NODE_ENV === 'development' || showDetails)
  }, [showDetails])

  if (!isVisible) return null

  const handleClearCache = () => {
    clearPreloadCache()
    setCacheSize(0)
    setLastUpdate(new Date())
  }

  const getCacheStatus = () => {
    if (cacheSize === 0) return 'empty'
    if (cacheSize < 5) return 'low'
    if (cacheSize < 10) return 'medium'
    return 'high'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-gray-100 text-gray-600'
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <Card className={`${className} max-w-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Preload Status
        </CardTitle>
        <CardDescription className="text-xs">
          Background preloading system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Cache Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-3 w-3 text-vision-charcoal/60" />
            <span className="text-xs text-vision-charcoal/70">Cache:</span>
          </div>
          <Badge 
            variant="secondary" 
            className={`text-xs ${getStatusColor(getCacheStatus())}`}
          >
            {cacheSize} items
          </Badge>
        </div>

        {/* Last Update */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3 text-vision-charcoal/60" />
            <span className="text-xs text-vision-charcoal/70">Updated:</span>
          </div>
          <span className="text-xs text-vision-charcoal/60">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            className="text-xs h-6 px-2"
          >
            Clear Cache
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => {
              setCacheSize(getPreloadCacheSize())
              setLastUpdate(new Date())
            }}
          >
            Refresh
          </Button>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 pt-2 border-t border-vision-border">
          <Info className="h-3 w-3 text-vision-charcoal/40 mt-0.5" />
          <div className="text-xs text-vision-charcoal/50">
            <p>Preloading improves navigation speed by caching data and pages in the background.</p>
            <p className="mt-1">Cache size indicates how much data is ready for instant access.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
