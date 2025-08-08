'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Github, 
  ExternalLink, 
  AlertCircle, 
  Search, 
  Star, 
  GitBranch, 
  Calendar,
  Eye,
  Lock,
  Archive,
  GitFork
} from "lucide-react"
import type { GitHubUserRepo } from "@/lib/github"

interface GitHubUserBrowserProps {
  username: string
}

export function GitHubUserBrowser({ username }: GitHubUserBrowserProps) {
  const [repos, setRepos] = useState<GitHubUserRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated')
  const [showPrivate, setShowPrivate] = useState(false)

  useEffect(() => {
    const loadUserRepos = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        
        const response = await fetch(`/api/github?action=user-repos&username=${encodeURIComponent(username)}`, {
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setRepos(data)
      } catch (err) {
        console.error('Error loading user repositories:', err)
        if ((err as any)?.name === 'AbortError') {
          setError('timeout')
        } else {
          setError('fetch_error')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUserRepos()
  }, [username])

  // Filter and sort repositories
  const filteredAndSortedRepos = repos
    .filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesVisibility = showPrivate || !repo.private
      return matchesSearch && matchesVisibility
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count
        case 'name':
          return a.name.localeCompare(b.name)
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
            <Github className="h-5 w-5" />
            User Repositories
          </CardTitle>
          <CardDescription>
            Loading repositories for @{username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-vision-border rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-vision-border rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
            <Github className="h-5 w-5" />
            User Repositories
          </CardTitle>
          <CardDescription>
            Browse repositories for @{username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-vision-charcoal/40 mx-auto mb-3" />
            <p className="text-vision-charcoal/60 mb-4 text-sm">
              {error === 'fetch_error' 
                ? 'Could not load user repositories. The user may be private or inaccessible.'
                : 'Could not load user repositories.'
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
                <ExternalLink className="h-4 w-4 mr-2" />
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
        <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
          <Github className="h-5 w-5" />
          User Repositories
        </CardTitle>
        <CardDescription>
          Browse repositories for @{username} ({repos.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vision-charcoal/40" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-vision-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vision-ochre/20 focus:border-vision-ochre"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars' | 'name')}
                className="px-3 py-2 border border-vision-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vision-ochre/20 focus:border-vision-ochre"
              >
                <option value="updated">Recently Updated</option>
                <option value="stars">Most Stars</option>
                <option value="name">Name</option>
              </select>
              <Button
                variant={showPrivate ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPrivate(!showPrivate)}
                className="text-xs"
              >
                {showPrivate ? 'Hide' : 'Show'} Private
              </Button>
            </div>
          </div>
        </div>

        {/* Repository List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAndSortedRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-4 border border-vision-border rounded-lg hover:bg-vision-ochre/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-vision-charcoal truncate">
                      <a 
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-vision-ochre hover:underline"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    {repo.private && <Lock className="h-3 w-3 text-vision-charcoal/40" />}
                    {repo.fork && <GitFork className="h-3 w-3 text-vision-charcoal/40" />}
                    {repo.archived && <Archive className="h-3 w-3 text-vision-charcoal/40" />}
                    {repo.disabled && <AlertCircle className="h-3 w-3 text-vision-charcoal/40" />}
                  </div>
                  {repo.description && (
                    <p className="text-sm text-vision-charcoal/70 mb-2 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-vision-charcoal/60">
                    {repo.language && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                      >
                        {repo.language}
                      </Badge>
                    )}
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{repo.stargazers_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitBranch className="h-3 w-3" />
                      <span>{repo.forks_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <Badge 
                          key={topic} 
                          variant="outline" 
                          className="text-xs bg-pastel-lavender/20 border-vision-border text-vision-charcoal/70"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/50"
                        >
                          +{repo.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredAndSortedRepos.length === 0 && (
            <div className="text-center py-8 text-vision-charcoal/40 text-sm">
              {searchTerm ? 'No repositories match your search.' : 'No repositories found.'}
            </div>
          )}
        </div>

        <Separator className="my-4" />
        
        <Button
          variant="outline"
          size="sm"
          className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
          asChild
        >
          <a 
            href={`https://github.com/${username}?tab=repositories`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Repositories on GitHub
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
