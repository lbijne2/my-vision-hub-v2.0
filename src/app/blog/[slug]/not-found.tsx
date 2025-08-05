import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
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

        {/* Not Found Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vision-charcoal">
              📝 Post Not Found
            </CardTitle>
            <CardDescription className="text-lg">
              The blog post you're looking for doesn't exist
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-vision-charcoal/70">
              The blog post you're trying to access either doesn't exist or hasn't been published yet. 
              Please check the URL or browse our available posts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="vision" asChild>
                <Link href="/blog">
                  Browse All Posts
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 