import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"
import { getAgentStatusColor } from "@/lib/agents"
import type { Agent } from "@/types"

interface AgentCardProps {
  agent: Agent
  className?: string
}

export function AgentCard({ agent, className }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.slug}`}>
      <Card className={cn("group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-vision-charcoal group-hover:text-vision-ochre transition-colors">
                {agent.name}
              </CardTitle>
              <CardDescription className="text-sm text-vision-charcoal/70">
                {agent.category}
              </CardDescription>
            </div>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs font-medium whitespace-nowrap min-w-fit ml-3",
                getAgentStatusColor(agent.status)
              )}
            >
              {agent.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-4">
          <p className="text-sm text-vision-charcoal/80 leading-relaxed">
            {agent.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-vision-charcoal/60">Trigger:</span>
              <Badge 
                variant="outline" 
                className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
              >
                {agent.trigger_type || 'manual'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {agent.tags?.slice(0, 3).map((tag: string) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                >
                  {tag}
                </Badge>
              ))}
              {agent.tags && agent.tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-vision-beige border-vision-border text-vision-charcoal/70"
                >
                  +{agent.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-xs text-vision-charcoal/60">
            <span>{formatDate(agent.created_at)}</span>
            <span className="group-hover:text-vision-ochre transition-colors">
              View Agent →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
} 