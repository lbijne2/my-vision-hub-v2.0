import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { getProjectBySlug, getStatusColor } from "@/lib/projects"
import { getRepoInfo } from "@/lib/github"
import { GitHubRepoCard } from "@/components/GitHubRepoCard"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { WidescreenToggle } from "@/components/WidescreenToggle"
import RelatedContent from "@/components/RelatedContent"
import { cn, formatDate, formatDateHeader, formatDateFromISO } from "@/lib/utils"

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

  // Fetch GitHub repository data if available
  let githubRepoData = null
  if (project.github_repo) {
    try {
      githubRepoData = await getRepoInfo(project.github_repo)
    } catch (error) {
      console.error('Error fetching GitHub repository data:', error)
    }
  }

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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* GitHub Repository Section */}
            {project.github_repo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-vision-charcoal">
                    GitHub Repository
                  </CardTitle>
                  <CardDescription>
                    Source code and development information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {githubRepoData ? (
                    <GitHubRepoCard repoData={githubRepoData} />
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-vision-charcoal/60 mb-4 text-sm">
                        GitHub information unavailable
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
                        asChild
                      >
                        <a 
                          href={`https://github.com/${project.github_repo}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View on GitHub
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
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
            <RelatedContent
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