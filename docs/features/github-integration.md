# GitHub Integration

## Overview

The GitHub Integration module provides seamless connectivity between projects and their corresponding GitHub repositories. It displays repository metadata, code previews, and direct links to enhance the project showcase experience.

## 🎯 Features

### Core Functionality
- **Repository Linking**: Connect projects to GitHub repositories via URLs
- **Metadata Display**: Show stars, forks, language, and repository status
- **Code Previews**: Syntax-highlighted code snippets from repositories
- **Direct Links**: One-click access to GitHub repositories
- **Status Indicators**: Visual badges for repository activity and health

### Advanced Features
- **Real-time Updates**: Live repository data via GitHub API
- **Repository Analytics**: Activity metrics and trends
- **Code Snippet Display**: Highlighted code examples from repositories
- **Branch Information**: Display current branch and commit status
- **Issue Integration**: Link to repository issues and discussions

## 🏗️ Architecture

### Data Structure

**Project-GitHub Relationship**
```typescript
interface Project {
  // ... other project fields
  github_url?: string
}

interface GitHubRepoData {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  default_branch: string
  open_issues_count: number
  archived: boolean
  disabled: boolean
}
```

### Component Structure

```
GitHub Integration
├── GitHubRepoCard (Repository display)
│   ├── RepoHeader (Name, description)
│   ├── RepoStats (Stars, forks, language)
│   ├── RepoStatus (Archived, disabled indicators)
│   └── RepoActions (View on GitHub button)
├── GitHubCodePreview (Code snippets)
│   ├── FileSelector (Choose file to preview)
│   ├── CodeDisplay (Syntax-highlighted code)
│   └── CodeActions (Copy, download)
└── GitHubIntegration (Full integration)
    ├── RepoOverview (Complete repository info)
    ├── RecentActivity (Latest commits, issues)
    └── RepositoryMetrics (Analytics and trends)
```

## 🔧 Implementation

### GitHub API Integration

**API Client Setup**
```typescript
// src/lib/github.ts
const GITHUB_API_BASE = 'https://api.github.com'

export async function getGitHubRepoData(repoUrl: string): Promise<GitHubRepoData | null> {
  try {
    const repoPath = extractRepoPath(repoUrl)
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repoPath}`)
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching GitHub repo data:', error)
    return null
  }
}
```

**Repository Path Extraction**
```typescript
// Extract repository path from GitHub URL
export function extractRepoPath(githubUrl: string): string {
  const url = new URL(githubUrl)
  const pathParts = url.pathname.split('/').filter(Boolean)
  
  if (pathParts.length >= 2) {
    return `${pathParts[0]}/${pathParts[1]}`
  }
  
  throw new Error('Invalid GitHub repository URL')
}
```

### Code Preview Implementation

**File Content Fetching**
```typescript
export async function getGitHubFileContent(
  repoUrl: string,
  filePath: string
): Promise<string | null> {
  try {
    const repoPath = extractRepoPath(repoUrl)
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${repoPath}/contents/${filePath}`
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`)
    }
    
    const data = await response.json()
    return atob(data.content) // Decode base64 content
  } catch (error) {
    console.error('Error fetching file content:', error)
    return null
  }
}
```

## 🎨 UI Components

### GitHubRepoCard Component
```typescript
// src/components/GitHubRepoCard.tsx
interface GitHubRepoCardProps {
  repoUrl: string
  repoData?: GitHubRepoData
  showStats?: boolean
}

