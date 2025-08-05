import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import postsData from '@/data/posts.json'

// Types for blog posts
export interface BlogPost {
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

// Fetch all published blog posts from Notion
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Check if Notion is configured
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_BLOG_DB_ID) {
      console.warn('Notion API not configured, using fallback data')
      return postsData as BlogPost[]
    }

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
      // Type guard to ensure page has properties
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
        author: getTextFromProperty(properties.author),
        date: properties.date?.date?.start || new Date().toISOString(),
        tags: getTagsFromProperty(properties.tags),
        status: 'published',
        lastEdited: properties.lastEdited?.last_edited_time,
      }
    }).filter(Boolean) as BlogPost[]

    return posts
  } catch (error) {
    console.error('Error fetching blog posts from Notion:', error)
    console.warn('Using fallback data')
    return postsData as BlogPost[]
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Check if Notion is configured
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_BLOG_DB_ID) {
      console.warn('Notion API not configured, using fallback data')
      const fallbackPost = postsData.find((post: any) => post.slug === slug)
      return fallbackPost as BlogPost || null
    }

    // First, find the page by slug
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
    // Type guard to ensure page has properties
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
      author: getTextFromProperty(properties.author),
      date: properties.date?.date?.start || new Date().toISOString(),
      tags: getTagsFromProperty(properties.tags),
      status: 'published',
      content: content.parent,
      lastEdited: properties.lastEdited?.last_edited_time,
    }
  } catch (error) {
    console.error('Error fetching blog post from Notion:', error)
    console.warn('Using fallback data')
    const fallbackPost = postsData.find((post: any) => post.slug === slug)
    return fallbackPost as BlogPost || null
  }
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