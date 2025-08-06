import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllProjects } from "@/lib/projects"
import { ProjectCard } from "@/components/ProjectCard"
import { ProjectFilters } from "@/components/ProjectFilters"
import type { Project } from '@/types'

export default async function ProjectsPage() {
  let projects: Project[] = []
  try {
    projects = await getAllProjects()
  } catch (error) {
    console.error('Error fetching projects:', error)
    projects = []
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

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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