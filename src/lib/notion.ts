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
    Name: { title: Array<{ plain_text: string }> }
    Slug: { rich_text: Array<{ plain_text: string }> }
    Date: { date: { start: string } | null }
    Description: { rich_text: Array<{ plain_text: string }> }
    Status: { select: { name: string } | null }
    Type: { select: { name: string } | null }
    Icon: { rich_text: Array<{ plain_text: string }> }
    Color: { rich_text: Array<{ plain_text: string }> }
    Published: { checkbox: boolean }
    Projects: { relation: Array<{ id: string }> }
    BlogPosts: { relation: Array<{ id: string }> }
    Agents: { relation: Array<{ id: string }> }
    lastEdited: { last_edited_time: string }
  }
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const notionToMd = new NotionToMarkdown({ notionClient: notion })

// Simple in-memory cache for Notion page ID -> slug to reduce API calls
// Lives for the process lifetime; acceptable for server runtime and dev
const notionPageSlugCache: Map<string, string> = new Map()

async function getSlugForPageId(pageId: string): Promise<string> {
  const cached = notionPageSlugCache.get(pageId)
  if (cached) return cached
  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId })
    const properties = page.properties as any
    const slug = getTextFromProperty(properties?.slug) ||
                 getTextFromProperty(properties?.Slug) ||
                 getTextFromProperty(properties?.title)?.toLowerCase().replace(/\s+/g, '-') ||
                 page.id
    notionPageSlugCache.set(pageId, slug)
    return slug
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error)
    return pageId
  }
}

// Milestones fetch cache (TTL)
type MilestonesCacheEntry = { data: Milestone[]; expiresAt: number }
let milestonesCacheEntry: MilestonesCacheEntry | null = null
let milestonesInFlight: Promise<Milestone[]> | null = null

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

