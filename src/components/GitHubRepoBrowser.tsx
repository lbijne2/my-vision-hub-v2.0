'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, ExternalLink, AlertCircle, Folder, File, ChevronLeft, Search } from "lucide-react"
// GitHub file item interface
export interface GitHubFileItem {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: 'file' | 'dir'
  content?: string
  encoding?: string
}
import { Highlight, themes } from "prism-react-renderer"
import { GitHubFilePreviewSkeleton } from "@/components/ui/loading-skeletons"

interface GitHubRepoBrowserProps {
  repo: string
  initialPath?: string
}

export function GitHubRepoBrowser({ repo, initialPath = '' }: GitHubRepoBrowserProps) {
  const [contents, setContents] = useState<GitHubFileItem[]>([])
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<GitHubFileItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [viewMode, setViewMode] = useState<'browser' | 'preview'>('browser')
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false)
  const [backgroundLoadProgress, setBackgroundLoadProgress] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchCache = useRef<Map<string, GitHubFileItem[]>>(new Map())
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const repositoryCache = useRef<Map<string, GitHubFileItem[]>>(new Map())
  const backgroundLoadQueue = useRef<string[]>([])
  const isBackgroundLoadingRef = useRef(false)

  // Validate repo parameter
  useEffect(() => {
    if (!repo || repo.trim() === '') {
      console.error('GitHubRepoBrowser: Empty repo parameter provided')
      setError('invalid_repo')
      setLoading(false)
      return
    }

    // Validate repo format (should contain owner/repo)
    if (!repo.includes('/')) {
      console.error('GitHubRepoBrowser: Invalid repo format, expected owner/repo:', repo)
      setError('invalid_repo_format')
      setLoading(false)
      return
    }

    const loadContents = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout
        
        const response = await fetch(`/api/github?action=contents&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(currentPath)}`, {
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('GitHub API error response:', errorText)
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }
        
        const repoContents = await response.json()
        setContents(repoContents)
        setSelectedFile(null)
        setFileContent(null)
        
        // Start background loading of entire repository
        if (currentPath === '' && !isBackgroundLoadingRef.current) {
          // Cache the root directory first
          await loadDirectoryToCache('')
          
          // Start background loading worker
          setTimeout(() => {
            backgroundLoadWorker()
          }, 1000) // Start after 1 second to let initial load complete
        }
      } catch (err) {
        console.error('Error loading repository contents:', err)
        if ((err as any)?.name === 'AbortError') {
          setError('timeout')
        } else {
          setError('fetch_error')
        }
      } finally {
        setLoading(false)
      }
    }

    loadContents()
  }, [repo, currentPath])

  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Load file content when a file is selected
  useEffect(() => {
    if (!selectedFile) return

    const loadFileContent = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const response = await fetch(`/api/github?action=file&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(selectedFile)}`, {
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('GitHub API error response:', errorText)
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }
        
        const data = await response.json()
        if (data.content) {
          setFileContent(data.content)
          setViewMode('preview')
        } else {
          setError('file_not_found')
        }
      } catch (err) {
        console.error('Error loading file content:', err)
        if ((err as any)?.name === 'AbortError') {
          setError('timeout')
        } else {
          setError('fetch_error')
        }
      } finally {
        setLoading(false)
      }
    }

    loadFileContent()
  }, [repo, selectedFile])

  // Determine file extension for syntax highlighting
  const getFileExtension = (filePath: string): string => {
    const parts = filePath.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : ''
  }

  const getLanguage = (filePath: string): string => {
    const ext = getFileExtension(filePath).toLowerCase()
    const languageMap: { [key: string]: string } = {
      'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
      'json': 'json', 'md': 'markdown', 'mdx': 'markdown', 'py': 'python',
      'java': 'java', 'cpp': 'cpp', 'c': 'c', 'cs': 'csharp', 'php': 'php',
      'rb': 'ruby', 'go': 'go', 'rs': 'rust', 'swift': 'swift', 'kt': 'kotlin',
      'scala': 'scala', 'html': 'html', 'css': 'css', 'scss': 'scss', 'sass': 'sass',
      'less': 'less', 'xml': 'xml', 'yaml': 'yaml', 'yml': 'yaml', 'toml': 'toml',
      'ini': 'ini', 'sh': 'bash', 'bash': 'bash', 'zsh': 'bash', 'sql': 'sql',
      'r': 'r', 'm': 'matlab', 'tex': 'latex', 'vue': 'vue', 'svelte': 'svelte', 'astro': 'astro'
    }
    return languageMap[ext] || 'text'
  }

  // Background loading function to cache entire repository
  const loadDirectoryToCache = async (path: string): Promise<GitHubFileItem[]> => {
    const cacheKey = path || 'root'
    
    // Check if already cached
    if (repositoryCache.current.has(cacheKey)) {
      return repositoryCache.current.get(cacheKey)!
    }
    
    try {
      const response = await fetch(`/api/github?action=contents&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}`)
      if (!response.ok) {
        return []
      }
      
      const directoryContents = await response.json()
      
      // Cache this directory
      repositoryCache.current.set(cacheKey, directoryContents)
      
      // Add subdirectories to background load queue
      for (const item of directoryContents) {
        if (item.type === 'dir') {
          backgroundLoadQueue.current.push(item.path)
        }
      }
      
      return directoryContents
    } catch (err) {
      console.warn(`Could not load directory to cache: ${path}`)
      return []
    }
  }

  // Background loading worker
  const backgroundLoadWorker = async () => {
    if (isBackgroundLoadingRef.current) return
    
    isBackgroundLoadingRef.current = true
    setIsBackgroundLoading(true)
    
    let processedItems = 0
    let totalItems = backgroundLoadQueue.current.length
    
    while (backgroundLoadQueue.current.length > 0) {
      const path = backgroundLoadQueue.current.shift()!
      
      try {
        await loadDirectoryToCache(path)
        processedItems++
        
        // Update total items as the queue might have grown
        totalItems = Math.max(totalItems, backgroundLoadQueue.current.length + processedItems)
        
        // Ensure progress doesn't exceed 100%
        const progress = Math.min((processedItems / totalItems) * 100, 100)
        setBackgroundLoadProgress(progress)
        
        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (err) {
        console.warn(`Failed to load directory in background: ${path}`)
      }
    }
    
    isBackgroundLoadingRef.current = false
    setIsBackgroundLoading(false)
    setBackgroundLoadProgress(100)
  }

  // Search in cached repository data
  const searchInCache = (query: string): GitHubFileItem[] => {
    const results: GitHubFileItem[] = []
    const queryLower = query.toLowerCase()
    
    // Search through all cached directories
    for (const [path, items] of repositoryCache.current) {
      for (const item of items) {
        if (item.name.toLowerCase().includes(queryLower) ||
            item.path.toLowerCase().includes(queryLower)) {
          results.push(item)
        }
      }
    }
    
    return results
  }

  // Optimized search function using cached repository data
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    // Check search cache first
    const cachedResults = searchCache.current.get(query)
    if (cachedResults) {
      setSearchResults(cachedResults)
      setShowSearchDropdown(true)
      return
    }

    setIsSearching(true)
    setShowSearchDropdown(true)
    
    try {
      let searchResults: GitHubFileItem[] = []
      
      // If we have cached repository data, search in it (instant)
      if (repositoryCache.current.size > 0) {
        searchResults = searchInCache(query)
      } else {
        // Fallback to current directory search if cache is empty
        searchResults = contents.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.path.toLowerCase().includes(query.toLowerCase())
        )
      }
      
      // Cache the results
      searchCache.current.set(query, searchResults)
      
      setSearchResults(searchResults)
    } catch (err) {
      console.error('Error performing search:', err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [repo, contents])

  // Debounced search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (value.trim()) {
      // Debounce search by 300ms
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value)
      }, 300)
    } else {
      setSearchResults([])
      setShowSearchDropdown(false)
    }
  }

  // Navigate to a search result
  const navigateToSearchResult = (item: GitHubFileItem) => {
    if (item.type === 'dir') {
      setCurrentPath(item.path)
    } else {
      selectFile(item.path)
    }
    setSearchTerm('')
    setSearchResults([])
    setShowSearchDropdown(false)
  }

  // Filter contents based on search term (for current directory only)
  const filteredContents = contents.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Navigate to parent directory
  const goToParent = () => {
    const pathParts = currentPath.split('/').filter(Boolean)
    pathParts.pop()
    setCurrentPath(pathParts.join('/'))
  }

  // Navigate to directory
  const goToDirectory = (path: string) => {
    setCurrentPath(path)
  }

  // Select file for preview
  const selectFile = (path: string) => {
    setSelectedFile(path)
  }

  // Go back to browser view
  const goBackToBrowser = () => {
    setViewMode('browser')
    setSelectedFile(null)
    setFileContent(null)
  }

  if (loading && viewMode === 'browser') {
    return <GitHubFilePreviewSkeleton />
  }

  if (error && viewMode === 'browser') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Repository Browser
          </CardTitle>
          <CardDescription>
            Browse files in GitHub repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-vision-charcoal/40 mx-auto mb-3" />
            <p className="text-vision-charcoal/60 mb-4 text-sm">
              {error === 'fetch_error' 
                ? 'Could not load repository contents. The repository may be private or inaccessible.'
                : error === 'timeout'
                ? 'Request timed out. Please try again.'
                : error === 'invalid_repo'
                ? 'No repository specified.'
                : error === 'invalid_repo_format'
                ? 'Invalid repository format. Expected "owner/repo".'
                : 'Could not load repository contents.'
              }
            </p>
            {repo && repo.includes('/') && (
              <Button
                variant="outline"
                size="sm"
                className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
                asChild
              >
                <a 
                  href={`https://github.com/${repo}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // File preview mode
  if (viewMode === 'preview' && selectedFile && fileContent) {
    const language = getLanguage(selectedFile)
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedFile}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={goBackToBrowser}
              className="text-vision-charcoal border-vision-border hover:bg-vision-ochre/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Browser
            </Button>
          </div>
          <CardDescription>
            File content from GitHub repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-vision-charcoal/60">
              <span className="font-medium">Language:</span>
              <span className="capitalize">{language}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
              asChild
            >
              <a 
                href={`https://github.com/${repo}/blob/main/${selectedFile}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
          <Separator className="mb-4" />
          <div className="relative">
            <Highlight
              theme={themes.github}
              code={fileContent}
              language={language}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre 
                  className={`${className} rounded-lg p-4 overflow-x-auto text-sm max-h-96 overflow-y-auto`} 
                  style={style}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Browser mode
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Repository Browser
        </CardTitle>
        <CardDescription>
          Browse and preview files from GitHub repository
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-4 text-sm text-vision-charcoal/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPath('')}
            className="text-vision-ochre hover:text-vision-ochre/80"
          >
            {repo}
          </Button>
          {currentPath && (
            <>
              <span>/</span>
              {currentPath.split('/').map((part, index, array) => (
                <div key={index} className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newPath = array.slice(0, index + 1).join('/')
                      setCurrentPath(newPath)
                    }}
                    className="text-vision-ochre hover:text-vision-ochre/80"
                  >
                    {part}
                  </Button>
                  {index < array.length - 1 && <span>/</span>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vision-charcoal/40" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.trim() && setShowSearchDropdown(true)}
            className="w-full pl-10 pr-4 py-2 border border-vision-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vision-ochre/20 focus:border-vision-ochre"
          />
          
          {/* Search Results Dropdown */}
          {showSearchDropdown && (searchResults.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-vision-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center text-sm text-vision-charcoal/60">
                  Searching...
                </div>
              ) : (
                <>
                  <div className="p-2 text-xs font-medium text-vision-charcoal/40 border-b border-vision-border">
                    Search Results ({searchResults.length})
                    {repositoryCache.current.size > 0 && (
                      <span className="ml-2 text-vision-ochre">• Cached</span>
                    )}
                  </div>
                  {searchResults.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigateToSearchResult(item)}
                      className="w-full p-2 text-left hover:bg-vision-ochre/10 flex items-center gap-2 text-sm"
                    >
                      {item.type === 'dir' ? (
                        <Folder className="h-4 w-4 text-vision-ochre" />
                      ) : (
                        <File className="h-4 w-4 text-vision-charcoal/60" />
                      )}
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="text-xs text-vision-charcoal/40 truncate">
                        {item.path}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Background Loading Indicator */}
        {isBackgroundLoading && (
          <div className="mb-3 p-2 bg-vision-beige/30 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-vision-charcoal/60">
              <div className="flex-1 bg-vision-border rounded-full h-1 min-w-0">
                <div 
                  className="bg-vision-ochre h-1 rounded-full transition-all duration-300"
                  style={{ width: `${backgroundLoadProgress}%` }}
                />
              </div>
              <span className="whitespace-nowrap flex-shrink-0">Loading repository...</span>
            </div>
          </div>
        )}

        {/* File List */}
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {currentPath && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToParent}
              className="w-full justify-start text-vision-charcoal/70 hover:text-vision-ochre hover:bg-vision-ochre/10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              ..
            </Button>
          )}
          
          {contents.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => {
                if (item.type === 'dir') {
                  goToDirectory(item.path)
                } else {
                  selectFile(item.path)
                }
              }}
              className="w-full justify-start text-vision-charcoal hover:text-vision-ochre hover:bg-vision-ochre/10"
            >
              {item.type === 'dir' ? (
                <Folder className="h-4 w-4 mr-2 text-vision-ochre" />
              ) : (
                <File className="h-4 w-4 mr-2 text-vision-charcoal/60" />
              )}
              {item.name}
            </Button>
          ))}
          
          {contents.length === 0 && (
            <div className="text-center py-4 text-vision-charcoal/40 text-sm">
              No files in this directory
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
            href={`https://github.com/${repo}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Repository on GitHub
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
