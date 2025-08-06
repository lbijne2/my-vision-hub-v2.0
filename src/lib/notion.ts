import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import postsData from '@/data/posts.json'
import projectsData from '@/data/projects.json'
import milestonesData from '@/data/milestones.json'
import { supabase, isSupabaseAvailable, logSupabaseError } from './supabase'
import type { BlogPost, Project, Milestone, Agent } from '@/types'

// Types for blog posts (keeping for backward compatibility)
export interface BlogPostLegacy {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  date: string
  tags: string[]
  status: 'published' | 'draft'
  content?: string
  lastEdited?: string
}

// Types for projects (keeping for backward compatibility)
export interface ProjectLegacy {
  id: string
  title: string
  slug: string
  subtitle?: string
  description: string
  category: string
  status: string
  image?: string
  coverImage?: string
  tags: string[]
  date: string
  content?: string
  lastEdited?: string
}

// Notion database entry types
interface NotionDatabaseEntry {
  id: string
  properties: {
    title: { title: Array<{ plain_text: string }> }
    slug: { rich_text: Array<{ plain_text: string }> }
    published: { checkbox: boolean }
    tags: { multi_select: Array<{ name: string }> }
    date: { date: { start: string } | null }
    excerpt: { rich_text: Array<{ plain_text: string }> }
    author: { rich_text: Array<{ plain_text: string }> }
    lastEdited: { last_edited_time: string }
    projects?: { relation: Array<{ id: string }> }
    blogPosts?: { relation: Array<{ id: string }> }
    milestones?: { relation: Array<{ id: string }> }
    agents?: { relation: Array<{ id: string }> }
  }
}