// Helper to safely get a property by trying multiple possible names
function getProperty(properties: any, names: string[]): any {
  if (!properties) return undefined
  for (const name of names) {
    if (properties[name] !== undefined) return properties[name]
  }
  return undefined
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
      relatedAgents: []
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

      // Only show related content if it actually exists in Notion
      // No fallback data - if no relations exist, show empty arrays

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
        relatedAgents
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
      relatedProjects: [],
      relatedBlogPosts: [],
      relatedMilestones: [],
      relatedAgents: []
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

      const projects: Project[] = await Promise.all(response.results.map(async (page: any) => {
        if (!page.properties) {
          console.warn('Project page missing properties:', page.id)
          return null
        }
        
        const properties = page.properties

        // Attempt to resolve parent project relation if present
        let parentProject: { title: string; slug: string } | undefined
        const parentProp = getProperty(properties, ['Parent Project', 'Parent project', 'parentProject', 'ParentProject', 'parent project'])
        if (parentProp?.relation?.length) {
          const parentId = parentProp.relation[0]?.id as string
          if (parentId) {
            const parentSlug = await getSlugForPageId(parentId)
            try {
              const parentPage: any = await notion.pages.retrieve({ page_id: parentId })
              const parentTitle = getTextFromProperty(getProperty(parentPage?.properties, ['title', 'Title', 'Name'])) || ''
              parentProject = { title: parentTitle || parentSlug, slug: parentSlug }
            } catch {
              parentProject = { title: parentSlug, slug: parentSlug }
            }
          }
        }

        // Query child projects where Parent Project points to this page
        let childProjects: Array<{ title: string; slug: string }> | undefined
        try {
          const parentPropertyCandidates = ['Parent Project', 'Parent project', 'parentProject', 'ParentProject', 'parent project']
          let childrenResp: any = null
          for (const propName of parentPropertyCandidates) {
            try {
              childrenResp = await notion.databases.query({
                database_id: process.env.NOTION_PROJECT_DB_ID!,
                filter: {
                  property: propName,
                  relation: { contains: page.id },
                },
                sorts: [{ property: 'title', direction: 'ascending' }],
              })
              if (childrenResp?.results?.length) {
                console.log(`Found ${childrenResp.results.length} child projects for ${getTextFromProperty(properties.title)}`)
                break
              }
            } catch (e) {
              // try next candidate
            }
          }
          if (childrenResp?.results?.length) {
            childProjects = await Promise.all(childrenResp.results.map(async (child: any) => {
              const childProps = child.properties
              const childSlug = getTextFromProperty(getProperty(childProps, ['slug', 'Slug'])) || (await getSlugForPageId(child.id))
              const childTitle = getTextFromProperty(getProperty(childProps, ['title', 'Title', 'Name']))
              return { title: childTitle || childSlug, slug: childSlug }
            }))
          }
        } catch (err) {
          console.warn('Error fetching child projects for', getTextFromProperty(properties.title), err)
        }

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
          github_preview_path: getTextFromProperty(properties.githubPreviewPath) || '',
          notion_url: page.url,
          created_at: properties.date?.date?.start || new Date().toISOString(),
          updated_at: page.last_edited_time,
          parentProject,
          childProjects,
        }
      })).then(results => results.filter(Boolean) as Project[])

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
    parentProject: project.parentProject,
    childProjects: project.childProjects,
    siblingProjects: (project as any).siblingProjects || [],
  }))
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_PROJECT_DB_ID) {
      // Try multiple slug property name candidates to avoid schema mismatches
      const slugPropertyCandidates = ['slug', 'Slug']
      let response: any = null
      for (const propName of slugPropertyCandidates) {
        try {
          const resp = await notion.databases.query({
            database_id: process.env.NOTION_PROJECT_DB_ID,
            filter: {
              property: propName,
              rich_text: { equals: slug },
            },
          })
          if (resp?.results?.length) {
            response = resp
            break
          }
        } catch (e) {
          // try next candidate
        }
      }
      if (!response) {
        return null
      }

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

      // Resolve parent project relation
      let parentProject: { title: string; slug: string } | undefined
      const parentProp = getProperty(properties, ['Parent Project', 'Parent project', 'parentProject', 'ParentProject', 'parent project'])
      if (parentProp?.relation?.length) {
        const parentId = parentProp.relation[0]?.id as string
        if (parentId) {
          const parentSlug = await getSlugForPageId(parentId)
          try {
            const parentPage: any = await notion.pages.retrieve({ page_id: parentId })
            const parentTitle = getTextFromProperty(getProperty(parentPage?.properties, ['title', 'Title', 'Name'])) || ''
            parentProject = { title: parentTitle || parentSlug, slug: parentSlug }
          } catch {
            parentProject = { title: parentSlug, slug: parentSlug }
          }
        }
      }

      // Query child projects where Parent Project points to this page
      let childProjects: Array<{ title: string; slug: string }> | undefined
      // Query sibling projects if this project has a parent (excluding current project)
      let siblingProjects: Array<{ title: string; slug: string }> | undefined
      
      try {
        const parentPropertyCandidates = ['Parent Project', 'Parent project', 'parentProject', 'ParentProject', 'parent project']
        let childrenResp: any = null
        for (const propName of parentPropertyCandidates) {
          try {
            childrenResp = await notion.databases.query({
              database_id: process.env.NOTION_PROJECT_DB_ID!,
              filter: {
                property: propName,
                relation: { contains: page.id },
              },
              sorts: [{ property: 'title', direction: 'ascending' }],
            })
            if (childrenResp?.results?.length) {
              console.log(`Found ${childrenResp.results.length} child projects using relation property: ${propName}`)
              break
            }
          } catch (e) {
            // try next candidate
          }
        }
        if (childrenResp?.results?.length) {
          childProjects = await Promise.all(childrenResp.results.map(async (child: any) => {
            const childProps = child.properties
            const childSlug = getTextFromProperty(getProperty(childProps, ['slug', 'Slug'])) || (await getSlugForPageId(child.id))
            const childTitle = getTextFromProperty(getProperty(childProps, ['title', 'Title', 'Name']))
            return { title: childTitle || childSlug, slug: childSlug }
          }))
        } else {
          console.log('No child projects found for parent page:', slug)
        }

        // If this project has a parent, fetch siblings (other children of the same parent)
        if (parentProject) {
          let siblingsResp: any = null
          for (const propName of parentPropertyCandidates) {
            try {
              // Find the parent page ID first
              const parentPageResp = await notion.databases.query({
                database_id: process.env.NOTION_PROJECT_DB_ID!,
                filter: {
                  property: 'slug',
                  rich_text: { equals: parentProject.slug },
                },
              })
              
              if (parentPageResp?.results?.length) {
                const parentPageId = parentPageResp.results[0].id
                
                // Query all projects that have this parent
                siblingsResp = await notion.databases.query({
                  database_id: process.env.NOTION_PROJECT_DB_ID!,
                  filter: {
                    property: propName,
                    relation: { contains: parentPageId },
                  },
                  sorts: [{ property: 'title', direction: 'ascending' }],
                })
                
                if (siblingsResp?.results?.length) {
                  console.log(`Found ${siblingsResp.results.length} sibling projects using relation property: ${propName}`)
                  break
                }
              }
            } catch (e) {
              // try next candidate
            }
          }
          
          if (siblingsResp?.results?.length) {
            siblingProjects = await Promise.all(
              siblingsResp.results
                .filter((sibling: any) => sibling.id !== page.id) // Exclude current project
                .map(async (sibling: any) => {
                  const siblingProps = sibling.properties
                  const siblingSlug = getTextFromProperty(getProperty(siblingProps, ['slug', 'Slug'])) || (await getSlugForPageId(sibling.id))
                  const siblingTitle = getTextFromProperty(getProperty(siblingProps, ['title', 'Title', 'Name']))
                  return { title: siblingTitle || siblingSlug, slug: siblingSlug }
                })
            )
          } else {
            console.log('No sibling projects found for', slug)
          }
        }
      } catch (err) {
        console.warn('Error fetching child/sibling projects for', slug, err)
      }

      console.log(`Project "${getTextFromProperty(properties.title)}" related content:`, {
        projects: relatedProjects,
        blogPosts: relatedBlogPosts,
        milestones: relatedMilestones,
        agents: relatedAgents
      })

      // Only show related content if it actually exists in Notion
      // No fallback data - if no relations exist, show empty arrays

      return {
        id: page.id,
        title: getTextFromProperty(getProperty(properties, ['title', 'Title', 'Name']) || properties.title),
        slug: getTextFromProperty(getProperty(properties, ['slug', 'Slug']) || properties.slug),
        subtitle: getTextFromProperty(properties.subtitle),
        category: getTextFromProperty(properties.category),
        description: getTextFromProperty(properties.description),
        content: content.parent,
        cover_image_url: properties.coverImage?.files?.[0]?.file?.url || properties.coverImage?.files?.[0]?.external?.url || '',
        tags: getTagsFromProperty(properties.tags),
        status: properties.status?.select?.name || 'idea',
        github_url: properties.githubUrl?.url || '',
        github_repo: getTextFromProperty(properties.githubRepo) || '',
        github_preview_path: getTextFromProperty(properties.githubPreviewPath) || '',
        notion_url: page.url,
        created_at: properties.date?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
        relatedProjects,
        relatedBlogPosts,
        relatedMilestones,
        relatedAgents,
        parentProject,
        childProjects,
        siblingProjects
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
    parentProject: fallbackProject.parentProject,
    childProjects: fallbackProject.childProjects,
    siblingProjects: (fallbackProject as any).siblingProjects || [],
    relatedProjects: [],
    relatedBlogPosts: [],
    relatedMilestones: [],
    relatedAgents: []
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
  // Serve from in-memory cache if still fresh (30s TTL)
  const now = Date.now()
  if (milestonesCacheEntry && milestonesCacheEntry.expiresAt > now) {
    return milestonesCacheEntry.data
  }
  // Coalesce concurrent calls
  if (milestonesInFlight) return milestonesInFlight

  milestonesInFlight = (async () => {
  // Try Notion first if configured
  if (process.env.NOTION_API_KEY && process.env.NOTION_MILESTONES_DB_ID) {
    console.log('Notion integration configured, fetching milestones from Notion...')
    console.log('Database ID:', process.env.NOTION_MILESTONES_DB_ID)
    
    try {
      // Try with strict filters if caller configured them elsewhere;
      // If that yields 0 results, retry without filters to avoid property name mismatches.
      let response = await notion.databases.query({
        database_id: process.env.NOTION_MILESTONES_DB_ID,
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          { property: 'Date', direction: 'descending' },
        ],
      }).catch((err) => {
        console.warn('Strict Notion query failed, will retry without filters:', err)
        return null as any
      })

      if (!response || (response.results?.length ?? 0) === 0) {
        console.log('Strict Notion query returned no results. Retrying without filters...')
        response = await notion.databases.query({
          database_id: process.env.NOTION_MILESTONES_DB_ID,
        })
      }

      console.log('Notion response received, processing milestones...')
      console.log('Number of results:', response.results.length)
      if (response.results.length > 0) {
        const first = response.results[0] as any
        console.log('First milestone available properties:', first?.properties ? Object.keys(first.properties) : 'none')
      }

      const milestonePromises = response.results.map(async (page: any) => {
        if (!page.properties) {
          console.warn('Milestone page missing properties:', page.id)
          return null
        }
        
        const properties = page.properties as any

        // Helpers to get property by possible names
        const getProp = (names: string[]) => {
          for (const name of names) {
            if (properties[name] !== undefined) return properties[name]
          }
          return undefined
        }

        // Determine published flag (default true if property missing to avoid hiding everything)
        const publishedProp = getProp(['Published', 'published', 'Visible', 'visible'])
        const isPublished = typeof publishedProp?.checkbox === 'boolean' ? publishedProp.checkbox : true
        if (!isPublished) {
          return null
        }
        
        // Get linked items from all relation properties
        let linkedItems: string[] = []
        
        // Process Projects relations (try multiple keys)
        const projectsRel = getProp(['Projects', 'projects', 'Project', 'project'])
        if (projectsRel?.relation) {
          const projectIds = projectsRel.relation.map((item: any) => item.id as string)
          const projectSlugs = await Promise.all(projectIds.map((id: string) => getSlugForPageId(id)))
          linkedItems.push(...projectSlugs.map((slug) => `project:${slug}`))
        }
        
        // Process BlogPosts relations (try multiple keys)
        const blogRel = getProp(['BlogPosts', 'blogPosts', 'Posts', 'posts', 'Blog Posts'])
        if (blogRel?.relation) {
          const blogIds = blogRel.relation.map((item: any) => item.id as string)
          const blogSlugs = await Promise.all(blogIds.map((id: string) => getSlugForPageId(id)))
          linkedItems.push(...blogSlugs.map((slug) => `post:${slug}`))
        }
        
        // Process Agents relations (try multiple keys)
        const agentsRel = getProp(['Agents', 'agents', 'Agent', 'agent'])
        if (agentsRel?.relation) {
          const agentIds = agentsRel.relation.map((item: any) => item.id as string)
          const agentSlugs = await Promise.all(agentIds.map((id: string) => getSlugForPageId(id)))
          linkedItems.push(...agentSlugs.map((slug) => `agent:${slug}`))
        }
        
        console.log('  - Extracted linked items:', linkedItems)
        
        // Get icon and color from Notion properties, with fallbacks
        const typeSelect = (getProp(['Type', 'type']) as any)?.select?.name || 'custom'
        const icon = getTextFromProperty(getProp(['Icon', 'icon'])) || getMilestoneIcon(typeSelect)
        const color = getTextFromProperty(getProp(['Color', 'color'])) || getMilestoneColor(typeSelect)
        
        const milestone = {
          id: page.id,
          title: getTextFromProperty(getProp(['Name', 'name', 'Title', 'title'])),
          type: typeSelect,
          date: (getProp(['Date', 'date']) as any)?.date?.start || new Date().toISOString(),
          description: getTextFromProperty(getProp(['Description', 'description'])),
          icon: icon,
          color: color,
          linked_items: linkedItems,
        }
        
        console.log('Processed milestone:', milestone.title)
        console.log('  - Linked items:', linkedItems)
        console.log('  - Properties available:', Object.keys(properties))
        return milestone
      })
      
      const milestoneResults = await Promise.all(milestonePromises)
      // Apply sorting by date desc here to replace removed API sort
      const milestones: Milestone[] = (milestoneResults.filter(Boolean) as Milestone[])
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (milestones.length > 0) {
        console.log(`Loaded ${milestones.length} milestones from Notion`)
      } else {
        console.log('No published milestones found in Notion database')
      }
      return milestones
    } catch (error) {
      console.error('Error fetching milestones from Notion:', error)
      // Notion configured but errored → do not use local fallback; return empty
      return []
    }
  } else {
    console.log('Notion integration not configured - missing NOTION_API_KEY or NOTION_MILESTONES_DB_ID')
  }

  // Fallback to local data
  console.log('Using fallback milestone data from local JSON')
  return milestonesData
  })()

  try {
    const result = await milestonesInFlight
    milestonesCacheEntry = { data: result, expiresAt: Date.now() + 30_000 }
    return result
  } finally {
    milestonesInFlight = null
  }
}

