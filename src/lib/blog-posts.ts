import postsData from '@/data/posts.json'
import { supabase, isSupabaseAvailable, logSupabaseError } from './supabase'
import type { BlogPost } from '@/types'

// Helper function to convert local JSON data to BlogPost type
function convertLocalPostToBlogPost(localPost: any): BlogPost {
  return {
    id: localPost.id,
    title: localPost.title,
    slug: localPost.slug,
    content: localPost.content,
    author: localPost.author,
    published: localPost.published,
    tags: localPost.tags,
    published_at: localPost.publishedAt,
    notion_url: localPost.notionUrl,
    created_at: localPost.date,
    updated_at: localPost.date,
    relatedProjects: ['ai-medical-diagnostics', 'ethical-design-framework'],
    relatedBlogPosts: [],
    relatedMilestones: ['milestone-1'],
    relatedAgents: ['template-generator', 'clinical-summarizer'],
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    // Try Supabase first if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })

      if (error) {
        logSupabaseError('getAllBlogPosts', error)
        throw error
      }

      if (data && data.length > 0) {
        console.log('Using Supabase blog posts data')
        return data
      }
    }
  } catch (error) {
    logSupabaseError('getAllBlogPosts', error)
  }

  // Fallback to local data
  console.warn('Using fallback blog posts data')
  return postsData.map(convertLocalPostToBlogPost)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Try Supabase first if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        logSupabaseError('getBlogPostBySlug', error)
        throw error
      }

      if (data) {
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

export async function getBlogPostSlugs(): Promise<string[]> {
  try {
    // Try Supabase first if available
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug')

      if (error) {
        logSupabaseError('getBlogPostSlugs', error)
        throw error
      }

      if (data) {
        return data.map(post => post.slug)
      }
    }
  } catch (error) {
    logSupabaseError('getBlogPostSlugs', error)
  }

  // Fallback to local data
  return postsData.map((post: any) => post.slug)
} 