import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AspectRatio, AspectRatioContent } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { getProjectBySlug, getStatusColor } from "@/lib/projects"
import { cn } from "@/lib/utils"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
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
              <p className="text-xl text-vision-charcoal/70 mb-4 leading-relaxed">
                {project.subtitle}
              </p>
            </div>
            <Badge 
              className={cn(
                "text-sm font-medium ml-4",
                getStatusColor(project.status)
              )}
            >
              {project.status}
            </Badge>
          </div>

          {/* Tags */}
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
        </div>

        {/* Cover Image */}
        {project.coverImage && (
          <Card className="mb-8 overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <AspectRatioContent>
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </AspectRatioContent>
            </AspectRatio>
          </Card>
        )}

        {/* Project Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-vision-charcoal">
              Project Details
            </CardTitle>
            <CardDescription className="text-vision-charcoal/70">
              {new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-6" />
            
            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-vision-charcoal/80 leading-relaxed space-y-6">
                {project.content.split('\n\n').map((paragraph, index) => {
                  // Handle markdown-style headers
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-semibold text-vision-charcoal mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold text-vision-charcoal mt-6 mb-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    )
                  }
                  
                  // Handle lists
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                    return (
                      <ul key={index} className="list-disc list-inside space-y-1 ml-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-vision-charcoal/80">
                            {item.replace('- ', '')}
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  
                  // Handle numbered lists
                  if (paragraph.match(/^\d+\./)) {
                    const items = paragraph.split('\n').filter(line => line.match(/^\d+\./))
                    return (
                      <ol key={index} className="list-decimal list-inside space-y-1 ml-4">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-vision-charcoal/80">
                            {item.replace(/^\d+\.\s*/, '')}
                          </li>
                        ))}
                      </ol>
                    )
                  }
                  
                  // Handle bold text
                  if (paragraph.includes('**')) {
                    const parts = paragraph.split('**')
                    return (
                      <p key={index} className="text-vision-charcoal/80">
                        {parts.map((part, partIndex) => 
                          partIndex % 2 === 1 ? (
                            <strong key={partIndex} className="font-semibold text-vision-charcoal">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    )
                  }
                  
                  // Regular paragraph
                  return (
                    <p key={index} className="text-vision-charcoal/80">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 