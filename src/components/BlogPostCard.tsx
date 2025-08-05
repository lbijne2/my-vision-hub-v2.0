import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/types"
import { cn, formatDate } from "@/lib/utils"

interface BlogPostCardProps {
  post: BlogPost
  className?: string
}

export function BlogPostCard({ post, className }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className={cn("group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-vision-charcoal group-hover:text-vision-ochre transition-colors">
                {post.title}
              </CardTitle>
              <CardDescription className="text-sm text-vision-charcoal/70">
                {post.author}
              </CardDescription>
            </div>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs font-medium",
                post.published 
                  ? "bg-pastel-mint text-vision-charcoal" 
                  : "bg-pastel-peach text-vision-charcoal"
              )}
            >
              {post.published ? 'published' : 'draft'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-4">
          <p className="text-sm text-vision-charcoal/80 leading-relaxed">
            {post.content?.substring(0, 150)}...
          </p>
          
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 3).map((tag: string) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
              >
                {tag}
              </Badge>
            ))}
            {post.tags && post.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
              >
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-xs text-vision-charcoal/60">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span className="group-hover:text-vision-ochre transition-colors">
              Read Post →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
} 