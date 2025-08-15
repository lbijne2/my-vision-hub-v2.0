import projects from '@/data/projects.json'
import agents from '@/data/agents.json'
import posts from '@/data/posts.json'
import { getMilestonesFromNotion, getAllProjects, getBlogPosts, getAllAgentsFromNotion } from './notion'

export interface TimelineEntry {
  id: string
  title: string
  slug?: string
  type: 'project' | 'agent' | 'post' | 'milestone'
  date: string
  description?: string
  icon: string
  color: string
  linked_items?: LinkedItem[]
}

export interface LinkedItem {
  href: string
  label: string
  type: 'project' | 'agent' | 'post'
}

// Data processing functions
const processProjects = async (): Promise<TimelineEntry[]> => {
  try {
    // Try to get projects from Notion first
    const notionProjects = await getAllProjects()
    if (notionProjects.length > 0) {
      console.log(`✅ Using ${notionProjects.length} projects from Notion`)
      return notionProjects.map(project => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        type: 'project' as const,
        date: project.created_at || project.updated_at || '',
        description: project.description || project.subtitle,
        icon: "📁",
        color: "bg-pastel-green"
      }))
    }
  } catch (error) {
    console.log('Could not fetch projects from Notion, using local fallback:', error)
  }
  
  // Fallback to local data - filter by visible status
  console.log('📝 Using local fallback project data')
  const visibleProjects = projects.filter(project => project.visible !== false)
  console.log(`📝 Filtered to ${visibleProjects.length} visible projects from ${projects.length} total`)
  return visibleProjects.map(project => ({
    id: `project-${project.id}`,
    title: project.title,
    slug: project.slug,
    type: 'project' as const,
    date: project.date || '',
    description: project.description || project.subtitle,
    icon: "📁",
    color: "bg-pastel-green"
  }))
}

const processAgents = async (): Promise<TimelineEntry[]> => {
  try {
    // Try to get agents from Notion first
    const notionAgents = await getAllAgentsFromNotion()
    if (notionAgents.length > 0) {
      console.log(`✅ Using ${notionAgents.length} agents from Notion`)
      return notionAgents.map(agent => ({
        id: agent.id,
        title: agent.name,
        slug: agent.slug,
        type: 'agent' as const,
        date: agent.created_at || agent.updated_at || '',
        description: agent.description,
        icon: "🧠",
        color: "bg-pastel-purple"
      }))
    }
  } catch (error) {
    console.log('Could not fetch agents from Notion, using local fallback:', error)
  }
  
  // Fallback to local data - agents don't have published field, so show all
  console.log('📝 Using local fallback agent data')
  console.log(`📝 Showing ${agents.length} agents from local data`)
  return agents.map(agent => ({
    id: `agent-${agent.id}`,
    title: agent.name,
    slug: agent.slug,
    type: 'agent' as const,
    date: agent.date || '',
    description: agent.description,
    icon: "🧠",
    color: "bg-pastel-purple"
  }))
}

const processPosts = async (): Promise<TimelineEntry[]> => {
  try {
    // Try to get blog posts from Notion first
    const notionPosts = await getBlogPosts()
    if (notionPosts.length > 0) {
      console.log(`✅ Using ${notionPosts.length} blog posts from Notion`)
      return notionPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        type: 'post' as const,
        date: post.created_at || post.updated_at || '',
        description: post.excerpt,
        icon: "✍️",
        color: "bg-pastel-rose"
      }))
    }
  } catch (error) {
    console.log('Could not fetch blog posts from Notion, using local fallback:', error)
  }
  
  // Fallback to local data - filter by published status
  console.log('📝 Using local fallback blog post data')
  const publishedPosts = posts.filter(post => post.status === 'published')
  console.log(`📝 Filtered to ${publishedPosts.length} published posts from ${posts.length} total`)
  return publishedPosts.map(post => ({
    id: `post-${post.id}`,
    title: post.title,
    slug: post.slug,
    type: 'post' as const,
    date: post.date || '',
    description: post.excerpt,
    icon: "✍️",
    color: "bg-pastel-rose"
  }))
}

// Helper function to process linked items
const processLinkedItems = (linkedItems?: string[]): LinkedItem[] => {
  if (!linkedItems) return []
  
  return linkedItems.map(item => {
    const [type, slug] = item.split(':')
    let href = ''
    let label = ''
    
    // Find the actual title from the data
    let title = ''
    switch (type) {
      case 'project':
        const project = projects.find(p => p.slug === slug)
        title = project?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        href = `/projects/${slug}`
        label = `Project: ${title}`
        break
      case 'agent':
        const agent = agents.find(a => a.slug === slug)
        title = agent?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        href = `/agents/${slug}`
        label = `Agent: ${title}`
        break
      case 'post':
        const post = posts.find(p => p.slug === slug)
        title = post?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        href = `/blog/${slug}`
        label = `Post: ${title}`
        break
      default:
        href = '#'
        label = `Unknown: ${item}`
    }
    
    return {
      href,
      label,
      type: type as 'project' | 'agent' | 'post'
    }
  })
}

const processMilestones = async (): Promise<TimelineEntry[]> => {
  try {
    const milestones = await getMilestonesFromNotion()
    return milestones.map(milestone => {
      // Process linked items first
      const linkedItems = processLinkedItems(milestone.linked_items)
      
      // Use the first linked item as the slug for clickable title
      const firstLinkedItem = linkedItems[0]
      const slug = firstLinkedItem && firstLinkedItem.href ? firstLinkedItem.href.replace(/^\//, '') : undefined
      
      return {
        id: milestone.id, // Use raw Notion ID or fallback ID as-is
        title: milestone.title,
        slug: slug, // Use first linked item as slug for clickable title
        type: 'milestone' as const,
        date: milestone.date || '',
        description: milestone.description,
        icon: milestone.icon,
        color: milestone.color,
        linked_items: linkedItems
      }
    })
  } catch (error) {
    console.error('Error processing milestones:', error)
    return []
  }
}

export const getAllTimelineEntries = async (): Promise<TimelineEntry[]> => {
  const processedProjects = await processProjects()
  const processedAgents = await processAgents()
  const processedPosts = await processPosts()
  const processedMilestones = await processMilestones()
  
  return [...processedProjects, ...processedAgents, ...processedPosts, ...processedMilestones]
    .filter(entry => entry.date) // Filter out entries without dates
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
}

export const getFilteredTimelineEntries = async (filter: string): Promise<TimelineEntry[]> => {
  const allEntries = await getAllTimelineEntries()
  
  if (filter === 'all') return allEntries
  return allEntries.filter(entry => entry.type === filter)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'project': return 'Project'
    case 'agent': return 'Agent'
    case 'post': return 'Post'
    case 'milestone': return 'Milestone'
    default: return type
  }
} 