interface NotionMilestoneEntry {
  id: string
  properties: {
    title: { title: Array<{ plain_text: string }> }
    date: { date: { start: string } | null }
    type: { select: { name: string } | null }
    status: { select: { name: string } | null }
    description: { rich_text: Array<{ plain_text: string }> }
    published: { checkbox: boolean }
    linked_items: { relation: Array<{ id: string }> }
    lastEdited: { last_edited_time: string }
  }
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const notionToMd = new NotionToMarkdown({ notionClient: notion })

// Helper function to safely get text from Notion properties
function getTextFromProperty(property: any): string {
  if (!property) return ''
  if (property.rich_text) {
    return property.rich_text.map((text: any) => text.plain_text).join('')
  }
  if (property.title) {
    return property.title.map((text: any) => text.plain_text).join('')
  }
  return ''
}

// Helper function to get tags from Notion properties
function getTagsFromProperty(property: any): string[] {
  if (!property || !property.multi_select) return []
  return property.multi_select.map((tag: any) => tag.name)
}

// Helper function to fetch related content from relation properties
async function fetchRelatedContent(relationProperty: any): Promise<string[]> {
  console.log('  - Raw relation property:', relationProperty)
  
  if (!relationProperty?.relation) {
    console.log('  - No relation property found, returning empty array')
    return []
  }
  
  const relationIds = relationProperty.relation.map((item: any) => item.id) as string[]
  console.log('  - Relation IDs:', relationIds)
  
  // Fetch related pages to get their slugs
  const relatedPages = await Promise.all(
    relationIds.map(async (id) => {
      try {
        const page = await notion.pages.retrieve({ page_id: id })
        return page
      } catch (error) {
        console.error(`Error fetching related page ${id}:`, error)
        return null
      }
    })
  )
  
  // Extract slugs from related pages
  return relatedPages
    .filter(Boolean)
    .map((page: any) => {
      if (!page.properties) return null
      
      // Try to get slug from different possible properties
      const slug = getTextFromProperty(page.properties.slug) || 
                  getTextFromProperty(page.properties.title)?.toLowerCase().replace(/\s+/g, '-') ||
                  page.id
      
      return slug
    })
    .filter(Boolean) as string[]
}

// Helper function to convert local JSON data to BlogPost type
function convertLocalPostToBlogPost(localPost: any): BlogPost {
  return {
    id: localPost.id,
    title: localPost.title,
    slug: localPost.slug,
    content: localPost.content,
    author: localPost.author,
    published: localPost.status === 'published',
    tags: localPost.tags,
    published_at: localPost.date,
    notion_url: localPost.notionUrl,
    created_at: localPost.date,
    updated_at: localPost.date,
    relatedProjects: [],
    relatedBlogPosts: [],
    relatedMilestones: [],
    relatedAgents: [],
  }
}

// Helper function to get status color for projects
export function getStatusColor(status: string): string {
  const statusColors = {
    "in progress": "bg-pastel-sky text-vision-charcoal",
    "planning": "bg-pastel-peach text-vision-charcoal",
    "research": "bg-pastel-lavender text-vision-charcoal",
    "completed": "bg-pastel-mint text-vision-charcoal",
    "idea": "bg-pastel-cream text-vision-charcoal",
  }
  
  return statusColors[status as keyof typeof statusColors] || "bg-pastel-cream text-vision-charcoal"
}

// Fetch all published blog posts from Supabase or Notion
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_BLOG_DB_ID) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DB_ID,
        filter: {
          property: 'published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'date',
            direction: 'descending',
          },
        ],
      })

      const posts: BlogPost[] = response.results.map((page: any) => {
        if (!page.properties) {
          console.warn('Page missing properties:', page.id)
          return null
        }
        
        const properties = page.properties as NotionDatabaseEntry['properties']
        
        return {
          id: page.id,
          title: getTextFromProperty(properties.title),
          slug: getTextFromProperty(properties.slug),
          excerpt: getTextFromProperty(properties.excerpt),
          content: getTextFromProperty(properties.excerpt),
          author: getTextFromProperty(properties.author),
          published: true,
          tags: getTagsFromProperty(properties.tags),
          published_at: properties.date?.date?.start || new Date().toISOString(),
          notion_url: page.url,
          created_at: properties.date?.date?.start || new Date().toISOString(),
          updated_at: page.last_edited_time,
        }
      }).filter(Boolean) as BlogPost[]

      if (posts.length > 0) {
        return posts
      }
    }

    // Try Supabase as fallback if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (error) {
        logSupabaseError('getBlogPosts', error)
      } else if (data && data.length > 0) {
        console.log('Using Supabase fallback for blog posts')
        return data
      }
    }
  } catch (error) {
    logSupabaseError('getBlogPosts', error)
  }

  // Fallback to local data
  console.warn('Using fallback blog post data')
  return postsData.map(convertLocalPostToBlogPost)
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_BLOG_DB_ID) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_DB_ID,
        filter: {
          and: [
            {
              property: 'published',
              checkbox: {
                equals: true,
              },
            },
            {
              property: 'slug',
              rich_text: {
                equals: slug,
              },
            },
          ],
        },
      })

      if (response.results.length === 0) {
        return null
      }

      const page = response.results[0] as any
      if (!page.properties) {
        console.warn('Page missing properties:', page.id)
        return null
      }

      const properties = page.properties as NotionDatabaseEntry['properties']

      // Get the page content
      const mdBlocks = await notionToMd.pageToMarkdown(page.id)
      const content = notionToMd.toMarkdownString(mdBlocks)

      // Fetch related content
      console.log('  - Fetching related content for blog post...')
      console.log('  - Available properties:', Object.keys(properties))
      
      // Check for different possible property name variations
      const possibleProjectProps = ['projects', 'Projects', 'project', 'Project', 'related_projects', 'Related Projects']
      const possibleBlogProps = ['blogPosts', 'BlogPosts', 'blog_posts', 'Blog Posts', 'posts', 'Posts']
      const possibleMilestoneProps = ['milestones', 'Milestones', 'milestone', 'Milestone']
      const possibleAgentProps = ['agents', 'Agents', 'agent', 'Agent']
      
      console.log('  - Looking for project relations in:', possibleProjectProps.map(p => (properties as any)[p]).filter(Boolean))
      console.log('  - Looking for blog relations in:', possibleBlogProps.map(p => (properties as any)[p]).filter(Boolean))
      console.log('  - Looking for milestone relations in:', possibleMilestoneProps.map(p => (properties as any)[p]).filter(Boolean))
      console.log('  - Looking for agent relations in:', possibleAgentProps.map(p => (properties as any)[p]).filter(Boolean))
      
      let relatedProjects = await fetchRelatedContent(properties.projects)
      let relatedBlogPosts = await fetchRelatedContent(properties.blogPosts)
      let relatedMilestones = await fetchRelatedContent(properties.milestones)
      let relatedAgents = await fetchRelatedContent(properties.agents)

      console.log(`Blog post "${getTextFromProperty(properties.title)}" related content:`, {
        projects: relatedProjects,
        blogPosts: relatedBlogPosts,
        milestones: relatedMilestones,
        agents: relatedAgents
      })

      // If all related content arrays are empty, use fallback data
      const hasRelatedContent = relatedProjects.length > 0 || relatedBlogPosts.length > 0 || 
                               relatedMilestones.length > 0 || relatedAgents.length > 0
      
      if (!hasRelatedContent) {
        console.log('  - No related content found in Notion, using fallback data')
        relatedProjects = ['ai-medical-diagnostics', 'ethical-design-framework']
        relatedBlogPosts = []
        relatedMilestones = ['milestone-1']
        relatedAgents = ['template-generator', 'clinical-summarizer']
      }

      return {
        id: page.id,
        title: getTextFromProperty(properties.title),
        slug: getTextFromProperty(properties.slug),
        excerpt: getTextFromProperty(properties.excerpt),
        content: content.parent,
        author: getTextFromProperty(properties.author),
        published: true,
        tags: getTagsFromProperty(properties.tags),
        published_at: properties.date?.date?.start || new Date().toISOString(),
        notion_url: page.url,
        created_at: properties.date?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
        relatedProjects,
        relatedBlogPosts,
        relatedMilestones,
        relatedAgents,
      }
    }

    // Try Supabase as fallback if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) {
        logSupabaseError('getBlogPostBySlug', error)
      } else if (data) {
        console.log('Using Supabase fallback for blog post:', slug)
        return data
      }
    }
  } catch (error) {
    logSupabaseError('getBlogPostBySlug', error)
  }

  // Fallback to local data
  const fallbackPost = postsData.find((post: any) => post.slug === slug)
  if (fallbackPost) {
    const convertedPost = convertLocalPostToBlogPost(fallbackPost)
    // Add related content for local data
    return {
      ...convertedPost,
      relatedProjects: ['ai-medical-diagnostics', 'ethical-design-framework'],
      relatedBlogPosts: [],
      relatedMilestones: ['milestone-1'],
      relatedAgents: ['template-generator', 'clinical-summarizer'],
    }
  }
  return null
}

