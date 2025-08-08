'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectCard } from "@/components/ProjectCard"
import { GitHubRepoCard } from "@/components/GitHubRepoCard"
import { MiniRoadmap } from "@/components/MiniRoadmap"
import RelatedContent from "@/components/RelatedContent"
import AsyncWrapper from '@/components/AsyncWrapper'
import { 
  MiniRoadmapSkeleton, 
  RelatedContentSkeleton, 
  GitHubRepoSkeleton,
  FeaturedProjectsSkeleton,
  ProjectCardSkeleton,
  BlogPostCardSkeleton,
  AgentCardSkeleton,
  ProjectStatusSkeleton,
  TimelineSkeleton
} from '@/components/ui/loading-skeletons'
import { getRepoInfo } from "@/lib/github"
import type { Project } from "@/types"

// ============================================================================
// ASYNC CARD WRAPPERS (For Individual Cards)
// ============================================================================

interface AsyncCardWrapperProps {
  children: React.ReactNode
  skeleton: React.ReactNode
  delay?: number
  condition?: boolean
}

/**
 * Universal async wrapper for individual cards
 * Provides skeleton loading for cards that load asynchronously
 */
function AsyncCardWrapper({ 
  children, 
  skeleton, 
  delay = 0,
  condition = true 
}: AsyncCardWrapperProps) {
  return (
    <AsyncWrapper 
      skeleton={skeleton}
      delay={delay}
      condition={condition}
    >
      {children}
    </AsyncWrapper>
  )
}

// ============================================================================
// SIMPLE ASYNC WRAPPERS (Using AsyncWrapper)
// ============================================================================

interface AsyncMiniRoadmapProps {
  maxItems?: number
}

/**
 * Async wrapper for MiniRoadmap component using the universal AsyncWrapper
 * This provides skeleton loading with a small delay for better UX
 */
function AsyncMiniRoadmap({ maxItems = 3 }: AsyncMiniRoadmapProps) {
  return (
    <AsyncWrapper 
      skeleton={<MiniRoadmapSkeleton />}
      delay={0}
    >
      <MiniRoadmap maxItems={maxItems} />
    </AsyncWrapper>
  )
}

interface AsyncRelatedContentProps {
  relatedProjects?: string[]
  relatedBlogPosts?: string[]
  relatedMilestones?: string[]
  relatedAgents?: string[]
  className?: string
}

/**
 * Async wrapper for RelatedContent component using the universal AsyncWrapper
 * This provides skeleton loading with validation delay for better UX
 */
function AsyncRelatedContent({
  relatedProjects,
  relatedBlogPosts,
  relatedMilestones,
  relatedAgents,
  className = ""
}: AsyncRelatedContentProps) {
  // Check if there's any related content to show
  const hasRelatedContent = relatedProjects?.length || 
    relatedBlogPosts?.length || 
    relatedMilestones?.length || 
    relatedAgents?.length

  return (
    <AsyncWrapper 
      skeleton={<RelatedContentSkeleton />}
      delay={0}
      condition={!!hasRelatedContent}
    >
      <RelatedContent
        relatedProjects={relatedProjects}
        relatedBlogPosts={relatedBlogPosts}
        relatedMilestones={relatedMilestones}
        relatedAgents={relatedAgents}
        className={className}
      />
    </AsyncWrapper>
  )
}

// ============================================================================
// COMPLEX ASYNC COMPONENTS (Data Fetching + Error Handling)
// ============================================================================

interface AsyncGitHubRepoProps {
  repoPath: string
}

/**
 * Complex async component for GitHub repository data
 * Handles data fetching, error states, and complex UI rendering
 */
