import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: string
  image: string
  tags: string[]
  date: string
}

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const statusColors = {
    "In Progress": "bg-blue-100 text-blue-800",
    "Planning": "bg-yellow-100 text-yellow-800", 
    "Research": "bg-purple-100 text-purple-800",
    "Completed": "bg-green-100 text-green-800",
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300 cursor-pointer", className)}>
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
              "text-xs font-medium",
              statusColors[project.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
            )}
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-vision-charcoal/80 leading-relaxed">
          {project.description}
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
        
        <div className="flex items-center justify-between text-xs text-vision-charcoal/60">
          <span>{new Date(project.date).toLocaleDateString()}</span>
          <span className="group-hover:text-vision-ochre transition-colors">
            View Project →
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 