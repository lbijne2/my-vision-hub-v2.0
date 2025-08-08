import projectsData from '@/data/projects.json'
import { supabase, isSupabaseAvailable, logSupabaseError } from './supabase'
import { getAllProjects as getNotionProjects, getProjectBySlug as getNotionProjectBySlug } from './notion'
import type { Project } from '@/types'

// Helper function to convert local JSON data to Project type
function convertLocalProjectToProject(localProject: any): Project {
  // Map status values to match the Project interface
  const mapStatus = (status: string): 'active' | 'prototype' | 'archived' => {
    switch (status.toLowerCase()) {
      case 'in progress':
      case 'active':
        return 'active'
      case 'planning':
      case 'research':
      case 'prototype':
        return 'prototype'
      case 'completed':
      case 'archived':
        return 'archived'
      default:
        return 'prototype'
    }
  }

  return {
    id: localProject.id,
    title: localProject.title,
    slug: localProject.slug,
    subtitle: localProject.subtitle,
    description: localProject.description,
    cover_image_url: localProject.coverImage,
    tags: localProject.tags,
    status: mapStatus(localProject.status),
    visible: localProject.visible !== undefined ? localProject.visible : true,
    github_url: localProject.githubUrl,
    github_repo: localProject.github_repo,
    notion_url: localProject.notionUrl,
    created_at: localProject.date,
    updated_at: localProject.date,
    parentProject: localProject.parentProject,
    childProjects: localProject.childProjects,
    siblingProjects: localProject.siblingProjects,
    relatedProjects: [],
    relatedBlogPosts: ['future-of-ai-in-healthcare', 'designing-ethical-ai'],
    relatedMilestones: ['milestone-1'],
    relatedAgents: ['template-generator', 'clinical-summarizer'],
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    // Try Notion first if configured
    const notionProjects = await getNotionProjects()
    if (notionProjects && notionProjects.length > 0) {
      // Filter by visibility - only return projects where visible is true or undefined
      return notionProjects.filter(project => project.visible !== false)
    }
  } catch (error) {
    console.error('Error fetching projects from Notion:', error)
  }

  try {
    // Try Supabase as fallback if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        logSupabaseError('getAllProjects', error)
      } else if (data && data.length > 0) {
        // Filter by visibility - only return projects where visible is true or undefined
        return data.filter(project => project.visible !== false)
      }
    }
  } catch (error) {
    logSupabaseError('getAllProjects', error)
  }

  // Fallback to local data
  const localProjects = projectsData.map(convertLocalProjectToProject)
  // Filter by visibility - only return projects where visible is true or undefined
  return localProjects.filter(project => project.visible !== false)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    // Try Notion first if configured
    const notionProject = await getNotionProjectBySlug(slug)
    if (notionProject) {
      return notionProject
    }
  } catch (error) {
    console.error('Error fetching project from Notion:', error)
  }

  try {
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
  return fallbackProject ? convertLocalProjectToProject(fallbackProject) : null
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    // Try Supabase first if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('slug')

      if (error) {
        logSupabaseError('getProjectSlugs', error)
        throw error
      }

      if (data) {
        return data.map(project => project.slug)
      }
    }
  } catch (error) {
    logSupabaseError('getProjectSlugs', error)
  }

  // Fallback to local data
  return projectsData.map((project: any) => project.slug)
}

export function getStatusColor(status: string): string {
  const statusColors = {
    "in progress": "bg-pastel-sky text-vision-charcoal",
    "planning": "bg-pastel-peach text-vision-charcoal",
    "research": "bg-pastel-lavender text-vision-charcoal",
    "completed": "bg-pastel-mint text-vision-charcoal",
    "idea": "bg-pastel-cream text-vision-charcoal",
    "active": "bg-pastel-mint text-vision-charcoal",
    "prototype": "bg-pastel-sky text-vision-charcoal",
    "archived": "bg-pastel-cream text-vision-charcoal",
  }
  
  return statusColors[status as keyof typeof statusColors] || "bg-pastel-cream text-vision-charcoal"
} 