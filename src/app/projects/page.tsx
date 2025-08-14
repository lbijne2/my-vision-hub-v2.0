'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/ProjectCard"
import { ProjectFilters } from "@/components/ProjectFilters"
import { ProjectCardSkeleton } from "@/components/ui/loading-skeletons"
import { usePreloadedData } from "@/components/BackgroundPreloader"
import type { Project } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Check for preloaded data first
  const preloadedData = usePreloadedData('projects')

  useEffect(() => {
    // If we have preloaded data, use it immediately
    if (preloadedData && preloadedData.projects) {
      setProjects(preloadedData.projects)
      setFilteredProjects(preloadedData.projects)
      setLoading(false)
      return
    }

    const fetchProjects = async () => {
      try {
        // First try to fetch from API (if Supabase is configured)
        const response = await fetch('/api/projects')
        const data = await response.json()
        
        if (data.success && data.projects.length > 0) {
          // Use projects from API
          setProjects(data.projects)
          setFilteredProjects(data.projects)
        } else {
          setProjects([])
          setFilteredProjects([])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
        setFilteredProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [preloadedData])

  const handleFiltersChange = (newFilteredProjects: Project[]) => {
    setFilteredProjects(newFilteredProjects)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with actual title and subtitle */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
              Projects
            </h1>
            <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
              Explore ongoing work, research, and explorations at the intersection 
              of technology, medicine, our future, and human potential.
            </p>
          </div>

          {/* Filters Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
              </div>
              <Skeleton className="h-10 w-64" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Projects
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            Explore ongoing work, research, and explorations at the intersection 
            of technology, medicine, our future, and human potential.
          </p>
        </div>

        {/* Filters */}
        <ProjectFilters 
          projects={projects} 
          onFiltersChange={setFilteredProjects}
          filteredCount={filteredProjects.length}
        />

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                🚧 More Features Coming Soon
              </CardTitle>
              <CardDescription className="text-lg">
                Additional project features are under development
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-vision-charcoal/70">
                Future enhancements will include:
              </p>
              <ul className="text-left space-y-2 text-vision-charcoal/70">
                <li>• Interactive project timelines and progress tracking</li>
                <li>• GitHub integration for code previews</li>
                <li>• Supabase integration for project documentation</li>
                <li>• Embedded tools and interactive elements</li>
                <li>• Comment system and collaboration features</li>
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