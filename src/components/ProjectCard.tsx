import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"
import { getStatusColor } from "@/lib/projects"
import type { Project } from "@/types"

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className={cn("group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full", className)}>
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
                "text-xs font-medium whitespace-nowrap min-w-fit",
                getStatusColor(project.status)
              )}
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-4">
          <p className="text-sm text-vision-charcoal/80 leading-relaxed">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.tags?.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
              >
                {tag}
              </Badge>
            ))}
            {project.tags && project.tags.length > 3 && (
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
            <span>{formatDate(project.created_at)}</span>
            <span className="group-hover:text-vision-ochre transition-colors">
              View Project →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
} 