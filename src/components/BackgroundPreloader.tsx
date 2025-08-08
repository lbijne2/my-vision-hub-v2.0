'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Cache for storing preloaded data
const preloadCache = new Map<string, any>()
const preloadQueue = new Set<string>()
let isPreloading = false

// Define navigation patterns and what should be preloaded
const navigationPatterns: Record<string, {
  pages: string[]
  data: string[]
  priority: 'high' | 'medium' | 'low'
}> = {
  // Homepage patterns
  '/': {
    pages: ['/projects', '/blog', '/timeline', '/resources', '/agents'],
    data: ['projects', 'blog-posts', 'milestones'],
    priority: 'high'
  },
  
  // Projects page patterns
  '/projects': {
    pages: [], // Will be populated dynamically based on project slugs
    data: ['projects'],
    priority: 'high'
  },
  
  // Individual project patterns
  '/projects/[slug]': {
    pages: ['/projects'], // Back to projects list
    data: ['projects', 'blog-posts', 'milestones'], // Related content
    priority: 'medium'
  },
  
  // Blog patterns
  '/blog': {
    pages: ['/projects', '/timeline'],
    data: ['blog-posts', 'projects'],
    priority: 'medium'
  },
  
  // Individual blog post patterns
  '/blog/[slug]': {
    pages: ['/blog', '/projects'],
    data: ['blog-posts', 'projects'],
    priority: 'medium'
  },
  
  // Timeline patterns
  '/timeline': {
    pages: ['/projects', '/blog'],
    data: ['milestones', 'projects', 'blog-posts'],
    priority: 'medium'
  },
  
  // Resources patterns
  '/resources': {
    pages: ['/projects', '/agents'],
    data: ['projects', 'agents'],
    priority: 'low'
  },
  
  // Agents patterns
  '/agents': {
    pages: ['/projects', '/resources'],
    data: ['agents', 'projects'],
    priority: 'low'
  },
  
  // Dashboard patterns
  '/dashboard': {
    pages: ['/projects', '/timeline'],
    data: ['projects', 'milestones'],
    priority: 'low'
  }
}

interface PreloadItem {
  type: 'page' | 'data'
  key: string
  url?: string
  priority: 'high' | 'medium' | 'low'
}

interface BackgroundPreloaderProps {
  children: React.ReactNode
  enablePreloading?: boolean
  maxConcurrent?: number
}

/**
 * BackgroundPreloader component that intelligently preloads pages and data
 * based on the current page context and navigation patterns.
 */
