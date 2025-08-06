import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import postsData from '@/data/posts.json'
import projectsData from '@/data/projects.json'
import { supabase, isSupabaseAvailable, logSupabaseError } from './supabase'
import type { BlogPost, Project } from '@/types'

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
  return fallbackPost ? convertLocalPostToBlogPost(fallbackPost) : null
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