function AsyncGitHubRepo({ repoPath }: AsyncGitHubRepoProps) {
  const [repoData, setRepoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout for GitHub API

    const fetchRepoData = async () => {
      try {
        const data = await getRepoInfo(repoPath)
        setRepoData(data)
        setError(null)
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          console.warn('GitHub repo fetch aborted due to timeout')
          setError('timeout')
        } else {
          console.error('Error fetching GitHub repository data:', err)
          setError('fetch_error')
        }
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    fetchRepoData()
    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [repoPath])

  if (loading) {
    return <GitHubRepoSkeleton />
  }

  if (error || !repoData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-vision-charcoal">
            GitHub Repository
          </CardTitle>
          <CardDescription>
            Source code and development information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-vision-charcoal/60 mb-4 text-sm">
              {error === 'timeout' 
                ? 'GitHub information is taking longer than expected to load'
                : 'GitHub information unavailable'
              }
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
              asChild
            >
              <a 
                href={`https://github.com/${repoPath}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-vision-charcoal">
          GitHub Repository
        </CardTitle>
        <CardDescription>
          Source code and development information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GitHubRepoCard repoData={repoData} />
      </CardContent>
    </Card>
  )
}

interface AsyncFeaturedProjectsProps {
  maxProjects?: number
}

/**
 * Complex async component for featured projects
 * Handles data fetching, error states, and complex UI rendering
 */
function AsyncFeaturedProjects({ maxProjects = 3 }: AsyncFeaturedProjectsProps) {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Reset state on mount
    setLoading(true)
    setError(null)
    setFeaturedProjects([])
    setHasInitialized(false)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const fetchFeaturedProjects = async () => {
      try {
        // Try to fetch from API
        const response = await fetch('/api/projects', { signal: controller.signal })
        const data = await response.json()
        
        if (data.success && data.projects.length > 0) {
          // Use projects from API
          setFeaturedProjects(data.projects.slice(0, maxProjects))
          setError(null)
        } else {
          // No projects available from API
          setFeaturedProjects([])
          setError('fetch_error')
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          console.warn('Featured projects fetch aborted due to timeout')
          setError('timeout')
        } else {
          console.error('Error fetching featured projects:', err)
          setError('fetch_error')
        }
        setFeaturedProjects([])
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
        setHasInitialized(true)
      }
    }

    // Add a small delay to ensure state is properly reset
    const initTimeout = setTimeout(() => {
      fetchFeaturedProjects()
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(initTimeout)
      controller.abort()
    }
  }, [maxProjects])

  // Debug logging
  console.log('AsyncFeaturedProjects state:', { loading, error, projectsCount: featuredProjects.length, hasInitialized })

  // Always show skeleton when loading and not initialized
  if (loading && !hasInitialized) {
    return <FeaturedProjectsSkeleton />
  }

  // Show error state only when there's an error and not loading
  if (error && !loading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vision-charcoal mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-vision-charcoal/70 max-w-2xl mx-auto">
              Current explorations and ongoing work at the intersection of technology, 
              medicine, and human potential.
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-vision-charcoal/60 mb-4">
              {error === 'timeout' 
                ? 'Projects are taking longer than expected to load'
                : error === 'fetch_error'
                ? 'Unable to load featured projects at the moment'
                : 'No featured projects available at the moment'
              }
            </p>
            <Button 
              variant="outline" 
              className="border-vision-border text-vision-charcoal hover:bg-vision-ochre/10"
              asChild
            >
              <Link href="/projects">
                View All Projects
              </Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-vision-charcoal mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-vision-charcoal/70 max-w-2xl mx-auto">
            Current explorations and ongoing work at the intersection of technology, 
            medicine, and human potential.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-vision-border text-vision-charcoal hover:bg-vision-ochre/10"
            asChild
          >
            <Link href="/projects">
              View All Projects
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// EXPORT ALL ASYNC COMPONENTS
// ============================================================================

export {
  // Async Card Wrapper
  AsyncCardWrapper,
  
  // Simple Wrapper Components
  AsyncMiniRoadmap,
  AsyncRelatedContent,
  
  // Complex Data-Fetching Components
  AsyncGitHubRepo,
  AsyncFeaturedProjects,
  
  // Skeleton Components (re-exported from loading-skeletons)
  ProjectCardSkeleton,
  BlogPostCardSkeleton,
  AgentCardSkeleton,
  GitHubRepoSkeleton,
  RelatedContentSkeleton,
  MiniRoadmapSkeleton,
  FeaturedProjectsSkeleton,
  ProjectStatusSkeleton,
  TimelineSkeleton,
}
