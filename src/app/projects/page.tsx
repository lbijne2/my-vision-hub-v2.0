'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/ProjectCard"
import { ProjectFilters } from "@/components/ProjectFilters"
import type { Project } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()
        
        if (data.success) {
          setProjects(data.projects)
          setFilteredProjects(data.projects)
        } else {
          console.error('Error fetching projects:', data.error)
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
  }, [])

  const handleFiltersChange = (newFilteredProjects: Project[]) => {
    setFilteredProjects(newFilteredProjects)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
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
              <Card key={index} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2 flex-wrap">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-14" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
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
            A collection of ongoing and completed projects exploring the intersection 
            of technology, medicine, design, and human potential.
          </p>
        </div>

        {/* Filters */}
        {projects.length > 0 && (
          <ProjectFilters 
            projects={projects} 
            onFiltersChange={handleFiltersChange}
            filteredCount={filteredProjects.length}
          />
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                 No Projects Found
              </CardTitle>
              <CardDescription className="text-lg">
                No projects match your current filters
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-vision-charcoal/70">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <div className="pt-4">
                <Button variant="vision" asChild>
                  <Link href="/projects">
                    View All Projects
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                🚧 No Projects Available
              </CardTitle>
              <CardDescription className="text-lg">
                No projects are currently available
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-vision-charcoal/70">
                Check back soon for new projects, or configure your Supabase integration to start managing projects.
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