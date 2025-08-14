// Database table interfaces for Supabase integration

export interface Agent {
  id: string
  name: string
  slug: string
  status: 'active' | 'prototype' | 'idea'
  category: string
  description?: string
  content?: string // Markdown content from Notion page body
  inputs?: string[]
  tags?: string[]
  example_uses?: string[]
  trigger_type?: string
  created_at: string
  updated_at: string
  relatedProjects?: string[]
  relatedBlogPosts?: string[]
  relatedMilestones?: string[]
  relatedAgents?: string[]
}

export interface Project {
  id: string
  title: string
  slug: string
  subtitle?: string
  category?: string
  description?: string
  content?: string
  cover_image_url?: string
  tags?: string[]
  status: 'active' | 'prototype' | 'archived'
  visible?: boolean // Maps to Notion 'published' checkbox property
  github_url?: string
  github_repo?: string
  github_preview_path?: string // New field for GitHub file preview
  notion_url?: string
  created_at: string
  updated_at: string
  relatedProjects?: string[]
  relatedBlogPosts?: string[]
  relatedMilestones?: string[]
  relatedAgents?: string[]
  parentProject?: {
    title: string
    slug: string
  }
  childProjects?: Array<{
    title: string
    slug: string
  }>
  siblingProjects?: Array<{
    title: string
    slug: string
  }>
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  author?: string
  published: boolean
  tags?: string[]
  published_at?: string
  notion_url?: string
  created_at: string
  updated_at: string
  relatedProjects?: string[]
  relatedBlogPosts?: string[]
  relatedMilestones?: string[]
  relatedAgents?: string[]
  // New fields for files and media
  cover_image_url?: string
  attachments?: BlogPostAttachment[]
  media_files?: BlogPostMedia[]
}

// New interface for blog post attachments
export interface BlogPostAttachment {
  id: string
  name: string
  url: string
  type: 'file' | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'archive' | 'other'
  size?: number
  mime_type?: string
  created_at?: string
}

// New interface for blog post media files
export interface BlogPostMedia {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'audio' | 'gif' | 'file' | 'other'
  caption?: string
  alt_text?: string
  width?: number
  height?: number
  duration?: number // for video/audio
  mime_type?: string
  created_at?: string
}

export interface Milestone {
  id: string
  title: string
  type: string
  date: string
  description: string
  icon: string
  color: string
  linked_items?: string[] // e.g. ["project:ai-medical-diagnostics", "agent:template-generator"]
}

// Database schema types
export interface Database {
  public: {
    Tables: {
      agents: {
        Row: Agent
        Insert: Omit<Agent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
} 