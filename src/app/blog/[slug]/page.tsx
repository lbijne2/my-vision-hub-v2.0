import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getBlogPostBySlug } from "@/lib/notion"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { WidescreenToggle } from "@/components/WidescreenToggle"
import RelatedContent from "@/components/RelatedContent"
import { cn, formatDate, formatDateHeader, formatDateFromISO } from "@/lib/utils"
import type { BlogPost } from "@/types"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Debug logging
  console.log('Blog post data:', {
    title: post.title,
    relatedProjects: post.relatedProjects,
    relatedBlogPosts: post.relatedBlogPosts,
    relatedMilestones: post.relatedMilestones,
    relatedAgents: post.relatedAgents
  })

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="text-vision-charcoal hover:text-vision-ochre hover:bg-vision-ochre/10"
            asChild
          >
            <Link href="/blog" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
          </Button>
        </div>

        {/* Blog Post Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-vision-charcoal mb-2">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg text-vision-charcoal/70 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
            <Badge 
              className={cn(
                "text-sm font-medium ml-6 whitespace-nowrap min-w-fit",
                post.published 
                  ? "bg-pastel-mint text-vision-charcoal" 
                  : "bg-pastel-peach text-vision-charcoal"
              )}
            >
              {post.published ? 'published' : 'draft'}
            </Badge>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-vision-charcoal/60 mb-6">
            {post.author && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDateHeader(post.published_at || post.created_at)}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Blog Post Content */}
        <Card>
          <CardContent className="pt-6">
            {/* Content */}
            {post.content ? (
              <MarkdownRenderer content={post.content} />
            ) : (
              <div className="text-center py-12">
                <p className="text-vision-charcoal/60">
                  Content not available. This post may be in development or the content hasn't been loaded yet.
                </p>
                <p className="text-sm text-vision-charcoal/40 mt-2">
                  If you're using Supabase integration, make sure the post has content in the database.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Content */}
        <RelatedContent
          relatedProjects={post.relatedProjects}
          relatedBlogPosts={post.relatedBlogPosts}
          relatedMilestones={post.relatedMilestones}
          relatedAgents={post.relatedAgents}
          className="mt-8"
        />

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-vision-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-vision-charcoal/60">
              <p>Written by {post.author}</p>
              <p>Published on {formatDate(post.published_at || post.created_at)}</p>
              {post.updated_at && post.updated_at !== post.created_at && (
                <p>Last edited on {formatDate(post.updated_at)}</p>
              )}
              {post.notion_url && (
                <p>Notion: <a href={post.notion_url} className="text-vision-ochre hover:underline" target="_blank" rel="noopener noreferrer">View Document</a></p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <WidescreenToggle />
              <Button variant="outline" asChild>
                <Link href="/blog">
                  View All Posts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 