export function BackgroundPreloader({ 
  children, 
  enablePreloading = true,
  maxConcurrent = 3 
}: BackgroundPreloaderProps) {
  const pathname = usePathname()
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isPreloadingRef = useRef(false)

  // Get preload items for current path
  const getPreloadItems = useCallback((currentPath: string): PreloadItem[] => {
    const items: PreloadItem[] = []
    
    // Find matching pattern
    let pattern = navigationPatterns[currentPath as keyof typeof navigationPatterns]
    
    // If no exact match, try to match dynamic routes
    if (!pattern) {
      if (currentPath.startsWith('/projects/') && currentPath !== '/projects') {
        pattern = navigationPatterns['/projects/[slug]']
      } else if (currentPath.startsWith('/blog/') && currentPath !== '/blog') {
        pattern = navigationPatterns['/blog/[slug]']
      }
    }
    
    if (!pattern) return items
    
    // Add page preloads
    pattern.pages.forEach(page => {
      items.push({
        type: 'page',
        key: page,
        url: page,
        priority: pattern.priority
      })
    })
    
    // Add data preloads
    pattern.data.forEach(dataType => {
      items.push({
        type: 'data',
        key: dataType,
        priority: pattern.priority
      })
    })
    
    return items
  }, [])

  // Preload a single item
  const preloadItem = useCallback(async (item: PreloadItem) => {
    if (preloadCache.has(item.key)) {
      return // Already cached
    }
    
    try {
      if (item.type === 'page') {
        // Preload page by making a HEAD request
        const response = await fetch(item.url!, { 
          method: 'HEAD',
          cache: 'force-cache'
        })
        if (response.ok) {
          preloadCache.set(item.key, { type: 'page', url: item.url, timestamp: Date.now() })
        }
      } else if (item.type === 'data') {
        // Preload data by making API calls
        const apiEndpoints = {
          'projects': '/api/projects',
          'blog-posts': '/api/blog-posts',
          'milestones': '/api/milestones',
          'agents': '/api/agents'
        }
        
        const endpoint = apiEndpoints[item.key as keyof typeof apiEndpoints]
        if (endpoint) {
          const response = await fetch(endpoint, { cache: 'force-cache' })
          if (response.ok) {
            const data = await response.json()
            preloadCache.set(item.key, { 
              type: 'data', 
              data, 
              timestamp: Date.now() 
            })
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to preload ${item.type}: ${item.key}`, error)
    }
  }, [])

  // Preload project detail pages for projects list
  const preloadProjectDetails = useCallback(async () => {
    if (pathname === '/projects') {
      try {
        // Get projects data to preload individual project pages
        const response = await fetch('/api/projects', { cache: 'force-cache' })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.projects) {
            // Preload first 5 project detail pages
            const projectsToPreload = data.projects.slice(0, 5)
            for (const project of projectsToPreload) {
              const projectKey = `project-${project.slug}`
              if (!preloadCache.has(projectKey)) {
                preloadCache.set(projectKey, { 
                  type: 'page', 
                  url: `/projects/${project.slug}`, 
                  timestamp: Date.now() 
                })
              }
            }
          }
        }
      } catch (error) {
        console.warn('Failed to preload project details:', error)
      }
    }
  }, [pathname])

  // Main preloading function
  const startPreloading = useCallback(async () => {
    if (!enablePreloading || isPreloadingRef.current) return
    
    isPreloadingRef.current = true
    
    try {
      const items = getPreloadItems(pathname)
      
      // Sort by priority
      const sortedItems = items.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
      
      // Preload high priority items first
      const highPriorityItems = sortedItems.filter(item => item.priority === 'high')
      const mediumPriorityItems = sortedItems.filter(item => item.priority === 'medium')
      const lowPriorityItems = sortedItems.filter(item => item.priority === 'low')
      
      // Process items in batches
      const processBatch = async (batch: PreloadItem[]) => {
        const promises = batch.slice(0, maxConcurrent).map(item => preloadItem(item))
        await Promise.allSettled(promises)
      }
      
      // Process high priority items immediately
      if (highPriorityItems.length > 0) {
        await processBatch(highPriorityItems)
      }
      
      // Process medium priority items with a small delay
      if (mediumPriorityItems.length > 0) {
        setTimeout(() => {
          processBatch(mediumPriorityItems)
        }, 1000)
      }
      
      // Process low priority items with a longer delay
      if (lowPriorityItems.length > 0) {
        setTimeout(() => {
          processBatch(lowPriorityItems)
        }, 3000)
      }
      
      // Special case: preload project details for projects page
      await preloadProjectDetails()
      
    } catch (error) {
      console.warn('Background preloading error:', error)
    } finally {
      isPreloadingRef.current = false
    }
  }, [pathname, enablePreloading, maxConcurrent, getPreloadItems, preloadItem, preloadProjectDetails])

  // Start preloading when pathname changes
  useEffect(() => {
    if (!enablePreloading) return
    
    // Clear any existing timeout
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current)
    }
    
    // Start preloading after a short delay to avoid blocking initial page load
    preloadTimeoutRef.current = setTimeout(() => {
      startPreloading()
    }, 500)
    
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current)
      }
    }
  }, [pathname, enablePreloading, startPreloading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current)
      }
    }
  }, [])

  return <>{children}</>
}

// Utility functions for accessing preloaded data
export const getPreloadedData = (key: string) => {
  return preloadCache.get(key)
}

export const clearPreloadCache = () => {
  preloadCache.clear()
}

export const getPreloadCacheSize = () => {
  return preloadCache.size
}

// Hook for components to access preloaded data
export const usePreloadedData = (key: string) => {
  const data = getPreloadedData(key)
  return data?.data || null
}
