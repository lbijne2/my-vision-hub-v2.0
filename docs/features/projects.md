# Projects Module

## Overview

The Projects module is a core feature of My Vision Hub v2.0 that showcases personal and professional projects in a narrative-driven format. It provides dynamic project pages with rich content, GitHub integration, and advanced filtering capabilities.

## 🎯 Features

### Core Functionality
- **Dynamic Project Pages**: Each project has its own URL (`/projects/[slug]`)
- **Rich Content Display**: Markdown rendering with custom styling
- **Status Management**: Active, Prototype, and Archived statuses
- **Tag System**: Categorization and filtering by tags
- **Cover Images**: Visual project representation
- **GitHub Integration**: Repository linking and metadata display

### Advanced Features (v0.4e)
- **Interactive Search**: Real-time search across titles, subtitles, descriptions, and tags
- **Tag-Based Filtering**: Multi-select tag filtering with visual feedback
- **Status Filters**: Filter by Active, Prototype, or Archived status
- **Results Counter**: Shows filtered vs total project count
- **Clear All Filters**: One-click reset functionality
- **Responsive Design**: Smooth animations and Vision Hub design language

## 🏗️ Architecture

### Data Structure

**Database Schema** (Supabase)
```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  subtitle text,
  description text,
  cover_image_url text,
  tags text[],
  status text CHECK (status IN ('active', 'prototype', 'archived')),
  github_url text,
  notion_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**TypeScript Interface**
```typescript
interface Project {
  id: string
  title: string
  slug: string
  subtitle?: string
  description?: string
  cover_image_url?: string
  tags: string[]
  status: 'active' | 'prototype' | 'archived'
  github_url?: string
  notion_url?: string
  created_at: string
  updated_at: string
}
```

### Component Structure

```
Projects Module
├── ProjectGrid (Main container)
│   ├── ProjectFilters (Search and filtering)
│   │   ├── SearchBar (Real-time search)
│   │   ├── TagFilter (Multi-select tags)
│   │   ├── StatusFilter (Status dropdown)
│   │   └── ClearFilters (Reset button)
│   └── ProjectCard[] (Project display)
│       ├── ProjectImage (Cover image)
│       ├── ProjectInfo (Title, subtitle, description)
│       ├── ProjectTags (Tag badges)
│       ├── ProjectStatus (Status badge)
│       └── GitHubRepoCard (Repository info)
└── ProjectDetail (Individual project page)
    ├── ProjectHeader (Title, status, tags)
    ├── ProjectContent (Markdown content)
    ├── GitHubIntegration (Repository details)
    └── RelatedContent (Related projects)
