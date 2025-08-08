import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/notion'

export async function GET() {
  try {
    const posts = await getBlogPosts()
    
    return NextResponse.json({
      success: true,
      posts: posts
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    
    // Return empty array on error to trigger fallback
    return NextResponse.json({
      success: false,
      posts: []
    })
  }
}
