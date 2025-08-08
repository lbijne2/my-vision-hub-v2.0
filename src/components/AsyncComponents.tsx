'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectCard } from "@/components/ProjectCard"
import { GitHubRepoCard } from "@/components/GitHubRepoCard"
import { GitHubUserCard } from "@/components/GitHubUserCard"
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
import { usePreloadedData } from './BackgroundPreloader'
import { isGitHubUser, extractGitHubUsername } from '@/lib/github'
// GitHub repository data interface
export interface GitHubRepoData {
  name: string
  description: string | null
  stars: number
  forks: number
  watchers: number
  lastCommit: string
  url: string
  language: string | null
  topics: string[]
  openIssues: number
  defaultBranch: string
}

// GitHub user data interface
export interface GitHubUserData {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  followers: number
  following: number
  public_repos: number
  public_gists: number
  created_at: string
  updated_at: string
  location: string | null
  company: string | null
  blog: string | null
  twitter_username: string | null
  popularLanguages: { [key: string]: number }
}
import type { Project } from "@/types"

// ============================================================================
// ASYNC CARD WRAPPERS (For Individual Cards)
// ============================================================================

interface AsyncCardWrapperProps {
  children: React.ReactNode
  skeleton: React.ReactNode
  delay?: number
  condition?: boolean
  preloadKey?: string
  onPreloadedData?: (data: any) => void
}

/**
 * Universal async wrapper for individual cards
 * Enhanced to work with background preloading system
 */
function AsyncCardWrapper({ 
  children, 
  skeleton, 
  delay = 0,
  condition = true,
  preloadKey,
  onPreloadedData
}: AsyncCardWrapperProps) {
  return (
    <AsyncWrapper 
      skeleton={skeleton}
      delay={delay}
      condition={condition}
      preloadKey={preloadKey}
      onPreloadedData={onPreloadedData}
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
 * Enhanced to use preloaded data when available
 */
function AsyncMiniRoadmap({ maxItems = 3 }: AsyncMiniRoadmapProps) {
  return (
    <AsyncWrapper 
      skeleton={<MiniRoadmapSkeleton />}
      delay={0}
      preloadKey="milestones"
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
 * Enhanced to use preloaded data when available
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
      preloadKey="projects" // Can use preloaded projects data
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
 * Enhanced to use preloaded data when available
 */
function AsyncGitHubRepo({ repoPath }: AsyncGitHubRepoProps) {
  const [repoData, setRepoData] = useState<GitHubRepoData | null>(null)
  const [userData, setUserData] = useState<GitHubUserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUser, setIsUser] = useState(false)

  // Check for preloaded data first
  const preloadedData = usePreloadedData(`github-${repoPath}`)

  useEffect(() => {
    // If we have preloaded data, use it immediately
    if (preloadedData) {
      if (preloadedData.login) {
        // It's user data
        setUserData(preloadedData)
        setIsUser(true)
      } else {
        // It's repo data
        setRepoData(preloadedData)
        setIsUser(false)
      }
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout for GitHub API

    const fetchGitHubData = async () => {
      try {
        // Check if it's a user or repository using the same function as GitHubBrowser
        const isUserPath = isGitHubUser(repoPath)
        
        if (isUserPath) {
          // Fetch user data
          const username = extractGitHubUsername(repoPath)
          
          const response = await fetch(`/api/github?action=user&username=${encodeURIComponent(username)}`, {
            signal: controller.signal
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          setUserData(data)
          setIsUser(true)
        } else {
          // Fetch repository data
          const response = await fetch(`/api/github?action=repo&repo=${encodeURIComponent(repoPath)}`, {
            signal: controller.signal
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          setRepoData(data)
          setIsUser(false)
        }
        setError(null)
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          console.warn('GitHub data fetch aborted due to timeout')
          setError('timeout')
        } else {
          console.error('Error fetching GitHub data:', err)
          setError('fetch_error')
        }
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    fetchGitHubData()
    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [repoPath, preloadedData])

  if (loading) {
    return <GitHubRepoSkeleton />
  }

  if (error || (!repoData && !userData)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-vision-charcoal">
            GitHub {isUser ? 'User' : 'Repository'}
          </CardTitle>
          <CardDescription>
            {isUser ? 'User profile and repositories' : 'Source code and development information'}
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
          GitHub {isUser ? 'User' : 'Repository'}
        </CardTitle>
        <CardDescription>
          {isUser ? 'User profile and repositories' : 'Source code and development information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isUser && userData ? (
          <GitHubUserCard userData={userData} />
        ) : repoData ? (
          <GitHubRepoCard repoData={repoData} />
        ) : null}
      </CardContent>
    </Card>
  )
}

interface AsyncGitHubUserProps {
  username: string
}

/**
 * Complex async component for GitHub user data
 * Enhanced to use preloaded data when available
 */
function AsyncGitHubUser({ username }: AsyncGitHubUserProps) {
  const [userData, setUserData] = useState<GitHubUserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for preloaded data first
  const preloadedData = usePreloadedData(`github-user-${username}`)

  useEffect(() => {
    // If we have preloaded data, use it immediately
    if (preloadedData) {
      setUserData(preloadedData)
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout for GitHub API

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/github?action=user&username=${encodeURIComponent(username)}`, {
          signal: controller.signal
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setUserData(data)
        setError(null)
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          console.warn('GitHub user fetch aborted due to timeout')
          setError('timeout')
        } else {
          console.error('Error fetching GitHub user data:', err)
          setError('fetch_error')
        }
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    fetchUserData()
    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [username, preloadedData])

  if (loading) {
    return <GitHubRepoSkeleton />
  }

  if (error || !userData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-vision-charcoal">
            GitHub User
          </CardTitle>
          <CardDescription>
            User profile and repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-vision-charcoal/60 mb-4 text-sm">
              {error === 'timeout' 
                ? 'GitHub user information is taking longer than expected to load'
                : 'GitHub user information unavailable'
              }
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
              asChild
            >
              <a 
                href={`https://github.com/${username}`} 
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
          GitHub User
        </CardTitle>
        <CardDescription>
          User profile and repositories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GitHubUserCard userData={userData} />
      </CardContent>
    </Card>
  )
}

interface AsyncFeaturedProjectsProps {
  maxProjects?: number
}

/**
 * Complex async component for featured projects
 * Enhanced to use preloaded data when available
 */
function AsyncFeaturedProjects({ maxProjects = 3 }: AsyncFeaturedProjectsProps) {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Check for preloaded data first
  const preloadedData = usePreloadedData('projects')

  useEffect(() => {
    // If we have preloaded data, use it immediately
    if (preloadedData && preloadedData.projects) {
      setFeaturedProjects(preloadedData.projects.slice(0, maxProjects))
      setLoading(false)
      setError(null)
      setHasInitialized(true)
      return
    }

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
  }, [maxProjects, preloadedData])

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
  AsyncGitHubUser,
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
