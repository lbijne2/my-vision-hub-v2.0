import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllProjects, getStatusColor } from "@/lib/notion"
import { cn, formatDate } from "@/lib/utils"

export default async function ProjectsPage() {
  const projects = await getAllProjects()

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
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold text-vision-charcoal group-hover:text-vision-ochre transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-vision-charcoal/70">
                          {project.category}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs font-medium whitespace-nowrap min-w-fit ml-3",
                          getStatusColor(project.status)
                        )}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4">
                    <p className="text-sm text-vision-charcoal/80 leading-relaxed">
                      {project.subtitle || project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                        >
                          +{project.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between text-xs text-vision-charcoal/60">
                      <span>{formatDate(project.date)}</span>
                      <span className="group-hover:text-vision-ochre transition-colors">
                        View Project →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
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
                Check back soon for new projects, or configure your Notion integration to start managing projects.
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
                <li>• Notion integration for project documentation</li>
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