// Get all blog post slugs for static generation
export async function getBlogPostSlugs(): Promise<string[]> {
  try {
    const posts = await getBlogPosts()
    return posts.map(post => post.slug)
  } catch (error) {
    console.error('Error fetching blog post slugs:', error)
    return postsData.map((post: any) => post.slug)
  }
}

// Fetch all projects from Notion or Supabase
export async function getAllProjects(): Promise<Project[]> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_PROJECT_DB_ID) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_PROJECT_DB_ID,
        sorts: [
          {
            property: 'title',
            direction: 'ascending',
          },
        ],
      })

      const projects: Project[] = response.results.map((page: any) => {
        if (!page.properties) {
          console.warn('Project page missing properties:', page.id)
          return null
        }
        
        const properties = page.properties
        
        return {
          id: page.id,
          title: getTextFromProperty(properties.title),
          slug: getTextFromProperty(properties.slug),
          subtitle: getTextFromProperty(properties.subtitle),
          category: getTextFromProperty(properties.category),
          description: getTextFromProperty(properties.description),
          cover_image_url: properties.coverImage?.files?.[0]?.file?.url || properties.coverImage?.files?.[0]?.external?.url || '',
          tags: getTagsFromProperty(properties.tags),
          status: properties.status?.select?.name || 'idea',
          visible: properties.published?.checkbox !== false, // Maps to Notion 'published' checkbox
          github_url: properties.githubUrl?.url || '',
          github_repo: getTextFromProperty(properties.githubRepo) || '',
          notion_url: page.url,
          created_at: properties.date?.date?.start || new Date().toISOString(),
          updated_at: page.last_edited_time,
        }
      }).filter(Boolean) as Project[]

      if (projects.length > 0) {
        return projects
      }
    }

    // Try Supabase as fallback if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        logSupabaseError('getAllProjects', error)
      } else if (data && data.length > 0) {
        console.log('Using Supabase fallback for projects')
        return data
      }
    }
  } catch (error) {
    logSupabaseError('getAllProjects', error)
  }

  // Fallback to local data
  console.warn('Using fallback project data')
  return projectsData.map((project: any) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    subtitle: project.subtitle,
    description: project.description,
    cover_image_url: project.coverImage,
    tags: project.tags,
    status: project.status as 'active' | 'prototype' | 'archived',
    visible: project.visible !== undefined ? project.visible : true,
    github_url: undefined, // Not available in local data
    notion_url: undefined, // Not available in local data
    created_at: project.date,
    updated_at: project.date,
  }))
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_PROJECT_DB_ID) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_PROJECT_DB_ID,
        filter: {
          property: 'slug',
          rich_text: {
            equals: slug,
          },
        },
      })

      if (response.results.length === 0) {
        return null
      }

      const page = response.results[0] as any
      if (!page.properties) {
        console.warn('Project page missing properties:', page.id)
        return null
      }

      const properties = page.properties

      // Get the page content
      const mdBlocks = await notionToMd.pageToMarkdown(page.id)
      const content = notionToMd.toMarkdownString(mdBlocks)

      // Fetch related content
      console.log('  - Fetching related content for project...')
      console.log('  - Available properties:', Object.keys(properties))
      console.log('  - Properties.projects:', properties.projects)
      console.log('  - Properties.blogPosts:', properties.blogPosts)
      console.log('  - Properties.milestones:', properties.milestones)
      console.log('  - Properties.agents:', properties.agents)
      
      let relatedProjects = await fetchRelatedContent(properties.projects)
      let relatedBlogPosts = await fetchRelatedContent(properties.blogPosts)
      let relatedMilestones = await fetchRelatedContent(properties.milestones)
      let relatedAgents = await fetchRelatedContent(properties.agents)

      console.log(`Project "${getTextFromProperty(properties.title)}" related content:`, {
        projects: relatedProjects,
        blogPosts: relatedBlogPosts,
        milestones: relatedMilestones,
        agents: relatedAgents
      })

      // If all related content arrays are empty, use fallback data
      const hasRelatedContent = relatedProjects.length > 0 || relatedBlogPosts.length > 0 || 
                               relatedMilestones.length > 0 || relatedAgents.length > 0
      
      if (!hasRelatedContent) {
        console.log('  - No related content found in Notion, using fallback data')
        relatedProjects = []
        relatedBlogPosts = ['future-of-ai-in-healthcare', 'designing-ethical-ai']
        relatedMilestones = ['milestone-1']
        relatedAgents = ['template-generator', 'clinical-summarizer']
      }

      return {
        id: page.id,
        title: getTextFromProperty(properties.title),
        slug: getTextFromProperty(properties.slug),
        subtitle: getTextFromProperty(properties.subtitle),
        category: getTextFromProperty(properties.category),
        description: getTextFromProperty(properties.description),
        content: content.parent,
        cover_image_url: properties.coverImage?.files?.[0]?.file?.url || properties.coverImage?.files?.[0]?.external?.url || '',
        tags: getTagsFromProperty(properties.tags),
        status: properties.status?.select?.name || 'idea',
        github_url: properties.githubUrl?.url || '',
        github_repo: getTextFromProperty(properties.githubRepo) || '',
        notion_url: page.url,
        created_at: properties.date?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
        relatedProjects,
        relatedBlogPosts,
        relatedMilestones,
        relatedAgents,
      }
    }

    // Try Supabase as fallback if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        logSupabaseError('getProjectBySlug', error)
      } else if (data) {
        console.log('Using Supabase fallback for project:', slug)
        return data
      }
    }
  } catch (error) {
    logSupabaseError('getProjectBySlug', error)
  }

  // Fallback to local data
  const fallbackProject = projectsData.find((project: any) => project.slug === slug)
  return fallbackProject ? {
    id: fallbackProject.id,
    title: fallbackProject.title,
    slug: fallbackProject.slug,
    subtitle: fallbackProject.subtitle,
    description: fallbackProject.description,
    cover_image_url: fallbackProject.coverImage,
    tags: fallbackProject.tags,
    status: fallbackProject.status as 'active' | 'prototype' | 'archived',
    github_url: undefined, // Not available in local data
    notion_url: undefined, // Not available in local data
    created_at: fallbackProject.date,
    updated_at: fallbackProject.date,
    relatedProjects: [],
    relatedBlogPosts: ['future-of-ai-in-healthcare', 'designing-ethical-ai'],
    relatedMilestones: ['milestone-1'],
    relatedAgents: ['template-generator', 'clinical-summarizer'],
  } : null
}