```

## 🔧 Implementation

### Data Fetching

**Primary Data Source** (Supabase)
```typescript
// src/lib/projects.ts
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return data || []
}
```

**Fallback Strategy**
```typescript
// Graceful fallback to local data
const projects = await getSupabaseProjects() || getLocalProjects()
```

### Filtering and Search

**Search Implementation**
```typescript
// Real-time search across multiple fields
const filteredProjects = useMemo(() => {
  return projects.filter(project => {
    const searchTerm = searchQuery.toLowerCase()
    const searchableFields = [
      project.title,
      project.subtitle,
      project.description,
      ...project.tags
    ].filter(Boolean)

    return searchableFields.some(field =>
      field.toLowerCase().includes(searchTerm)
    )
  })
}, [projects, searchQuery])
```

**Tag Filtering**
```typescript
// Multi-select tag filtering
const tagFilteredProjects = useMemo(() => {
  if (selectedTags.length === 0) return filteredProjects
  
  return filteredProjects.filter(project =>
    selectedTags.every(tag => project.tags.includes(tag))
  )
}, [filteredProjects, selectedTags])
```

### GitHub Integration

**Repository Data Fetching**
```typescript
// src/lib/github.ts
export async function getGitHubRepoData(repoUrl: string) {
  const repoPath = extractRepoPath(repoUrl)
  const response = await fetch(`https://api.github.com/repos/${repoPath}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch repository data')
  }
  
  return response.json()
}
```

**Repository Display Component**
```typescript
// src/components/GitHubRepoCard.tsx
interface GitHubRepoCardProps {
  repoUrl: string
  repoData?: GitHubRepoData
}

export function GitHubRepoCard({ repoUrl, repoData }: GitHubRepoCardProps) {
  // Display repository metadata
  // Show stars, forks, language
  // Provide direct link to repository
}
```

## 🎨 UI Components

### ProjectCard Component
```typescript
// src/components/ProjectCard.tsx
interface ProjectCardProps {
  project: Project
  showGitHub?: boolean
}

export function ProjectCard({ project, showGitHub = true }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{project.title}</CardTitle>
            {project.subtitle && (
              <CardDescription>{project.subtitle}</CardDescription>
            )}
          </div>
          <Badge variant={getStatusVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {showGitHub && project.github_url && (
          <GitHubRepoCard repoUrl={project.github_url} />
        )}
      </CardContent>
    </Card>
  )
}
```

### ProjectFilters Component
```typescript
// src/components/ProjectFilters.tsx
interface ProjectFiltersProps {
  projects: Project[]
  onFilterChange: (filtered: Project[]) => void
}

export function ProjectFilters({ projects, onFilterChange }: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  // Filtering logic with useMemo for performance
  const filteredProjects = useMemo(() => {
    let filtered = projects
    
    // Search filtering
    if (searchQuery) {
      filtered = filtered.filter(project => {
        const searchTerm = searchQuery.toLowerCase()
        const searchableFields = [
          project.title,
          project.subtitle,
          project.description,
          ...project.tags
        ].filter(Boolean)
        
        return searchableFields.some(field =>
          field.toLowerCase().includes(searchTerm)
        )
      })
    }
    
    // Tag filtering
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.every(tag => project.tags.includes(tag))
      )
    }
    
    // Status filtering
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus)
    }
    
    return filtered
  }, [projects, searchQuery, selectedTags, selectedStatus])
  
  // Update parent component
  useEffect(() => {
    onFilterChange(filteredProjects)
  }, [filteredProjects, onFilterChange])
  
  return (
    <div className="space-y-4">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <div className="flex flex-wrap gap-2">
        <TagFilter
          allTags={getAllTags(projects)}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
        <StatusFilter
          value={selectedStatus}
          onChange={setSelectedStatus}
        />
        <ClearFilters
          onClear={() => {
            setSearchQuery('')
            setSelectedTags([])
            setSelectedStatus('all')
          }}
        />
      </div>
    </div>
  )
}
```

## 📊 Performance Optimization

### Search Performance
- **Debounced Search**: Prevents excessive API calls during typing
- **Memoized Filtering**: Uses `useMemo` for expensive filtering operations
- **Virtual Scrolling**: For large project lists (future implementation)

### Image Optimization
- **Next.js Image**: Automatic optimization and lazy loading
- **Responsive Images**: Different sizes for different screen sizes
- **Placeholder Images**: Loading states with skeleton components

### Database Optimization
- **Indexed Queries**: Proper database indexing on frequently queried columns
- **Pagination**: Limit results for large datasets (future implementation)
- **Caching**: ISR for static project pages

## 🔗 API Endpoints

### Projects API
```typescript
// src/app/api/projects/route.ts
export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
```

### Individual Project API
```typescript
// src/app/api/projects/[slug]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await getProjectBySlug(params.slug)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
```

## 🧪 Testing

### Component Testing
```typescript
// Future testing structure
describe('ProjectCard', () => {
  it('should render project information correctly', () => {
    // Test project display
  })
  
  it('should show GitHub integration when available', () => {
    // Test GitHub integration
  })
  
  it('should handle missing data gracefully', () => {
    // Test error states
  })
})
```

### Integration Testing
```typescript
// API endpoint testing
describe('Projects API', () => {
  it('should return projects list', async () => {
    // Test API response
  })
  
  it('should handle database errors gracefully', async () => {
    // Test error handling
  })
})
```

## 🚀 Future Enhancements

### Planned Features (v0.5)
- **Advanced GitHub Integration**: Code snippets and file previews
- **Interactive Timelines**: Project progress visualization
- **Related Projects**: AI-powered project suggestions
- **Advanced Sorting**: Multiple sorting options
- **Project Analytics**: Usage and engagement metrics

### Long-term Features
- **Project Comments**: User feedback and discussion
- **Project Sharing**: Social media integration
- **Project Templates**: Reusable project structures
- **Collaboration Tools**: Multi-user project editing

## 📚 Usage Examples

### Adding a New Project
```typescript
// Database insertion
const newProject = {
  title: 'My New Project',
  slug: 'my-new-project',
  subtitle: 'A brief description',
  description: 'Detailed project description...',
  tags: ['react', 'typescript', 'ai'],
  status: 'active',
  github_url: 'https://github.com/user/repo'
}

const { data, error } = await supabase
  .from('projects')
  .insert(newProject)
```

### Filtering Projects
```typescript
// Client-side filtering
const activeProjects = projects.filter(p => p.status === 'active')
const reactProjects = projects.filter(p => p.tags.includes('react'))
const searchResults = projects.filter(p => 
  p.title.toLowerCase().includes('search term')
)
```

---

**Last Updated**: December 2024  
**Module Version**: v0.4e  
**Next Update**: v0.5 - Enhanced GitHub Integration 