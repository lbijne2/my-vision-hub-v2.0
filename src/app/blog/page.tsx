'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogPostCard } from "@/components/BlogPostCard"
import { BlogPostCardSkeleton } from "@/components/ui/loading-skeletons"
import type { BlogPost } from "@/types"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/blog-posts')
        const data = await response.json()
        
        if (data.success && data.posts.length > 0) {
          setPosts(data.posts)
        } else {
          setPosts([])
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Blog
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            Thoughts, insights, and explorations at the intersection of technology, 
            medicine, design, and human potential.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogPostCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: BlogPost) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                📝 More Features Coming Soon
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
                <li>• Search and filtering capabilities</li>
                <li>• Category and tag organization</li>
                <li>• Supabase integration for content management</li>
                <li>• Comment system and engagement features</li>
                <li>• Newsletter subscription and notifications</li>
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