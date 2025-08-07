import projects from '@/data/projects.json'
import agents from '@/data/agents.json'
import posts from '@/data/posts.json'
import { getMilestonesFromNotion } from './notion'

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
const processProjects = (): TimelineEntry[] => {
  return projects.map(project => ({
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

const processAgents = (): TimelineEntry[] => {
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

const processPosts = (): TimelineEntry[] => {
  return posts.map(post => ({
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
        id: `milestone-${milestone.id}`,
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
  const processedProjects = processProjects()
  const processedAgents = processAgents()
  const processedPosts = processPosts()
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