// Get all project slugs for static generation
export async function getProjectSlugs(): Promise<string[]> {
  try {
    const projects = await getAllProjects()
    return projects.map(project => project.slug)
  } catch (error) {
    console.error('Error fetching project slugs:', error)
    return projectsData.map((project: any) => project.slug)
  }
}

// Fetch all published milestones from Notion
export async function getMilestonesFromNotion(): Promise<Milestone[]> {
  // Try Notion first if configured
  if (process.env.NOTION_API_KEY && process.env.NOTION_MILESTONES_DB_ID) {
    console.log('Notion integration configured, fetching milestones from Notion...')
    console.log('Database ID:', process.env.NOTION_MILESTONES_DB_ID)
    
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_MILESTONES_DB_ID,
        filter: {
          property: 'published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'date',
            direction: 'descending',
          },
        ],
      })

      console.log('Notion response received, processing milestones...')
      console.log('Number of results:', response.results.length)

      const milestonePromises = response.results.map(async (page: any) => {
        if (!page.properties) {
          console.warn('Milestone page missing properties:', page.id)
          return null
        }
        
        const properties = page.properties as NotionMilestoneEntry['properties']
        
        // Get linked items from relation
        let linkedItems: string[] = []
        
        // Check the linked_items property (relation type)
        const linkedItemsProperty = properties.linked_items
        console.log('  - Raw linked_items property:', linkedItemsProperty)
        
        if (linkedItemsProperty?.relation) {
          // For relations, we need to fetch the related pages to get their slugs
          const relationIds = linkedItemsProperty.relation.map((item: any) => item.id)
          console.log('  - Relation IDs:', relationIds)
          
          // Fetch related pages to get their properties
          const relatedPages = await Promise.all(
            relationIds.map(async (id) => {
              try {
                const page = await notion.pages.retrieve({ page_id: id })
                return page
              } catch (error) {
                console.error(`Error fetching related page ${id}:`, error)
                return null
              }
            })
          )
          
          // Process related pages to extract slugs and determine types
          linkedItems = relatedPages
            .filter(Boolean)
            .map((page: any) => {
              if (!page.properties) return null
              
              // Try to get slug from different possible properties
              const slug = getTextFromProperty(page.properties.slug) || 
                          getTextFromProperty(page.properties.title)?.toLowerCase().replace(/\s+/g, '-') ||
                          page.id
              
              // Determine type based on page properties or URL
              let type = 'project' // default
              if (page.properties.status?.select?.name === 'agent' || 
                  page.properties.type?.select?.name === 'agent') {
                type = 'agent'
              } else if (page.properties.status?.select?.name === 'post' || 
                        page.properties.type?.select?.name === 'post') {
                type = 'post'
              }
              
              return `${type}:${slug}`
            })
            .filter(Boolean) as string[]
        }
        
        console.log('  - Extracted linked items:', linkedItems)
        
        // Determine icon and color based on type
        const type = properties.type?.select?.name || 'milestone'
        const icon = getMilestoneIcon(type)
        const color = getMilestoneColor(type)
        
        const milestone = {
          id: page.id,
          title: getTextFromProperty(properties.title),
          type: type,
          date: properties.date?.date?.start || new Date().toISOString(),
          description: getTextFromProperty(properties.description),
          icon: icon,
          color: color,
          linked_items: linkedItems,
        }
        
        console.log('Processed milestone:', milestone.title)
        console.log('  - Linked items:', linkedItems)
        console.log('  - Properties available:', Object.keys(properties))
        console.log('  - Raw linked_items property:', properties.linked_items)
        return milestone
      })
      
      const milestoneResults = await Promise.all(milestonePromises)
      const milestones: Milestone[] = milestoneResults.filter(Boolean) as Milestone[]

      if (milestones.length > 0) {
        console.log(`Loaded ${milestones.length} milestones from Notion`)
        return milestones
      } else {
        console.log('No published milestones found in Notion database')
      }
    } catch (error) {
      console.error('Error fetching milestones from Notion:', error)
    }
  } else {
    console.log('Notion integration not configured - missing NOTION_API_KEY or NOTION_MILESTONES_DB_ID')
  }

  // Fallback to local data
  console.log('Using fallback milestone data from local JSON')
  return milestonesData
}

