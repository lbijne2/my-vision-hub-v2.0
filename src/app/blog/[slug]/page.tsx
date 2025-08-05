import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getBlogPostBySlug } from "@/lib/notion"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { cn, formatDate } from "@/lib/utils"

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
              <p className="text-xl text-vision-charcoal/70 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-sm font-medium ml-4",
                              post.status === 'published' 
                ? "bg-pastel-mint text-vision-charcoal" 
                : "bg-pastel-peach text-vision-charcoal"
              )}
            >
              {post.status}
            </Badge>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-vision-charcoal/60 mb-6">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.lastEdited && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Edited {new Date(post.lastEdited).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Tags */}
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
        </div>

        {/* Blog Post Content */}
        <Card>
          <CardContent className="p-8">
            {post.content ? (
              <MarkdownRenderer content={post.content} />
            ) : (
              <div className="text-center py-12">
                <p className="text-vision-charcoal/60">
                  Content not available. This post may be a draft or the content hasn't been loaded yet.
                </p>
                <p className="text-sm text-vision-charcoal/40 mt-2">
                  If you're using Notion integration, make sure the post has content in the database.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-vision-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-vision-charcoal/60">
              <p>Written by {post.author}</p>
              <p>Published on {formatDate(post.date)}</p>
              {post.lastEdited && (
                                  <p>Last edited on {formatDate(post.lastEdited)}</p>
              )}
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">
                View All Posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 