// Fetch all milestones from Notion with the new structure
export async function getAllMilestonesFromNotion(): Promise<{
  id: string;
  title: string;
  date: string;
  description?: string;
  status: "planned" | "active" | "completed";
  type: "fellowship" | "launch" | "research" | "custom";
  icon?: string;
  color?: string;
  relatedProjects?: string[];
  relatedBlogPosts?: string[];
  relatedAgents?: string[];
}[]> {
  try {
    const milestones = await getMilestonesFromNotion()
    
    return milestones.map(milestone => {
      // Parse linked items to separate arrays
      const relatedProjects: string[] = []
      const relatedBlogPosts: string[] = []
      const relatedAgents: string[] = []
      
      if (milestone.linked_items) {
        milestone.linked_items.forEach(item => {
          const [type, slug] = item.split(':')
          switch (type) {
            case 'project':
              relatedProjects.push(slug)
              break
            case 'post':
              relatedBlogPosts.push(slug)
              break
            case 'agent':
              relatedAgents.push(slug)
              break
          }
        })
      }
      
      return {
        id: milestone.id,
        title: milestone.title,
        date: milestone.date,
        description: milestone.description,
        status: milestone.type === 'completed' ? 'completed' : 
                milestone.type === 'active' ? 'active' : 'planned',
        type: milestone.type as "fellowship" | "launch" | "research" | "custom",
        icon: milestone.icon,
        color: milestone.color,
        relatedProjects,
        relatedBlogPosts,
        relatedAgents
      }
    })
  } catch (error) {
    console.error('Error fetching all milestones from Notion:', error)
    return []
  }
}