// Helper function to get milestone icon based on type
function getMilestoneIcon(type: string): string {
  const iconMap: { [key: string]: string } = {
    'milestone': '📌',
    'launch': '🚀',
    'research': '🔬',
    'development': '⚙️',
    'integration': '🔗',
    'release': '🎉',
    'update': '🔄',
    'default': '📌'
  }
  
  return iconMap[type.toLowerCase()] || iconMap.default
}

// Helper function to get milestone color based on type
function getMilestoneColor(type: string): string {
  const colorMap: { [key: string]: string } = {
    'milestone': 'bg-pastel-purple',
    'launch': 'bg-pastel-blue',
    'research': 'bg-pastel-sage',
    'development': 'bg-pastel-orange',
    'integration': 'bg-pastel-pink',
    'release': 'bg-pastel-green',
    'update': 'bg-pastel-lavender',
    'default': 'bg-pastel-purple'
  }
  
  return colorMap[type.toLowerCase()] || colorMap.default
}

// Helper function to convert local JSON agent data to Agent type
function convertLocalAgentToAgent(localAgent: any): Agent {
  return {
    id: localAgent.id,
    name: localAgent.name,
    slug: localAgent.slug,
    status: localAgent.status as 'active' | 'prototype' | 'idea',
    category: localAgent.category,
    description: localAgent.description,
    inputs: localAgent.inputs,
    tags: localAgent.tags,
    example_uses: localAgent.exampleUse ? [localAgent.exampleUse] : [],
    trigger_type: localAgent.triggerType,
    created_at: localAgent.date,
    updated_at: localAgent.date,
    relatedProjects: ['ai-medical-diagnostics', 'ethical-design-framework'],
    relatedBlogPosts: ['future-of-ai-in-healthcare', 'designing-ethical-ai'],
    relatedMilestones: ['milestone-1'],
    relatedAgents: ['clinical-summarizer', 'literature-assistant'],
  }
}

