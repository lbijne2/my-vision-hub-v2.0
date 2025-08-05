import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogPostCard } from "@/components/BlogPostCard"
import { getBlogPosts } from "@/lib/notion"

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
              <BlogPostCard key={post.id} post={post} />
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