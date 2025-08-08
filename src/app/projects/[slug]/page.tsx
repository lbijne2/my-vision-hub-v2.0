import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import LinkedItemIcons from "@/components/LinkedItemIcons"
import { WidescreenToggle } from "@/components/WidescreenToggle"
import { cn, formatDate, formatDateHeader, formatDateFromISO } from "@/lib/utils"
import { getProjectBySlug, getAllProjects, getStatusColor } from "@/lib/projects"
import { AsyncGitHubRepo, AsyncRelatedContent } from "@/components/AsyncComponents"
import type { Metadata } from "next"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  // Debug logging
  console.log('Project data:', {
    title: project.title,
    relatedProjects: project.relatedProjects,
    relatedBlogPosts: project.relatedBlogPosts,
    relatedMilestones: project.relatedMilestones,
    relatedAgents: project.relatedAgents
  })

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="text-vision-charcoal hover:text-vision-ochre hover:bg-vision-ochre/10"
            asChild
          >
            <Link href="/projects" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-vision-charcoal mb-2">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-xl text-vision-charcoal/70 mb-4 leading-relaxed">
                  {project.subtitle}
                </p>
              )}
            </div>
            <Badge 
              className={cn(
                "text-sm font-medium ml-6 whitespace-nowrap min-w-fit",
                getStatusColor(project.status)
              )}
            >
              {project.status}
            </Badge>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-vision-charcoal/60 mb-6">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDateHeader(project.created_at)}</span>
            </div>
            {project.category && (
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>{project.category}</span>
              </div>
            )}
            {project.updated_at && project.updated_at !== project.created_at && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Updated {formatDateFromISO(project.updated_at)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image */}
        {project.cover_image_url && (
          <Card className="mb-8 overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <div className="h-full w-full">
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </AspectRatio>
          </Card>
        )}



        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-vision-charcoal">
                  Project Details
                </CardTitle>
                <CardDescription className="text-vision-charcoal/70">
                  {project.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-6" />
                
                {/* Content */}
                {project.content ? (
                  <MarkdownRenderer content={project.content} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-vision-charcoal/60">
                      Content not available. This project may be in development or the content hasn't been loaded yet.
                    </p>
                    <p className="text-sm text-vision-charcoal/40 mt-2">
                      If you're using Notion integration, make sure the project has content in the database.
                    </p>
                  </div>
                )}

                {(project.parentProject || (project.childProjects && project.childProjects.length > 0) || (project.siblingProjects && project.siblingProjects.length > 0)) && (
                  <>
                    <Separator className="my-6" />
                    <section className="mt-2" aria-label="Project Structure">
                      <h3 className="text-2xl text-vision-charcoal font-semibold mb-4">Project Structure</h3>
                      <div className="text-sm space-y-1">
                        {/* Parent Project (if exists) */}
                        {project.parentProject ? (
                          <div className="flex">
                            <span className="text-vision-charcoal/70 w-16">Parent:</span>
                            <Link
                              href={`/projects/${project.parentProject.slug}`}
                              className="underline hover:text-vision-ochre"
                            >
                              {project.parentProject.title}
                            </Link>
                          </div>
                        ) : (
                          /* Current project is a parent */
                          <div className="flex">
                            <span className="text-vision-charcoal/70 w-16">Current:</span>
                            <span className="font-medium text-vision-charcoal">{project.title}</span>
                          </div>
                        )}

                        {/* Current project (if it has a parent) */}
                        {project.parentProject && (
                          <div className="flex">
                            <span className="text-vision-charcoal/40 w-4">↳</span>
                            <span className="text-vision-charcoal/70 w-16">Current:</span>
                            <span className="font-medium text-vision-charcoal">{project.title}</span>
                          </div>
                        )}

                        {/* Sibling Projects */}
                        {project.siblingProjects && project.siblingProjects.length > 0 && 
                          project.siblingProjects.map((sibling) => (
                            <div key={sibling.slug} className="flex">
                              <span className="text-vision-charcoal/40 w-4">↳</span>
                              <span className="text-vision-charcoal/70 w-16">Sibling:</span>
                              <Link
                                href={`/projects/${sibling.slug}`}
                                className="underline hover:text-vision-ochre"
                              >
                                {sibling.title}
                              </Link>
                            </div>
                          ))
                        }

                        {/* Child Projects */}
                        {project.childProjects && project.childProjects.length > 0 && 
                          project.childProjects.map((child) => (
                            <div key={child.slug} className="flex">
                              <span className="text-vision-charcoal/40 w-4">↳</span>
                              <span className="text-vision-charcoal/70 w-16">Child:</span>
                              <Link
                                href={`/projects/${child.slug}`}
                                className="underline hover:text-vision-ochre"
                              >
                                {child.title}
                              </Link>
                            </div>
                          ))
                        }

                        {!project.parentProject && (!project.childProjects || project.childProjects.length === 0) && (!project.siblingProjects || project.siblingProjects.length === 0) && (
                          <div className="text-vision-charcoal/60">This project has no related hierarchy.</div>
                        )}
                      </div>
                    </section>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* GitHub Repository Section */}
            {project.github_repo && (
              <AsyncGitHubRepo repoPath={project.github_repo} />
            )}

            {/* Project Status & Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-vision-charcoal">
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Status:</span>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(project.status)}
                  >
                    {project.status}
                  </Badge>
                </div>
                {project.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-vision-charcoal/60">Category:</span>
                    <span className="text-sm text-vision-charcoal/80">{project.category}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Created:</span>
                  <span className="text-sm text-vision-charcoal/80">{formatDate(project.created_at)}</span>
                </div>
                {project.updated_at && project.updated_at !== project.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-vision-charcoal/60">Updated:</span>
                    <span className="text-sm text-vision-charcoal/80">{formatDate(project.updated_at)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-vision-charcoal">
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Links */}
            {/* {(project.github_url || project.notion_url) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-vision-charcoal">
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.github_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-vision-charcoal/60">GitHub:</span>
                      <a 
                        href={project.github_url} 
                        className="text-sm text-vision-ochre hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Repository
                      </a>
                    </div>
                  )}
                  {project.notion_url && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-vision-charcoal/60">Notion:</span>
                      <a 
                        href={project.notion_url} 
                        className="text-sm text-vision-ochre hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )} */}

            {/* Related Content */}
            <AsyncRelatedContent
              relatedProjects={project.relatedProjects}
              relatedBlogPosts={project.relatedBlogPosts}
              relatedMilestones={project.relatedMilestones}
              relatedAgents={project.relatedAgents}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-vision-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-vision-charcoal/60">
              <p>Created on {formatDate(project.created_at)}</p>
              {project.updated_at && project.updated_at !== project.created_at && (
                <p>Last updated on {formatDate(project.updated_at)}</p>
              )}
              {project.github_url && (
                <p>GitHub: <a href={project.github_url} className="text-vision-ochre hover:underline" target="_blank" rel="noopener noreferrer">View Repository</a></p>
              )}
              {project.notion_url && (
                <p>Notion: <a href={project.notion_url} className="text-vision-ochre hover:underline" target="_blank" rel="noopener noreferrer">View Document</a></p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <WidescreenToggle />
              <Button variant="outline" asChild>
                <Link href="/projects">
                  View All Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 