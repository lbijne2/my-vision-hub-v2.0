import agentData from '@/data/agents.json'
import { supabase, isSupabaseAvailable, logSupabaseError } from './supabase'
import { Client } from '@notionhq/client'
import type { Agent } from '@/types'

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

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
  if (!relationProperty?.relation) return []
  
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

// Helper function to convert local JSON data to Agent type
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

export async function getAllAgents(): Promise<Agent[]> {
  try {
    // Try Supabase first if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        logSupabaseError('getAllAgents', error)
        throw error
      }

      if (data && data.length > 0) {
        return data
      }
    }
  } catch (error) {
    logSupabaseError('getAllAgents', error)
  }

  // Fallback to local data
  console.warn('Using fallback agent data')
  return agentData.map(convertLocalAgentToAgent)
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  try {
    // Try Notion first if configured
    if (process.env.NOTION_API_KEY && process.env.NOTION_AGENTS_DB_ID) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_AGENTS_DB_ID,
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
        console.warn('Agent page missing properties:', page.id)
        return null
      }

      const properties = page.properties

      // Fetch related content
      let relatedProjects = await fetchRelatedContent(properties.projects)
      let relatedBlogPosts = await fetchRelatedContent(properties.blogPosts)
      let relatedMilestones = await fetchRelatedContent(properties.milestones)
      let relatedAgents = await fetchRelatedContent(properties.agents)

      console.log(`Agent "${getTextFromProperty(properties.title)}" related content:`, {
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
        name: getTextFromProperty(properties.title),
        slug: getTextFromProperty(properties.slug),
        status: properties.status?.select?.name || 'idea',
        category: getTextFromProperty(properties.category),
        description: getTextFromProperty(properties.description),
        inputs: properties.inputs?.rich_text?.map((text: any) => text.plain_text) || [],
        tags: getTagsFromProperty(properties.tags),
        example_uses: properties.exampleUses?.rich_text?.map((text: any) => text.plain_text) || [],
        trigger_type: properties.triggerType?.select?.name || 'manual',
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
        .from('agents')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        logSupabaseError('getAgentBySlug', error)
        throw error
      }

      if (data) {
        return data
      }
    }
  } catch (error) {
    console.error('Error fetching agent from Notion:', error)
  }

  // Fallback to local data
  const fallbackAgent = agentData.find((agent: any) => agent.slug === slug)
  return fallbackAgent ? convertLocalAgentToAgent(fallbackAgent) : null
}

export async function getAgentSlugs(): Promise<string[]> {
  try {
    // Try Supabase first if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('agents')
        .select('slug')

      if (error) {
        logSupabaseError('getAgentSlugs', error)
        throw error
      }

      if (data) {
        return data.map(agent => agent.slug)
      }
    }
  } catch (error) {
    logSupabaseError('getAgentSlugs', error)
  }

  // Fallback to local data
  return agentData.map((agent: any) => agent.slug)
}

export function getAgentStatusColor(status: string): string {
  const statusColors = {
    "active": "bg-pastel-mint text-vision-charcoal",
    "prototype": "bg-pastel-sky text-vision-charcoal",
    "idea": "bg-pastel-cream text-vision-charcoal",
  }
  
  return statusColors[status as keyof typeof statusColors] || "bg-pastel-cream text-vision-charcoal"
} 