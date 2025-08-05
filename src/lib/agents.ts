import agentData from '@/data/agents.json'
import { supabase, isSupabaseAvailable, logSupabaseError } from './supabase'
import type { Agent } from '@/types'

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
    // Try Supabase first if available
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
    logSupabaseError('getAgentBySlug', error)
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