import { NextResponse } from 'next/server'
import { getAllProjects } from '@/lib/projects'

export async function GET() {
  try {
    const projects = await getAllProjects()
    return NextResponse.json({
      success: true,
      projects: projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 