// Fetch all published agents from Notion
export async function getAllAgentsFromNotion(): Promise<Agent[]> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_AGENTS_DB_ID) {
      console.log('Notion integration configured, fetching agents from Notion...')
      console.log('Database ID:', process.env.NOTION_AGENTS_DB_ID)
      
      const response = await notion.databases.query({
        database_id: process.env.NOTION_AGENTS_DB_ID,
        filter: {
          property: 'published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'created_at',
            direction: 'descending',
          },
        ],
      })

      console.log('Notion response received, processing agents...')
      console.log('Number of results:', response.results.length)

      const agentPromises = response.results.map(async (page: any) => {
        if (!page.properties) {
          console.warn('Agent page missing properties:', page.id)
          return null
        }
        
        const properties = page.properties
        
        // Get the page content
        const mdBlocks = await notionToMd.pageToMarkdown(page.id)
        const content = notionToMd.toMarkdownString(mdBlocks)

        // Fetch related content
        console.log('  - Fetching related content for agent...')
        console.log('  - Available properties:', Object.keys(properties))
        
        let relatedProjects = await fetchRelatedContent(properties.projects)
        let relatedBlogPosts = await fetchRelatedContent(properties.blogPosts)
        let relatedMilestones = await fetchRelatedContent(properties.milestones)
        let relatedAgents = await fetchRelatedContent(properties.agents)

        console.log(`Agent "${getTextFromProperty(properties.name)}" related content:`, {
          projects: relatedProjects,
          blogPosts: relatedBlogPosts,
          milestones: relatedMilestones,
          agents: relatedAgents
        })

        // If all related content arrays are empty, use fallback data
        const hasRelatedContent = relatedProjects.length > 0 || relatedBlogPosts.length > 0 || 
                                 relatedMilestones.length > 0 || relatedAgents.length > 0
        
        if (!hasRelatedContent) {
          console.log('  - No related content found in Notion, using fallback data')
          relatedProjects = ['ai-medical-diagnostics', 'ethical-design-framework']
          relatedBlogPosts = ['future-of-ai-in-healthcare', 'designing-ethical-ai']
          relatedMilestones = ['milestone-1']
          relatedAgents = ['clinical-summarizer', 'literature-assistant']
        }

        return {
          id: page.id,
          name: getTextFromProperty(properties.name),
          slug: getTextFromProperty(properties.slug),
          status: properties.status?.select?.name || 'idea',
          category: getTextFromProperty(properties.category),
          description: getTextFromProperty(properties.description),
          content: content.parent, // Use the page content as content
          inputs: properties.inputs?.multi_select?.map((input: any) => input.name) || [],
          tags: getTagsFromProperty(properties.tags),
          example_uses: properties.exampleUses?.rich_text?.map((text: any) => text.plain_text) || [],
          trigger_type: properties.triggerType?.select?.name || 'manual',
          created_at: properties.createdAt?.date?.start || new Date().toISOString(),
          updated_at: page.last_edited_time,
          relatedProjects,
          relatedBlogPosts,
          relatedMilestones,
          relatedAgents,
        }
      })
      
      const agentResults = await Promise.all(agentPromises)
      const agents: Agent[] = agentResults.filter(Boolean) as Agent[]

      if (agents.length > 0) {
        console.log(`Loaded ${agents.length} agents from Notion`)
        return agents
      } else {
        console.log('No published agents found in Notion database')
      }
    } else {
      console.log('Notion integration not configured - missing NOTION_API_KEY or NOTION_AGENTS_DB_ID')
    }
  } catch (error) {
    console.error('Error fetching agents from Notion:', error)
  }

  // Fallback to local data
  console.log('Using fallback agent data from local JSON')
  const agentData = await import('@/data/agents.json')
  return agentData.default.map(convertLocalAgentToAgent)
}

