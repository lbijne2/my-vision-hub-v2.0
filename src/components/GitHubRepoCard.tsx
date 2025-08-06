import { Github, Star, GitBranch, Calendar, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GitHubRepoData } from "@/lib/github"

interface GitHubRepoCardProps {
  repoData: GitHubRepoData
  className?: string
}

export function GitHubRepoCard({ repoData, className }: GitHubRepoCardProps) {
  return (
    <Card className={cn(
      "bg-pastel-sky/20 border-vision-border shadow-sm transition-all duration-200 hover:shadow-lg group",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="p-1">
            <Github className="h-5 w-5 text-vision-charcoal" />
          </div>
          <CardTitle className="text-base text-vision-ochre group-hover:text-vision-ochre/80 transition-colors">
            <a 
              href={repoData.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repoData.name}
            </a>
          </CardTitle>
        </div>
        {repoData.description && (
          <CardDescription className="text-vision-charcoal/70 text-sm leading-relaxed">
            {repoData.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-yellow-500">
            <a
              href={`${repoData.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-vision-charcoal/70 hover:text-vision-ochre hover:underline transition-colors"
            >
              <Eye className="h-4 w-4 text-yellow-500" />
              <span>{repoData.watchers.toLocaleString()}</span>
            </a>
            <a
              href={`${repoData.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-vision-charcoal/70 hover:text-vision-ochre hover:underline transition-colors"
            >
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{repoData.stars.toLocaleString()}</span>
            </a>
            <a
              href={`${repoData.url}/fork`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-vision-charcoal/70 hover:text-vision-ochre hover:underline transition-colors"
            >
              <GitBranch className="h-4 w-4 text-vision-ochre" />
              <span>{repoData.forks.toLocaleString()}</span>
            </a>
            {repoData.language && (
              <Badge 
                variant="outline" 
                className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
              >
                {repoData.language}
              </Badge>
            )}
          </div>

          {/* Last commit */}
          <div className="flex items-center space-x-1 text-sm text-vision-charcoal/60">
            <Calendar className="h-4 w-4" />
            <span>Last commit: {repoData.lastCommit}</span>
          </div>

          {/* Topics */}
          {repoData.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {repoData.topics.slice(0, 5).map((topic) => (
                <Badge 
                  key={topic} 
                  variant="outline" 
                  className="text-xs bg-pastel-lavender/20 border-vision-border text-vision-charcoal/70"
                >
                  {topic}
                </Badge>
              ))}
              {repoData.topics.length > 5 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/50"
                >
                  +{repoData.topics.length - 5} more
                </Badge>
              )}
            </div>
          )}

          {/* Open issues */}
          {repoData.openIssues > 0 && (
            <div className="text-sm text-vision-charcoal/60">
              {repoData.openIssues} open issue{repoData.openIssues !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 