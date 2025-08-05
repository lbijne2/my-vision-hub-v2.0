import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Zap, Tag, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getAgentBySlug, getAgentStatusColor } from "@/lib/agents"
import { MarkdownRenderer } from "@/components/MarkdownRenderer"
import { cn, formatDate, formatDateHeader, formatDateFromISO } from "@/lib/utils"
import type { Agent } from "@/types"

interface AgentPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params
  const agent = await getAgentBySlug(slug)

  if (!agent) {
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
            <Link href="/agents" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Agents</span>
            </Link>
          </Button>
        </div>

        {/* Agent Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-vision-charcoal mb-2">
                {agent.name}
              </h1>
              <p className="text-xl text-vision-charcoal/70 mb-4 leading-relaxed">
                {agent.description}
              </p>
            </div>
            <Badge 
              className={cn(
                "text-sm font-medium ml-6 whitespace-nowrap min-w-fit",
                getAgentStatusColor(agent.status)
              )}
            >
              {agent.status}
            </Badge>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-vision-charcoal/60 mb-6">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDateHeader(agent.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>{agent.trigger_type || 'manual'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span>{agent.category}</span>
            </div>
          </div>

          {/* Tags */}
          {agent.tags && agent.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {agent.tags.map((tag) => (
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

        {/* Agent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-vision-charcoal flex items-center space-x-2">
                  <FileText className="h-6 w-6" />
                  <span>Agent Details</span>
                </CardTitle>
                <CardDescription className="text-vision-charcoal/70">
                  {agent.category} • {agent.trigger_type || 'manual'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-6" />
                
                {/* Content */}
                {agent.description ? (
                  <MarkdownRenderer content={agent.description} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-vision-charcoal/60">
                      Content not available. This agent may be in development or the content hasn't been loaded yet.
                    </p>
                    <p className="text-sm text-vision-charcoal/40 mt-2">
                      If you're using Supabase integration, make sure the agent has content in the database.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inputs */}
            {agent.inputs && agent.inputs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-vision-charcoal">
                    Inputs
                  </CardTitle>
                  <CardDescription>
                    Required parameters for this agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {agent.inputs.map((input, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-vision-ochre rounded-full"></div>
                        <span className="text-sm text-vision-charcoal/80">{input}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Example Uses */}
            {agent.example_uses && agent.example_uses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-vision-charcoal">
                    Example Uses
                  </CardTitle>
                  <CardDescription>
                    Sample applications of this agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agent.example_uses.map((example, index) => (
                      <p key={index} className="text-sm text-vision-charcoal/80 leading-relaxed">
                        {example}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status & Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-vision-charcoal">
                  Agent Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Status:</span>
                  <Badge className={getAgentStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Category:</span>
                  <span className="text-sm text-vision-charcoal/80">{agent.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Trigger:</span>
                  <span className="text-sm text-vision-charcoal/80">{agent.trigger_type || 'manual'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Created:</span>
                  <span className="text-sm text-vision-charcoal/80">{formatDate(agent.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-vision-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-vision-charcoal/60">
              <p>Category: {agent.category}</p>
              <p>Trigger Type: {agent.trigger_type || 'manual'}</p>
              <p>Created on {formatDate(agent.created_at)}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/agents">
                View All Agents
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 