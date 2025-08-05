import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getBlogPosts } from "@/lib/notion"
import { cn } from "@/lib/utils"

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Blog
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            Reflective, opinionated, and analytical writing on AI, medicine, 
            design, ethics, and the future of human-technology collaboration.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
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
                          post.status === 'published' 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        )}
                      >
                        {post.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-vision-charcoal/80 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                        >
                          +{post.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-vision-charcoal/60">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span className="group-hover:text-vision-ochre transition-colors">
                        Read Post →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                📝 No Posts Available
              </CardTitle>
              <CardDescription className="text-lg">
                No blog posts are currently available
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-vision-charcoal/70">
                Check back soon for new content, or configure your Notion integration to start publishing posts.
              </p>
              <div className="pt-4">
                <Button variant="vision" asChild>
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                🚧 More Features Coming Soon
              </CardTitle>
              <CardDescription className="text-lg">
                Additional blog features are under development
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-vision-charcoal/70">
                Future enhancements will include:
              </p>
              <ul className="text-left space-y-2 text-vision-charcoal/70">
                <li>• Comment system and reader engagement</li>
                <li>• Social sharing and bookmarking</li>
                <li>• Advanced search and filtering</li>
                <li>• Newsletter subscription</li>
                <li>• Related posts and recommendations</li>
              </ul>
              <div className="pt-4">
                <Button variant="vision" asChild>
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 