export function GitHubRepoCard({ 
  repoUrl, 
  repoData, 
  showStats = true 
}: GitHubRepoCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<GitHubRepoData | null>(repoData || null)

  // Fetch data if not provided
  useEffect(() => {
    if (!repoData && repoUrl) {
      setIsLoading(true)
      getGitHubRepoData(repoUrl)
        .then(setData)
        .finally(() => setIsLoading(false))
    }
  }, [repoUrl, repoData])

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />
  }

  if (!data) {
    return null
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {data.name}
            </CardTitle>
            {data.description && (
              <CardDescription className="text-sm mt-1">
                {data.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            {data.archived && (
              <Badge variant="secondary" className="text-xs">
                Archived
              </Badge>
            )}
            {data.disabled && (
              <Badge variant="destructive" className="text-xs">
                Disabled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      {showStats && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{data.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4" />
              <span>{data.forks_count}</span>
            </div>
            {data.language && (
              <div className="flex items-center gap-1">
                <Circle className="w-3 h-3" />
                <span>{data.language}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(data.html_url, '_blank')}
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
```

### GitHubCodePreview Component
```typescript
// src/components/GitHubCodePreview.tsx
interface GitHubCodePreviewProps {
  repoUrl: string
  filePath: string
  language?: string
}

export function GitHubCodePreview({ 
  repoUrl, 
  filePath, 
  language 
}: GitHubCodePreviewProps) {
  const [content, setContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (repoUrl && filePath) {
      setIsLoading(true)
      setError(null)
      
      getGitHubFileContent(repoUrl, filePath)
        .then(setContent)
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false))
    }
  }, [repoUrl, filePath])

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">Error loading file: {error}</p>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-gray-300 text-sm font-mono">{filePath}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigator.clipboard.writeText(content)}
          className="text-gray-300 hover:text-white"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language || 'text'}`}>
          {content}
        </code>
      </pre>
    </div>
  )
}
```

## 📊 Performance Optimization

### API Rate Limiting
- **Caching**: Cache GitHub API responses to reduce rate limit usage
- **Request Batching**: Combine multiple API calls where possible
- **Error Handling**: Graceful handling of rate limit errors
- **Fallback Data**: Use cached data when API is unavailable

### Code Optimization
- **Lazy Loading**: Load code previews only when needed
- **Virtual Scrolling**: For large code files (future)
- **Syntax Highlighting**: Efficient code highlighting with Prism.js
- **File Size Limits**: Limit preview size for large files

## 🔗 API Endpoints

### GitHub Status API
```typescript
// src/app/api/github/status/route.ts
export async function GET() {
  try {
    // Test GitHub API connectivity
    const response = await fetch('https://api.github.com/rate_limit')
    
    if (!response.ok) {
      throw new Error('GitHub API unavailable')
    }
    
    const data = await response.json()
    return NextResponse.json({
      status: 'connected',
      rateLimit: data.resources.core
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    )
  }
}
```

### Repository Data API
```typescript
// src/app/api/github/repo/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repoUrl = searchParams.get('url')
    
    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL required' },
        { status: 400 }
      )
    }
    
    const repoData = await getGitHubRepoData(repoUrl)
    
    if (!repoData) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(repoData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch repository data' },
      { status: 500 }
    )
  }
}
```

## 🧪 Testing

### Component Testing
```typescript
// Future testing structure
describe('GitHubRepoCard', () => {
  it('should render repository information correctly', () => {
    // Test repository display
  })
  
  it('should handle missing data gracefully', () => {
    // Test error states
  })
  
  it('should show archived/disabled badges correctly', () => {
    // Test status indicators
  })
})
```

### API Testing
```typescript
// GitHub API integration testing
describe('GitHub Integration', () => {
  it('should fetch repository data successfully', async () => {
    // Test API calls
  })
  
  it('should handle API errors gracefully', async () => {
    // Test error handling
  })
})
```

## 🚀 Future Enhancements

### Planned Features (v0.5)
- **Advanced Code Previews**: Multi-file previews and navigation
- **Repository Analytics**: Commit history and activity graphs
- **Issue Integration**: Display and link to repository issues
- **Pull Request Tracking**: Show open PRs and their status
- **Branch Comparison**: Compare different branches

### Advanced Features
- **Repository Templates**: Quick setup for new projects
- **Code Search**: Search within repository code
- **Collaboration Tools**: Team member activity tracking
- **Automation Integration**: GitHub Actions status display
- **Security Scanning**: Vulnerability alerts and recommendations

## 📚 Usage Examples

### Adding GitHub Integration to a Project
```typescript
// Update project with GitHub URL
const updatedProject = {
  ...project,
  github_url: 'https://github.com/username/repository'
}

const { data, error } = await supabase
  .from('projects')
  .update(updatedProject)
  .eq('id', project.id)
```

### Fetching Repository Data
```typescript
// Get repository information
const repoData = await getGitHubRepoData('https://github.com/user/repo')

if (repoData) {
  console.log(`Repository: ${repoData.name}`)
  console.log(`Stars: ${repoData.stargazers_count}`)
  console.log(`Language: ${repoData.language}`)
}
```

### Displaying Code Preview
```typescript
// Show code snippet from repository
<GitHubCodePreview
  repoUrl="https://github.com/user/repo"
  filePath="src/components/Example.tsx"
  language="typescript"
/>
```

### Error Handling
```typescript
// Handle GitHub API errors
try {
  const repoData = await getGitHubRepoData(repoUrl)
  // Use repository data
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limiting
    console.log('GitHub API rate limit exceeded')
  } else if (error.message.includes('not found')) {
    // Handle repository not found
    console.log('Repository not found or private')
  } else {
    // Handle other errors
    console.error('GitHub API error:', error)
  }
}
```

---

**Last Updated**: December 2024  
**Module Version**: v0.4d  
**Next Update**: v0.5 - Advanced Code Previews and Analytics 