// Fetch future milestones for MiniRoadmap component
export async function getFutureMilestonesFromNotion(maxItems: number = 5): Promise<Milestone[]> {
  try {
    const allMilestones = await getMilestonesFromNotion()
    const today = new Date()
    
    // Filter for future milestones (date > today or status = "planned")
    const futureMilestones = allMilestones
      .filter(milestone => {
        const milestoneDate = new Date(milestone.date)
        return milestoneDate > today
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, maxItems)
    
    return futureMilestones
  } catch (error) {
    console.error('Error fetching future milestones:', error)
    return []
  }
}

// Helper function to get milestone icon based on type
function getMilestoneIcon(type: string): string {
  const iconMap: { [key: string]: string } = {
    'fellowship': '🎓',
    'launch': '🚀',
    'research': '🔬',
    'custom': '📌',
    'milestone': '📌',
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
    'fellowship': 'bg-pastel-sage',
    'launch': 'bg-pastel-blue',
    'research': 'bg-pastel-lavender',
    'custom': 'bg-pastel-purple',
    'milestone': 'bg-pastel-purple',
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
    content: localAgent.content, // Add content field
    inputs: localAgent.inputs,
    tags: localAgent.tags,
    example_uses: localAgent.exampleUse ? [localAgent.exampleUse] : [],
    trigger_type: localAgent.triggerType,
    created_at: localAgent.date,
    updated_at: localAgent.date,
    relatedProjects: [],
    relatedBlogPosts: [],
    relatedMilestones: [],
    relatedAgents: []
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
            property: 'name',
            direction: 'ascending',
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
        console.log('Agent properties available:', Object.keys(properties))
        console.log('Sample agent properties:', JSON.stringify(properties, null, 2))
        

        
        // Get the page content
        const mdBlocks = await notionToMd.pageToMarkdown(page.id)
        const content = notionToMd.toMarkdownString(mdBlocks)

        // Fetch related content
        let relatedProjects = await fetchRelatedContent(properties.Projects)
        let relatedBlogPosts = await fetchRelatedContent(properties.BlogPosts)
        let relatedMilestones = await fetchRelatedContent(properties.Agents)

        // Only show related content if it actually exists in Notion
        // No fallback data - if no relations exist, show empty arrays

        const agentName = getTextFromProperty(properties.name)
        const agentSlug = getTextFromProperty(properties.slug)
        const agentDescription = getTextFromProperty(properties.description)
        
        console.log('Extracted agent data:', {
          name: agentName,
          slug: agentSlug,
          description: agentDescription,
          status: properties.status?.select?.name || 'idea',
          category: properties.category?.select?.name || getTextFromProperty(properties.category)
        })
        
        return {
          id: page.id,
          name: agentName,
          slug: agentSlug,
          status: properties.status?.select?.name || 'idea',
          category: properties.category?.select?.name || getTextFromProperty(properties.category),
          description: agentDescription,
          content: content.parent, // Use the page content as content
          inputs: properties.inputs?.multi_select?.map((input: any) => input.name) || [],
          tags: getTagsFromProperty(properties.tags),
          example_uses: properties.exampleUses?.rich_text?.map((text: any) => text.plain_text) || [],
          trigger_type: properties.triggerType?.select?.name || 'manual',
          created_at: properties.createdAt?.date?.start || properties.date?.date?.start || new Date().toISOString(),
          updated_at: page.last_edited_time,
          relatedProjects,
          relatedBlogPosts,
          relatedMilestones
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
      
      let relatedProjects = await fetchRelatedContent(properties.Projects)
      let relatedBlogPosts = await fetchRelatedContent(properties.BlogPosts)
      let relatedMilestones = await fetchRelatedContent(properties.Agents)

      // Only show related content if it actually exists in Notion
      // No fallback data - if no relations exist, show empty arrays

      return {
        id: page.id,
        name: getTextFromProperty(properties.name),
        slug: getTextFromProperty(properties.slug),
        status: properties.status?.select?.name || 'idea',
        category: properties.category?.select?.name || getTextFromProperty(properties.category),
        description: getTextFromProperty(properties.description),
        content: content.parent, // Use the page content as content
        inputs: properties.inputs?.multi_select?.map((input: any) => input.name) || [],
        tags: getTagsFromProperty(properties.tags),
        example_uses: properties.exampleUses?.rich_text?.map((text: any) => text.plain_text) || [],
        trigger_type: properties.triggerType?.select?.name || 'manual',
        created_at: properties.createdAt?.date?.start || properties.date?.date?.start || new Date().toISOString(),
        updated_at: page.last_edited_time,
        relatedProjects,
        relatedBlogPosts,
        relatedMilestones,
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