// Fetch a single agent by slug from Notion
export async function getAgentBySlugFromNotion(slug: string): Promise<Agent | null> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_AGENTS_DB_ID) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_AGENTS_DB_ID,
        filter: {
          and: [
            {
              property: 'published',
              checkbox: {
                equals: true,
              },
            },
            {
              property: 'slug',
              rich_text: {
                equals: slug,
              },
            },
          ],
        },
      })

      if (response.results.length === 0) {
        return null
      }

      const page = response.results[0] as any
      if (!page.properties) {
        console.warn('Agent page missing properties:', page.id)
        return null
      }

      const properties = page.properties

      // Get the page content
      const mdBlocks = await notionToMd.pageToMarkdown(page.id)
      const content = notionToMd.toMarkdownString(mdBlocks)

      // Fetch related content
      console.log('  - Fetching related content for agent...')
      console.log('  - Available properties:', Object.keys(properties))
      
      let relatedProjects = await fetchRelatedContent(properties.projects)
      let relatedBlogPosts = await fetchRelatedContent(properties.blogPosts)
      let relatedMilestones = await fetchRelatedContent(properties.milestones)
      let relatedAgents = await fetchRelatedContent(properties.agents)

      console.log(`Agent "${getTextFromProperty(properties.name)}" related content:`, {
        projects: relatedProjects,
        blogPosts: relatedBlogPosts,
        milestones: relatedMilestones,
        agents: relatedAgents
      })

      // If all related content arrays are empty, use fallback data
      const hasRelatedContent = relatedProjects.length > 0 || relatedBlogPosts.length > 0 || 
                               relatedMilestones.length > 0 || relatedAgents.length > 0
      
      if (!hasRelatedContent) {
        console.log('  - No related content found in Notion, using fallback data')
        relatedProjects = ['ai-medical-diagnostics', 'ethical-design-framework']
        relatedBlogPosts = ['future-of-ai-in-healthcare', 'designing-ethical-ai']
        relatedMilestones = ['milestone-1']
        relatedAgents = ['clinical-summarizer', 'literature-assistant']
      }

      return {
        id: page.id,
        name: getTextFromProperty(properties.name),
        slug: getTextFromProperty(properties.slug),
        status: properties.status?.select?.name || 'idea',
        category: getTextFromProperty(properties.category),
        description: getTextFromProperty(properties.description),
        content: content.parent, // Use the page content as content
        inputs: properties.inputs?.multi_select?.map((input: any) => input.name) || [],
        tags: getTagsFromProperty(properties.tags),
        example_uses: properties.exampleUses?.rich_text?.map((text: any) => text.plain_text) || [],
        trigger_type: properties.triggerType?.select?.name || 'manual',
        created_at: properties.createdAt?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
        relatedProjects,
        relatedBlogPosts,
        relatedMilestones,
        relatedAgents,
      }
    } else {
      console.log('Notion integration not configured - missing NOTION_API_KEY or NOTION_AGENTS_DB_ID')
    }
  } catch (error) {
    console.error('Error fetching agent from Notion:', error)
  }

  // Fallback to local data
  const agentData = await import('@/data/agents.json')
  const fallbackAgent = agentData.default.find((agent: any) => agent.slug === slug)
  return fallbackAgent ? convertLocalAgentToAgent(fallbackAgent) : null
} 